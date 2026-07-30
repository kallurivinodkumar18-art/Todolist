const API = "http://localhost:5000/api/tasks";

const token = localStorage.getItem("token");

// Redirect to login if not logged in
if (!token) {
    window.location.href = "login.html";
}

// Load all tasks
async function loadTasks() {

    const response = await fetch(API, {
        headers: {
            Authorization: token
        }
    });

    const tasks = await response.json();

    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {

        let li = document.createElement("li");

        li.innerHTML = `
            ${task.completed ? "✅" : "⏳"} ${task.task}

            <button onclick="completeTask('${task._id}', ${!task.completed})">
                ${task.completed ? "Pending" : "Complete"}
            </button>

            <button onclick="deleteTask('${task._id}')">
                Delete
            </button>
        `;

        list.appendChild(li);

    });

}

// Add Task
async function addTask() {

    const input = document.getElementById("taskInput");

    if (input.value === "") {
        alert("Enter a task");
        return;
    }

    await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },

        body: JSON.stringify({
            task: input.value
        })

    });

    input.value = "";

    loadTasks();
}

// Delete Task
async function deleteTask(id) {

    await fetch(API + "/" + id, {

        method: "DELETE",

        headers: {
            Authorization: token
        }

    });

    loadTasks();
}

// Complete / Pending
async function completeTask(id, status) {

    await fetch(API + "/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },

        body: JSON.stringify({
            completed: status
        })

    });

    loadTasks();

}

// Show Completed
async function showCompleted() {

    const response = await fetch(API, {
        headers: {
            Authorization: token
        }
    });

    const tasks = await response.json();

    document.getElementById("taskList").innerHTML = "";

    tasks.filter(task => task.completed).forEach(task => {

        document.getElementById("taskList").innerHTML += `
        <li>
            ✅ ${task.task}
        </li>
        `;

    });

}

// Show Pending
async function showPending() {

    const response = await fetch(API, {
        headers: {
            Authorization: token
        }
    });

    const tasks = await response.json();

    document.getElementById("taskList").innerHTML = "";

    tasks.filter(task => !task.completed).forEach(task => {

        document.getElementById("taskList").innerHTML += `
        <li>
            ⏳ ${task.task}
        </li>
        `;

    });

}

// Logout
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}

// Load tasks automatically
loadTasks();