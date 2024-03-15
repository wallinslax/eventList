class TodoModel {
  constructor() {
    this.todos = [];
    this.baseURL = "http://localhost:3000/todos";
    this.readTodos();
  }

  async addTodo(todoText) {
    const newTodo = {
      todo: todoText,
      compeleted: false,
    };

    const response = await fetch(this.baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    const confirmedTodo = await response.json();
    this.todos.push(confirmedTodo);
    console.log("New todo added:", confirmedTodo);
    this.onChange(this.todos);
  }

  async deleteTodo(id) {
    await fetch(`${this.baseURL}/${id}`, {
      method: "DELETE",
    });
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.onChange(this.todos);
  }

  async readTodos() {
    const response = await fetch(this.baseURL);
    const todos = await response.json();
    this.todos = todos;
    this.onChange(this.todos);
  }

  // Placeholder for the change listener
  onChange(todos) {}
}

class TodoView {
  constructor() {
    this.newTodoInput = document.getElementById("new-todo");
    this.addButton = document.getElementById("add-todo-btn");
    this.todoListDiv = document.querySelector(".todo-list");

    this.addButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.onAddTodo(this.newTodoInput.value);
    });
  }

  onAddTodo() {}

  onDeleteTodo(id) {}

  render(todos) {
    this.todoListDiv.innerHTML = ""; // Clear the list
    todos.forEach((todo) => {
      const todoDiv = document.createElement("div");
      todoDiv.className = "todo";
      todoDiv.innerHTML = `
                <div class="todo__title">${todo.todo}</div>
                <div class="todo__actions">
                    <button class="todo__del-btn">Delete</button>
                </div>
            `;
      this.todoListDiv.appendChild(todoDiv);

      todoDiv.querySelector(".todo__del-btn").addEventListener("click", () => {
        console.log("delete button clicked");
        console.log("to be deleted todo id:", todo.id);
        this.onDeleteTodo(todo.id);
        // this._onDeleteTodo && this._onDeleteTodo(todo.id);
      });
    });
  }
}

class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Linking model and view via callbacks
    this.model.onChange = (todos) => this.view.render(todos);
    this.view.onAddTodo = (todoText) => this.model.addTodo(todoText);
    this.view.onDeleteTodo = (id) => {
      console.log("Deleting todo with ID:", id);
      this.model.deleteTodo(id);
    };

    // Initial render
    this.view.render(this.model.todos);
  }
}

const app = new TodoController(new TodoModel(), new TodoView());
