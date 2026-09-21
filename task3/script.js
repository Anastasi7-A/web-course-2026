let tasks = [];
let currentFilter = 'all';
let nextId = 1;

const inputEl = document.getElementById('task-input');
const addBtnEl = document.getElementById('add-btn');
const listEl = document.getElementById('task-list');
const counterEl = document.getElementById('counter');
const filterBtns = document.querySelectorAll('.filter-btn');

function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) {
        alert('Задача не может быть пустой!');
        return;
    }
    tasks.push({ id: nextId++, text: trimmedText, completed: false });
    inputEl.value = '';
    render();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        render();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id); 
    render();
}

function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    render();
}

function render() {

    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = tasks.length - completedCount;
    counterEl.textContent = `Осталось: ${activeCount}, Выполнено: ${completedCount}`;

    listEl.innerHTML = '';

    const visibleTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    const tasksHTML = visibleTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input type="checkbox" ${task.completed ? 'checked' : ''} class="toggle-checkbox">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Удалить</button>
        </li>
    `).join('');

    listEl.innerHTML = tasksHTML;
}

addBtnEl.addEventListener('click', () => addTask(inputEl.value));

inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask(inputEl.value);
});

listEl.addEventListener('click', (e) => {
    const target = e.target;
    const li = target.closest('.task-item');
    if (!li) return;
    
    const id = Number(li.dataset.id);

    if (target.classList.contains('delete-btn')) {
        deleteTask(id);
    } else if (target.classList.contains('toggle-checkbox') || target.classList.contains('task-text')) {
        toggleTask(id);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

render();
