# JoinRequest Archiver

Automatically archives all pending join requests for a subreddit.

## Use Case

After successfully reclaiming a **Private** or **Restricted** subreddit through [r/redditrequest](https://reddit.com/r/redditrequest), you'll likely end up with a backlog of join requests. This bot helps you bulk-clear them in one go. (or at least it would, if it worked)

## Activation

Access the bot via the subreddit menu item labeled "ArchiveAll" in your subreddit's moderator tools.
When activated, the bot adds a private note to each archived modmail, stating "u/[YourUsername] told me to archive this modmail"
ensuring transparency with your moderator team. (and even outside before bug in version "0.1.2 - heatedFixtionallity")

## Custom Message Textbox

The bot includes a textbox for sending custom replies to users whose modmails are archived.
This feature, allows moderators to craft a message that is sent to all affected users.
Use placeholders like `{{author}}` or `{{subreddit}}` to customize the message dynamically.
For example, entering `Hello u/{{author}}, your request to join r/{{subreddit}} has been archived.`
will send a message to each user, replacing placeholders with their username and the subreddit name.

**Note**: leave the field empty to not send the message to the user.

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

## Supported Modmail Types

The bot supports archiving various modmail types, selectable via a multi-select dropdown in the ArchiveAll form:
- All
- New
- In Progress
- Ban Appeals
- Join Requests
- Highlighted
- Notifications
- Inbox
- Filtered
- Default

## Changelog

### 0.1.12: some minor changes

hopefully it doesnt spam anymore

### 0.1.9: upgradeRequirer

- upgradeRequirer

### 0.1.8: mistake of the readme

- changed default value from notifications to join requests
- now shows how much archived success it has

### 0.1.7: slice of the read me.

- updated readme
- thanks to grok for writing more of the readme

### 0.1.6: im not afraid of grok by xai.

- thanks to grok for adding "Custom Message Textbox" the readme
- updated readme

### 0.1.5: Promise.allSettled

- changed something that it no longer waits one by one. doing them all asynchronousl

### 0.1.2 - heatedFixtionallity (0.1.3, 0.1.4: updated version in readme)

- added so it only sees your own subreddit, hopefully.
- [fixes "warning to everyone using JoinRequest archiver. archives everything, even across subreddits"](https://www.reddit.com/user/antboiy/comments/1mk0zsy/warning_to_everyone_using_joinrequest_archiver/)

### 0.1.1 - unNeededFunctionallity

- removed some unNeededFunctionallity

### 0.1.0 - updated ReaDME

- ReaDME

### 0.0.7 - added options for other types

- added options for other types

### 0.0.6 - updated ReadME

- thanks to chatgpt for decorating the readme

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

thanks to chatgpt for decorating the readme in 0.0.6; and grok in 0.1.6;
