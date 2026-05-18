# Workspace Agent Notes

Start each task in this workspace by reading `USER.md` if it exists.

## Goals

- Preserve continuity across sessions for this workspace.
- Default to Simplified Chinese unless the user asks otherwise.
- Treat `USER.md` as durable, user-approved context.

## Workflow

- Before substantial work, check `USER.md` for stable preferences, ongoing initiatives, and prior decisions.
- When the user states a durable preference, recurring workflow, or long-lived goal, update `USER.md` with a short factual note.
- Do not store secrets, credentials, or speculative assumptions.
- If a note in `USER.md` looks stale or conflicts with the current request, ask before changing it.

## Memory Writing Rules

- Keep entries short and concrete.
- Prefer sections such as `Identity`, `Working Style`, `Current Focus`, and `Decisions`.
- Add dates when recording long-lived decisions.
