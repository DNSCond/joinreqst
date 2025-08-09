// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit, ConversationData, RedditAPIClient, ConversationStateFilter } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addMenuItem({
  location: 'subreddit',
  label: 'ArchiveAll',
  forUserType: 'moderator',
  async onPress(_event, context: Devvit.Context) {
    // ['all', 'new', 'inprogress', 'archived', 'appeals', 'join_requests', 'highlighted', 'mod', 'notifications', 'inbox', 'filtered', 'default']
    context.ui.showForm(queryAllFormKey);
  },
});

const queryAllFormKey = Devvit.createForm(
  {
    fields: [
      {
        type: 'select',
        name: 'type',
        label: 'type to archive?',
        options: [
          { label: 'all', value: 'all' },
          { label: 'new', value: 'new' },
          { label: 'in progress', value: 'inprogress' },
          //{ label: 'archived', value: 'archived' },
          { label: 'Ban appeals', value: 'appeals' },
          { label: 'join requests', value: 'join_requests' },
          { label: 'highlighted', value: 'highlighted' },
          // { label: 'mod Discussions', value: 'mod' },
          { label: 'notifications', value: 'notifications' },
          { label: 'inbox', value: 'inbox' },
          { label: 'filtered', value: 'filtered' },
          { label: 'default', value: 'default' },
        ],
        defaultValue: ['join_requests'],
        multiSelect: true,
        required: true,
      },
      {
        type: 'paragraph',
        name: 'message',
        label: 'send message to all users.',
        helpText: 'if you want to respond to all archived modmails the same way do it here. see readme for placeholders',
      },
    ],
    title: 'Archive settings',
    description: 'Youre about to archive all modmails of this type',
    acceptLabel: 'Submit',
  },
  async function (event, context: Devvit.Context) {
    const currentUser = await context.reddit.getCurrentUsername();
    if (currentUser === undefined) return context.ui.showToast(`there is no currentUser`);
    const subredditName = await context.reddit.getCurrentSubredditName();
    if (subredditName === undefined) return context.ui.showToast(`there is no subredditName`);

    const array = [];
    for (const type of event.values.type) {
      for await (const object of modmailPageination(context.reddit, type as ConversationStateFilter, subredditName)) {
        array.push(modmailArchive(object, event.values.message, currentUser, context));
      }
    }

    const counted = countBooleansAndNullishItems((await Promise.allSettled(array)).map(promise => promise.status === 'fulfilled'));

    context.ui.showToast(`archived ${counted.true} modmails${counted.false ? `, (${counted.false} failed)` : ''}!`);
  }
);

async function modmailArchive(conversationData: ConvoData, message: undefined | string, currentUser: string, devvitContext: Devvit.Context) {
  const conversationId = conversationData.id, subredditName = conversationData.subredditName ?? '[unknown Subreddit]',
    username = conversationData.conversation?.participant?.name ?? '[unknown User]', isAuthorHidden = true;
  if (message?.trim()) {
    await devvitContext.reddit.modMail.reply({
      body: message.replace(/{{author}}/i, username)
        .replace(/{{subreddit(?:name)?}}/i, subredditName)
        .replace(/{{user(?:name)?}}/i, username),
      conversationId, isAuthorHidden,
    });
  }
  await devvitContext.reddit.modMail.reply({
    body: `u/${currentUser} told me to archive this modmail`,
    conversationId, isInternal: true,
  });
  await devvitContext.reddit.modMail.archiveConversation(conversationId);
}

type ConvoData = { id: string, conversation: ConversationData, subredditName: string };

async function* modmailPageination(reddit: RedditAPIClient, state: ConversationStateFilter = "join_requests", subredditName: string): AsyncGenerator<ConvoData> {
  let continue_iterating = true, after: string | undefined = undefined;
  do {
    let loops = 0; const limit = 100, { conversations } =
      await reddit.modMail.getConversations({ state, limit, after, subreddits: [subredditName] });
    for (const [id, conversation] of Object.entries(conversations)) {
      yield { id, conversation, subredditName }; after = id; loops++;
    } continue_iterating = !(after === undefined) && (loops > 0);
  } while (continue_iterating);
}

function countBooleans(array: any[]): { true: number, false: number } {
  array = Array.from(array ?? [], b => Boolean(b));
  const result = { true: 0, false: 0 };
  for (let e of array) {
    if (e) result.true += 1;
    else result.false += 1;
  } return result;
}

function countBooleansAndNullishItems(array: any[]): { true: number, false: number, nullish: number } {
  array = Array.from(array ?? [], b => (b === null || b === undefined) ? null : Boolean(b));
  const result = { true: 0, false: 0, nullish: 0 };
  for (let e of array) {
    if (e === null) result.nullish += 1;
    else if (e) result.true += 1;
    else result.false += 1;
  } return result;
}

function countTypes(array: any[]): {
  true: number,
  false: number,
  null: number,
  undefined: number,
  number: number,
  BigInt: bigint,
  Symbol: number,
  NaN: number,
  P_Infinity: number,
  N_Infinity: number,
  string: number,
  object: number,
  function: number,
} {
  array = Array.from(array ?? []);
  const number = 0, bigint = 0n, result = {
    true: number,
    false: number,
    null: number,
    undefined: number,
    number: number,
    BigInt: bigint,
    Symbol: number,
    NaN: number,
    P_Infinity: number,
    N_Infinity: number,
    string: number,
    object: number,
    function: number,
  };
  for (let e of array) {
    if (e === null) {
      result.null += 1;
    } else if (Number.isNaN(e)) {
      result.NaN += 1;
    } else if (e === +Infinity) {
      result.P_Infinity += 1;
    } else if (e === -Infinity) {
      result.N_Infinity += 1;
    } else switch (typeof e) {
      case "undefined": result.undefined += 1; break;
      case "function": result.function += 1; break;
      case "bigint": result.BigInt += 1n; break;
      case "symbol": result.Symbol += 1; break;
      case "number": result.number += 1; break;
      case "string": result.string += 1; break;
      case "object": result.object += 1; break;
      case 'boolean':
        if (e) result.true += 1;
        else result.false += 1;
    }
  } return result;
}

export default Devvit;
