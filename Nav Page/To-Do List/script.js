function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToGrid(task);
    });

    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.forEach(task => {
        addCompletedTask(task);
    });

    updateTaskGridBackground(); 
}
function addTaskToGrid(task) {
    const taskGrid = document.getElementById('taskGrid');
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.style.backgroundColor = shouldHighlight(task.dateTime) ? 'lightcoral' : 'white';

    const countdownDisplay = document.createElement('div');
    countdownDisplay.className = 'countdown-display';

    taskCard.innerHTML = `
        <strong><u>Task</u></strong><br> ${task.name}<br>
        <strong><u>Due</u></strong><br> ${new Date(task.dateTime).toLocaleString()}<br>
        ${task.assignedTo ? `<strong><u>End User</u></strong><br> ${task.assignedTo}<br>` : ''}
        <strong><u>Time Left</u></strong><br>
    `;
    
    countdownDisplay.style.fontSize = 'smaller';
    taskCard.appendChild(countdownDisplay);

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.textContent = 'Complete';
    taskCard.appendChild(completeButton);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = new Date(task.dateTime).getTime() - now;

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            countdownDisplay.innerHTML = "EXPIRED";
            clearInterval(countdownInterval);
        } else {
            countdownDisplay.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);

    completeButton.addEventListener('click', function() {
        completeTask(task);
        taskGrid.removeChild(taskCard);
        clearInterval(countdownInterval);
        updateTaskGridBackground();
    });

    taskGrid.appendChild(taskCard);
    updateTaskGridBackground();
}
function shouldHighlight(dateTime) {
    const now = new Date();
    const taskTime = new Date(dateTime);
    const oneHourInMillis = 60 * 60 * 1000;
    return (taskTime - now) <= oneHourInMillis && (taskTime - now) > 0;
}
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function completeTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(t => t.name !== task.name || t.dateTime !== task.dateTime);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.push(task);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    addCompletedTask(task);
}
function addCompletedTask(task) {
    const completedTasksList = document.getElementById('completedTasksList');
    const completedTaskItem = document.createElement('div');
    completedTaskItem.className = 'completed-task';
    completedTaskItem.innerHTML = `
        <strong>Task:</strong> ${task.name}<br>
        <strong>Completed On:</strong> ${new Date().toLocaleString()}<br>
    `;
    completedTasksList.appendChild(completedTaskItem);
}
function updateTaskGridBackground() {
    const taskGrid = document.getElementById('taskGrid');
    if (taskGrid.childElementCount > 0) {
        taskGrid.style.backgroundColor = 'transparent';
    } else {
        taskGrid.style.backgroundColor = 'transparent';
    }
}
document.getElementById('addTask').addEventListener('click', function() {
    const taskName = document.getElementById('task').value;
    const dateTime = document.getElementById('dateTime').value;
    const assignedTo = document.getElementById('assignedTo').value;

    if (taskName && dateTime) {
        const task = {
            name: taskName,
            dateTime: dateTime,
            assignedTo: assignedTo
        };

        saveTask(task);
        addTaskToGrid(task);

        document.getElementById('task').value = '';
        document.getElementById('dateTime').value = '';
        document.getElementById('assignedTo').value = '';
    } else {
        alert('Please fill in the task and date/time.');
    }
});
document.getElementById('showCompleted').addEventListener('click', function() {
    const completedTasksList = document.getElementById('completedTasksList');
    if (completedTasksList.style.display === 'none') {
        completedTasksList.style.display = 'block';
        this.textContent = 'Hide Completed Tasks';
    } else {
        completedTasksList.style.display = 'none';
        this.textContent = 'Show Completed Tasks';
    }
});
function clearCompletedTasks() {
    localStorage.removeItem('completedTasks');
    const completedTasksList = document.getElementById('completedTasksList');
    completedTasksList.innerHTML = '';
}
document.getElementById('clearCompletedTasks').addEventListener('click', clearCompletedTasks);
window.onload = loadTasks;
