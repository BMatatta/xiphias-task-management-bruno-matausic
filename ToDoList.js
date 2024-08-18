const listTemplate = document.createElement("template");
listTemplate.innerHTML = `
<style>
.actions{
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
}

.actions > div{
  margin-bottom: 2rem;
}

.forms{
  display: flex;
  flex-wrap: wrap;
  max-width: 60rem;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.forms > form {
    display: flex;
    flex-wrap: nowrap;
    column-gap: 0.5rem;
}

.delete-container{
  max-width: 40rem;
  width: 100%;
  display: flex;
  gap: 1rem;
}

.task-list{
  padding: 2rem 4rem;
  background-color: #faf5eb;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
}

.task-list todo-item {
  flex: 1 0 21%;
  margin: 0.5rem;
  text-align: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  border: 1px solid black;
  padding: 1rem;
  gap: 1rem;
}

todo-item[checked="false"]{
  text-decoration: none;
}

todo-item[checked="true"]{
  color: grey;
}

todo-item.API-task{
  color: blue;
}

todo-item.genrated-task{
  color: black;
}

@media only screen and (max-width: 1040px){
  .actions{
    justify-content: center;
  }

  .forms{
    justify-content: space-around;
  }
}


</style>

<div class="actions">
  <div class=forms>
    <form class="forms__task">
      <input type="text" id="forms__task--newTask" name="forms__task--newTask" placeholder="Task name">
      <button type="submit">Add task manually</button>
    </form>

    <form class="forms__api">
      <input type="number" id="forms__task--newAPI" name="forms__task--newAPI" placeholder="Number of tasks">
      <button type="submit">Fetch tasks</button>
    </form>
  </div>

  <div class="delete-container">
    <button id="delate-all">Delete all tasks</button>
    <button id="delete-api">Delete API tasks</button>
    <button id="delete-manual">Delete manual tasks</button>
  </div>
</div>

<div class="task-list"></div>

<h2 class="completion">Number of copleted tasks is: <span class="completion-done"><slot name="completion-done"></slot></span></h2>
`;

class ToDoList extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: "open"});
    shadow.append(listTemplate.content.cloneNode(true));
    this.taskForm = shadow.querySelector(".forms__task");
    this.apiForm = shadow.querySelector(".forms__api");
    this.taskInput = shadow.getElementById("forms__task--newTask");
    this.apiInput = shadow.getElementById("forms__task--newAPI");
    this.taskList = shadow.querySelector(".task-list");
    this.count = Number(this.getAttribute("count"));
    this.completion = shadow.querySelector(".completion-done");
    this.deleteAll = shadow.querySelector(".delete-container");
  }

  connectedCallback() {
    this.taskForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!this.taskInput.value) {
        alert("Task name can't be empty!");
        return;
      }
      this.addNewTask(this.taskInput.value);
    });

    this.apiForm.addEventListener("submit", e => {
      e.preventDefault();
      const tasksRetrieve = Number(this.apiInput.value);
      if (!this.apiInput.value) {
        alert("Please eneter number of tasks to retrieve!");
        return;
      }

      this.getDummyTasks(tasksRetrieve);
    });

    this.deleteAll.addEventListener("click", this.handleDeleteTasks.bind(this));

    this.addEventListener("item-checked", this.handleCheckedChange);
  }

  static get observedAttributes() {
    return ["count"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "count") this.completion.innerText = newValue;
  }

  disconnectedCallback() {
    console.log("disconnected");
  }

  addNewTask(taskName, fetched = false) {
    if (!taskName) return;
    const newTask = document.createElement("todo-item");
    fetched
      ? newTask.classList.add("API-task")
      : newTask.classList.add("genrated-task");
    newTask.innerText = taskName;
    this.taskList.append(newTask);
    this.taskForm.reset();
  }

  handleCheckedChange(e) {
    if (e.detail.newValue === "false" && this.count == 0) return;
    e.detail.newValue === "true" ? this.count++ : this.count--;
    this.setAttribute("count", this.count);
  }

  handleDeleteTasks(e) {
    let allItems;
    if (e.target.id === "delate-all") {
      allItems = this.taskList.querySelectorAll("todo-item");
    }
    if (e.target.id === "delete-api") {
      allItems = this.taskList.querySelectorAll(".API-task");
    }
    if (e.target.id === "delete-manual") {
      allItems = this.taskList.querySelectorAll(".genrated-task");
    }
    this.taskDeletion(allItems);
  }

  taskDeletion(toDelete) {
    toDelete.forEach(item => {
      if (
        item.getAttribute("checked") &&
        item.getAttribute("checked") !== "false"
      ) {
        this.count--;
        this.setAttribute("count", this.count);
      }
      item.remove();
    });
  }

  async getDummyTasks(numTasks) {
    try {
      const res = await fetch(`https://dummyjson.com/todos?limit=${numTasks}`);
      const data = await res.json();
      console.log(data);

      data.todos.forEach(APItask => {
        this.addNewTask(APItask.todo, true);
      });
      alert("Tasks retrieved successfuly");
    } catch (error) {
      alert(error.message);
    }
  }
}

customElements.define("todo-list", ToDoList);
