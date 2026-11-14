# Milestones

## M0 Proposal (week 3)

See `PROPOSAL.md` (problem, roles, 9 user stories, MVP scope, 3 entities, stretch feature).

### Explain: Which story did you cut from the MVP, and why?

I cut story 8 (search, filter and pagination) and story 9 (admin list of users). Neither is needed for the core loop of registering, creating a task, editing it and marking it completed, so the app is useful without them. Story 8 is my stretch feature and I build it after the must-have stories, once the basic task list works. Story 9 only lets the admin monitor use, and no student depends on it, so it is the first thing I drop if time runs short.


## M1 Frontend prototype (week 5)

| Checklist item | Where |
|---|---|
| Wireframes of the main screens in `docs/` | `docs/wireframes.svg` (dashboard, task list, task detail, task form) |
| Vue 3 + TypeScript app with Vite, strict mode on, ESLint passes | `web/` (`"strict": true` in `tsconfig.json`, `npm run lint`) |
| At least 4 routes, including a detail page with a route parameter | `web/src/router/index.ts`: `/`, `/tasks`, `/tasks/new`, `/tasks/:id`, `/tasks/:id/edit`, 404 |
| At least one form with client-side validation | `web/src/views/TaskFormView.vue` with `web/src/utils/validation.ts` |
| A Pinia store and a service layer calling a mock API | `web/src/stores/taskStore.ts`, `web/src/services/taskService.ts`, `web/src/mocks/db.json` |
| Loading, empty and error states visible | `StateLoading`, `StateEmpty`, `StateError` components; the footer checkbox "Simulate an API error" shows the error state |

### Explain: What state lives in the store and what stays inside a component? Why?

The store holds state that more than one page needs, or that must survive navigation: the list of tasks, the task currently being viewed, the loading and error flags of API calls, and the search text and status filter. Dashboard, list and detail all read the same tasks, so the counts always agree and a change made in one place (marking a task completed) shows up everywhere without another request. The filter is in the store so it is still there when the student opens a task and comes back to the list.

State that only one component cares about stays inside that component: the form fields, which fields the student has touched, the validation messages, and whether the "Delete this task?" confirmation is open. A half-typed form is a draft, not data; putting it in the store would leak it to other pages and leave stale values behind after the student leaves the form. Keeping it local means leaving the page discards it, and nothing else in the app can depend on it by accident.
