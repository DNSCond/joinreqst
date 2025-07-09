# JoinRequest Archiver

Automatically archives all pending join requests for a subreddit.

## Use Case

After successfully reclaiming a **Private** or **Restricted** subreddit through [r/redditrequest](https://reddit.com/r/redditrequest), you'll likely end up with a backlog of join requests. This bot helps you bulk-clear them in one go.

## Activation

Once installed, access the bot via the subreddit menu item.

## Placeholders

All placeholders are case-insensitive and can be used in message templates:

| Placeholder         | Replaced With           | Example    |
| ------------------- | ----------------------- | ---------- |
| `{{author}}`        | The author's username   | `antboiy`  |
| `{{username}}`      | Same as `{{author}}`    | `antboiy`  |
| `{{user}}`          | Same as `{{author}}`    | `antboiy`  |
| `{{subreddit}}`     | The subreddit's name    | `DrawMyOc` |
| `{{subredditName}}` | Same as `{{subreddit}}` | `DrawMyOc` |

> Tip: Use `u/{{author}}` or `r/{{subreddit}}` in messages to link to users or subreddits.

## Changelog

### 0.0.6 - updated ReadME

thanks to chatgpt for decorating the readme

### 0.0.5 - `sendAsSubreddit`

- Messages are now sent from the subreddit itself.

### 0.0.4 - `fixedIt`

- Fixed a bug that could cause infinite loops.
- Added a message box for custom replies.

### 0.0.3 - README Update

- Added a "Use Case" section.

### 0.0.2 - Initial Release

- Basic functionality working.
- Known bugs: some issues with toast notifications.

## credits

thanks to chatgpt for decorating the readme
