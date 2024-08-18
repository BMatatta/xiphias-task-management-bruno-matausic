#Instructions for running the task management app

To run this app on you local computer, plese install the latest version of Vite.
After downloading the files and opening the project run "npm run build" to build the app and "npm run dev" in the terminal of your IDE.

Usage
This is a task management application in which the user can add his/her own tasks by entering the name of the task in the input field labeled "Task field". Other than adding your own task, users can generate tasks from the DummyJSON ToDo API by writting a number in the input field "Number of tasks" and fetching them from the API.
On the right side of the header is section of varios delete options. "Delete all tasks" deletes all items from the task list, "Delete API tasks" deletes all API fetched tasks and "Delete manual tasks" deletes all tasks that were manually added.
Once a task is on the list it can be checked to mark its completion or uncompletion and removed by clicking the delete button (X).
Underneath the task list a tracker can be found which changes on each completion, uncompletion or removal of the task while it was completed.
