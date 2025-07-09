// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit, ConversationData, RedditAPIClient } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addMenuItem({
  location: 'subreddit',
  label: 'archive all join requests',
  forUserType: 'moderator',
  async onPress(_event, context: Devvit.Context) {
    context.ui.showForm(showMyForm);
  },
});

Devvit.addMenuItem({
  location: 'subreddit',
  label: 'Query all join requests',
  forUserType: 'moderator',
  async onPress(_event, context: Devvit.Context) {
    let queried = 0;
    for await (const _ of modmailPageination(context.reddit)) queried++;
    context.ui.showToast(`there are ${queried} join requests`);
  },
});

async function* modmailPageination(reddit: RedditAPIClient): AsyncGenerator<{ id: string, conversation: ConversationData }> {
  let continue_iterating = true, after: string | undefined = undefined;
  do {
    const { conversations } = await reddit.modMail.getConversations({
      state: 'join_requests', limit: 100, after,
    }); let loops = 0;
    for (const [id, conversation] of Object.entries(conversations)) {
      yield { id, conversation }; after = id; loops++;
    } continue_iterating = !(after === undefined) && (loops > 0);
  } while (continue_iterating);
}

const showMyForm = Devvit.createForm(
  {
    fields: [
      {
        type: 'paragraph',
        name: 'message',
        label: 'send message to all users.',
        helpText: 'if you want to respond to all archived modmails the same way do it here. see readme for placeholders',
      },
    ],
    title: 'Archive settings',
    description: 'Youre about to archive all join requests',
    acceptLabel: 'Submit',
  },
  async function (event, context: Devvit.Context) {
    let removed = 0, currentUser = await context.reddit.getCurrentUsername();
    if (currentUser === undefined) return context.ui.showToast(`there is no currentUser`);
    const subredditName = await context.reddit.getCurrentSubredditName();
    if (subredditName === undefined) return context.ui.showToast(`there is no subredditName`);
    for await (const object of modmailPageination(context.reddit)) {
      if (event.values.message !== undefined) {
        const username = object.conversation?.participant?.name ?? '[unknown User]',
          conversationId = object.id, isAuthorHidden = true;
        await context.reddit.modMail.reply({
          body: event.values.message.replace(/{{author}}/i, username)
            .replace(/{{subreddit(?:name)?}}/i, subredditName ?? '[unknown Subreddit]')
            .replace(/{{user(?:name)?}}/i, username), conversationId, isAuthorHidden,
        });
      }
      await context.reddit.modMail.reply({
        body: `u/${currentUser} told me to archive this modmail`,
        conversationId: object.id, isInternal: true,
      });
      context.reddit.modMail.archiveConversation(object.id);
      removed++;
    }
    context.ui.showToast(`archived ${removed} modmails`);
  }
);

export default Devvit;
