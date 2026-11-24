# Test plan — Todo / TablesDB data layer

Epic: Node Todo app (TablesDB `todo`, Storage `task-attachments`)

## Risk tiers

| ID | Behavior | Risk |
|----|----------|------|
| SC-todo-P0-01 | `createRow` / `updateRow` / `deleteRow` always pass `databaseId`, `tableId`, `rowId` | P0 |
| SC-todo-P0-02 | Updates reject missing task id before calling SDK | P0 |
| SC-todo-P0-03 | Owner mismatch blocks update/delete | P0 |
| SC-todo-P1-04 | Search uses fulltext or falls back to `contains` on `title` | P1 |
| SC-todo-P1-05 | Optional columns omit empty strings (`listId`, `dueDate`, `attachmentId`) | P1 |
| SC-todo-P2-06 | Live isolation script `verify-todo-live.sh` | P2 |

## Levels

- **Unit:** `src/lib/tasks.test.ts`, `lists.test.ts`, `attachments.test.ts` with mocked `TablesDB` / `Storage`.
- **Integration:** `scripts/verify-todo-live.sh`, optional `scripts/verify-todo-crud-live.sh`.
- **E2E:** manual / future Playwright (out of scope this pass).

## Fixtures

- `createMockTablesDB()` records last call args per method.
- Shared `TASKS_TABLE_ID` / `TODO_DATABASE_ID` constants.

## NFR

- `npm run preflight` on every PR.
- Provision script asserts `title_search` fulltext index exists.