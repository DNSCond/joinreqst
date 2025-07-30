// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit, ConversationData, RedditAPIClient, ConversationStateFilter } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

// Devvit.addMenuItem({
//   location: 'subreddit',
//   label: 'archive all join requests',
//   forUserType: 'moderator',
//   async onPress(_event, context: Devvit.Context) {
//     context.ui.showForm(showMyForm);
//   },
// });

// Devvit.addMenuItem({
//   location: 'subreddit',
//   label: 'Query all join requests',
//   forUserType: 'moderator',
//   async onPress(_event, context: Devvit.Context) {
//     let queried = 0;
//     for await (const _ of modmailPageination(context.reddit)) queried++;
//     context.ui.showToast(`there are ${queried} join requests`);
//   },
// });

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
        defaultValue: ['notifications'],
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
    let removed = 0, currentUser = await context.reddit.getCurrentUsername();
    if (currentUser === undefined) return context.ui.showToast(`there is no currentUser`);
    const subredditName = await context.reddit.getCurrentSubredditName();
    if (subredditName === undefined) return context.ui.showToast(`there is no subredditName`);

    for (const type of event.values.type) {
      for await (const object of modmailPageination(context.reddit, type as ConversationStateFilter)) {
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
        await context.reddit.modMail.archiveConversation(object.id);
        removed++;
      }
    }
    context.ui.showToast(`archived ${removed} modmails`);
  }
);

async function* modmailPageination(reddit: RedditAPIClient, state: ConversationStateFilter = "join_requests"):
  AsyncGenerator<{ id: string, conversation: ConversationData }> {
  let continue_iterating = true, after: string | undefined = undefined;
  do {
    let loops = 0; const limit = 100, { conversations } =
      await reddit.modMail.getConversations({ state, limit, after, });
    for (const [id, conversation] of Object.entries(conversations)) {
      yield { id, conversation }; after = id; loops++;
    } continue_iterating = !(after === undefined) && (loops > 0);
  } while (continue_iterating);
}

// const showMyForm = Devvit.createForm(
//   {
//     fields: [
//       {
//         type: 'paragraph',
//         name: 'message',
//         label: 'send message to all users.',
//         helpText: 'if you want to respond to all archived modmails the same way do it here. see readme for placeholders',
//       },
//     ],
//     title: 'Archive settings',
//     description: 'Youre about to archive all join requests',
//     acceptLabel: 'Submit',
//   },
//   async function (event, context: Devvit.Context) {
//     let removed = 0, currentUser = await context.reddit.getCurrentUsername();
//     if (currentUser === undefined) return context.ui.showToast(`there is no currentUser`);
//     const subredditName = await context.reddit.getCurrentSubredditName();
//     if (subredditName === undefined) return context.ui.showToast(`there is no subredditName`);
//     for await (const object of modmailPageination(context.reddit)) {
//       if (event.values.message !== undefined) {
//         const username = object.conversation?.participant?.name ?? '[unknown User]',
//           conversationId = object.id, isAuthorHidden = true;
//         await context.reddit.modMail.reply({
//           body: event.values.message.replace(/{{author}}/i, username)
//             .replace(/{{subreddit(?:name)?}}/i, subredditName ?? '[unknown Subreddit]')
//             .replace(/{{user(?:name)?}}/i, username), conversationId, isAuthorHidden,
//         });
//       }
//       await context.reddit.modMail.reply({
//         body: `u/${currentUser} told me to archive this modmail`,
//         conversationId: object.id, isInternal: true,
//       });
//       await context.reddit.modMail.archiveConversation(object.id);
//       removed++;
//     }

//     // for await (const object of modmailPageination(context.reddit, 'notifications')) {
//     //   if (object.conversation.authors.filter(m => m.name === 'AutoModerator').length > 0) {
//     // await context.reddit.modMail.reply({\body: `u/${currentUser} told me to archive this modmail`,
//     // conversationId: object.id, isInternal: true,});await context.reddit.modMail.archiveConversation
//     // (object.id); removed++;}}

//     context.ui.showToast(`archived ${removed} modmails`);
//   }
// );

export default Devvit;
