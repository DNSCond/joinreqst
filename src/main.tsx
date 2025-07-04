// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit, ConversationData, RedditAPIClient } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addMenuItem({
  location: 'subreddit',
  label: 'archive all join requests',
  forUserType: 'moderator',
  async onPress(_event, context: Devvit.Context) {
    const { reddit } = context; let removed = 0;
    context.ui.showToast(`starting`);
    for await (const element of modmailPageination(reddit)) {
      if (/^\[join]/i.test(String(element.subject)) && element.id) {
        reddit.modMail.archiveConversation(element.id); removed++;
      }
    }
    context.ui.showToast(`archived ${removed} modmails`);
  },
});

async function* modmailPageination(reddit: RedditAPIClient): AsyncGenerator<ConversationData> {
  let continue_iterating = true, after: string | undefined = undefined;
  do {
    const { conversations } = await reddit.modMail.getConversations({
      state: 'join_requests', limit: 100, after,
    });

    for (const conversation of Object.values(conversations)) {
      yield conversation; after = conversation.id;
    }
  } while (continue_iterating);
}

export default Devvit;
