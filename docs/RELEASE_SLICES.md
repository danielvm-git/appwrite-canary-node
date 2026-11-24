# Node release slices

Ship with Conventional Commits + big-release on `main`:

| Tag | Commit type | Scope |
|-----|-------------|--------|
| v0.1.0 | `feat(shell)` | Landing, console, footers, health, CI |
| v0.2.0 | `feat(auth)` | Email session (already in `AuthPage`) |
| v0.3.0 | `feat(database)` | List/create documents |
| v0.4.0 | `feat(storage)` | Upload + file URL |
| v0.4.1 | `fix(footer)` | Patch proof |

Code for slices 2–4 is present; cut tags by merging focused commits to `main` one epic at a time.