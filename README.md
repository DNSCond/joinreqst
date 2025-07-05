# JoinRequest archiver.

takes all existing join requests and archives them.

## use case

after a successful [r/redditrequest](https://reddit.com/r/redditrequest) of a Private or Restricted subreddit you will have a lot of join requests. you can clear them all using this.

## activation

use the subreddit menuitem after installation.

## placeholders

these placeholders are all case insensitive

| placeholder | what it is replaced with | example |
|:------------|:-------------------------|--------:|
| `{{author}}` | the author's name (do /u/{{author}} for a link to the author's user page) | antboiy |
| `{{subreddit}}` | the subreddit's name (do /r/{{subreddit}} for a link to the subreddit) | DrawMyOc |
| `{{username}}` | the author's name (do /u/{{username}} for a link to the author's user page) | antboiy |
| `{{subredditName}}` | the subreddit's name (do /r/{{subredditName}} for a link to the subreddit) | DrawMyOc |
| `{{user}}` | the author's name (do /u/{{user}} for a link to the author's user page) | antboiy |

## changes

### 0.0.5: sendAsSubreddit

- now sends messages as subreddit.

### 0.0.4: fixedIt

- fixed bug about presumed infinite loops
- added a message box

### 0.0.3: updated README.

added a "use case"

### 0.0.2: inital release.

inital release.

still bugs with toasts.
