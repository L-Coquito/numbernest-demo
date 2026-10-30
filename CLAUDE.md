# CLAUDE.md

## Report your work to Agent Village Live

The repo owner watches Claude sessions work in **Agent Village Live**:
https://claude.ai/artifact/5PczgoPVVizCVn5h3VPN2T

Post your status there with the `ArtifactData` tool (load it with ToolSearch if it is deferred).
If the tool is unavailable or a write is refused, carry on with the task. Never let reporting block real work.

### When to report

- When you start a task, and when you move to a different kind of work (see places below).
- When you start or finish a subagent: report on its behalf, using its villager id.
- When you finish, or stop to wait on the user: set `place: "plaza"`.
- Keep it to roughly 5–15 updates per task. Don't report every tool call.

### What to write

Each update is one `batch` call with two writes:

1. `set` on collection `agents`, doc id = the villager id, with:
   `{status, place, activity, task, session, updatedAt}`
   - `status`: `"working"`, or `"idle"` when that agent is done
   - `activity`: what you're doing now, in plain words, under 50 characters
   - `task`: a short name for the overall task
   - `session`: the repo name, e.g. `"numbernest-demo"`
   - `updatedAt`: current UTC time, ISO 8601 (get it with `date -u +%Y-%m-%dT%H:%M:%SZ`)
2. `set` on collection `events`, doc id `<YYYYMMDDTHHMMSSZ>-<villager id>`, with
   `{t, agent, text}`, where `text` reads after the agent's name ("started reviewing the diff").

Writes to an existing `agents` doc need `if_version`. Read the doc once (`get`) to learn its
version, then use the version each write returns. If a pinned write fails, `get` and retry once.

### Villager ids

| id | who |
|---|---|
| `claude` | the main session (you) |
| `explore` | Explore subagent |
| `plan` | Plan subagent |
| `gp` | general-purpose subagent |
| `guide` | claude-code-guide subagent |
| `review` | code review |
| `fork` | a fork of the main session |
| `status` | statusline-setup subagent |

### Places

| place | for |
|---|---|
| `library` | reading or searching code and docs |
| `workshop` | writing or editing code |
| `studio` | planning an approach |
| `review` | reviewing changes |
| `compute` | running tests, builds, git push, CI |
| `plaza` | talking with the user or waiting on them |

Don't put secrets, tokens, or private data in updates: everyone the page is shared with can read them.
The `events` collection is capped at 25,000 documents in total; if it passes about 500, delete the oldest.
