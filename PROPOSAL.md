# Student Task Management System

## Problem

University students juggle assignments, labs and projects from several subjects, and deadlines are easy to forget when tasks live in chat messages and scattered notes. A web app that keeps every task, its subject and its due date in one place helps students finish work on time and see what is still pending.

## Users and roles

- Student: registers, logs in, and manages only their own tasks: creates, views, edits, deletes, marks them completed, searches and filters them, and checks their progress on a dashboard.
- Admin: logs in and manages the shared list of subjects (create, rename, delete), and views all registered users with how many tasks each has.

## User stories

1. As a student, I want to register and log in so that my tasks are private to me.
   Accepted when: registration needs a name, a valid email and a password of at least 8 characters; the password is stored hashed; a wrong password returns an error and does not log me in; after login I land on my dashboard.

2. As a student, I want to create a task with a title, subject, description and due date so that I remember what to do and by when.
   Accepted when: title (3 to 100 characters), subject and due date are required; the subject is chosen from the list the admin maintains; a due date in the past is rejected; the new task appears in my task list with status Pending.

3. As a student, I want to view my task list and open a task to see its details so that I can check what is coming up.
   Accepted when: the list shows only my tasks; the detail page shows title, subject, description, due date, status and creation date; the list and the detail page show loading, empty and error states.

4. As a student, I want to edit or delete my own tasks so that my list stays correct.
   Accepted when: I can change any field of my own task and the change is saved; I can delete my own task after confirming; another student's task cannot be edited or deleted by me (the API returns 403 or 404).

5. As a student, I want to mark a task as completed so that I can track what I have finished.
   Accepted when: a Pending task can be marked Completed; the status badge and the dashboard counts update.

6. As a student, I want a dashboard with the total, pending and completed counts so that I see my progress at a glance.
   Accepted when: the three counts match the data in my task list; the dashboard shows the tasks due next in date order.

7. As an admin, I want to create, rename and delete subjects so that students choose from a consistent list.
   Accepted when: only an admin can use the subject management page and endpoints (a student gets 403); a subject name must be unique; a subject that still has tasks cannot be deleted and the admin sees a clear message.

8. As a student, I want to search my tasks by title, filter by status or subject, and page through results so that I can find a task quickly.
   Accepted when: results update by title text, status and subject; the list shows 10 tasks per page with next and previous controls; a search with no match shows an empty state.

9. As an admin, I want to see all registered users and how many tasks each has so that I can monitor use of the system.
   Accepted when: the list is visible only to admins; it shows name, email, role and task count.

## MVP scope

Must have: story 1, 2, 3, 4, 5, 6, 7.
Nice to have: story 8 (it is the stretch feature, but it is built after the must-haves), story 9.

## Entities

| Entity | Main attributes | Relations |
|---|---|---|
| User | id, name, email, passwordHash, role (student or admin), createdAt | has many Tasks |
| Subject | id, name (unique) | has many Tasks |
| Task | id, title, description, dueDate, status (Pending or Completed), createdAt, userId, subjectId | belongs to one User; belongs to one Subject |

## Stretch feature

Search and pagination.
What it does in this app: a student searches their tasks by title, filters by status and subject, and browses the results 10 per page. The API takes `search`, `status`, `subjectId` and `page` query parameters and returns the page of tasks with the total count.

## Repository

https://github.com/sonitanhean5-hash/Student-Task-Manager
