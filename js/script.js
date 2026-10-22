console.log("script.js ladattu");

const form = document.querySelector("#todoForm");
const taskInput = document.querySelector("#taskInput");
const taskError = document.querySelector("#taskError");
const prioritySelect = document.querySelector("#prioritySelect");
const dueDate = document.querySelector("#dueDate");
const todoList = document.querySelector("#todoList");
const activeCount = document.querySelector("#activeCount");
const emptyMessage = document.querySelector("#emptyMessage");
const clearDoneBtn = document.querySelector("#clearDoneBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos") || "[]");
let currentFilter = "all";

render();

form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Submit laukesi, arvo:", taskInput.value);

    const text = taskInput.value.trim();

    if (text.length < 2) {
        taskError.textContent = "Tehtävän nimi tarvitsee vähintään 2 merkkiä.";
        taskInput.style.borderColor = "#e74c3c";
        return;
    }

    taskError.textContent = "";
    taskInput.style.borderColor = "";

    todos.push({
        id: Date.now(),
        text: text,
        priority: prioritySelect.value,
        due: dueDate.value || null,
        done: false
    });

    save();
    render();
    form.reset();
    taskInput.focus();
});

function render() {
    todoList.innerHTML = "";

    const filtered = todos.filter(t => {
        if (currentFilter === "active") return !t.done;
        if (currentFilter === "done") return t.done;
        return true;
    });

    emptyMessage.style.display = filtered.length ? "none" : "block";

    filtered.forEach(todo => {
        const li = document.createElement("li");
        li.style.cssText = "display:flex;gap:8px;padding:8px;border:1px solid #ccc;margin:4px 0;";
        if (todo.done) li.style.opacity = "0.5";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = todo.done;
        cb.addEventListener("change", () => {
            todo.done = !todo.done;
            save();
            render();
        });

        const span = document.createElement("span");
        span.textContent = todo.text + (todo.due ? ` (${todo.due})` : "");
        if (todo.done) span.style.textDecoration = "line-through";

        const del = document.createElement("button");
        del.textContent = "🗑️";
        del.addEventListener("click", () => {
            todos = todos.filter(t => t.id !== todo.id);
            save();
            render();
        });

        li.appendChild(cb);
        li.appendChild(span);
        li.appendChild(del);
        todoList.appendChild(li);
    });

    activeCount.textContent = todos.filter(t => !t.done).length;
}

function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        render();
    });
});

clearDoneBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.done);
    save();
    render();
});