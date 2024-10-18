document.addEventListener("DOMContentLoaded", () => {
    const taskGrid = document.getElementById('taskGrid');
    const completedTasksList = document.getElementById('completedTasksList');
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(addTaskToGrid);
		
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        completedTasks.forEach(addCompletedTask);
        updateTaskGridBackground();
    };
    const addTaskToGrid = (task) => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.style.backgroundColor = shouldHighlight(task.dateTime) ? 'lightcoral' : 'white';
		
        const countdownDisplay = document.createElement('div');
        countdownDisplay.className = 'countdown-display';
        countdownDisplay.style.fontSize = 'smaller';
        taskCard.innerHTML = `
            <strong><u>Task</u></strong><br>${task.name}<br>
            <strong><u>Due</u></strong><br>${new Date(task.dateTime).toLocaleString()}<br>
            ${task.assignedTo ? `<strong><u>End User</u></strong><br>${task.assignedTo}<br>` : ''}
            <strong><u>Time Left</u></strong><br>
        `;
        taskCard.appendChild(countdownDisplay);
        const completeButton = document.createElement('button');
        completeButton.className = 'complete-button';
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            completeTask(task);
            taskGrid.removeChild(taskCard);
            clearInterval(countdownInterval);
            updateTaskGridBackground();
        });
        taskCard.appendChild(completeButton);
        let countdownInterval = setInterval(() => {
            const distance = new Date(task.dateTime) - new Date();
			
            if (distance < 0) {
                countdownDisplay.innerHTML = "EXPIRED";
                clearInterval(countdownInterval);
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                countdownDisplay.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
            }
        }, 1000);
        taskGrid.appendChild(taskCard);
        updateTaskGridBackground();
    };
    const shouldHighlight = (dateTime) => {
        const taskTime = new Date(dateTime);
        return (taskTime - new Date()) <= 60 * 60 * 1000 && (taskTime - new Date()) > 0;
    };
    const saveTask = (task) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    const completeTask = (task) => {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.name !== task.name || t.dateTime !== task.dateTime);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        completedTasks.push(task);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        addCompletedTask(task);
    };
    const addCompletedTask = (task) => {
        const completedTaskItem = document.createElement('div');
        completedTaskItem.className = 'completed-task';
        completedTaskItem.innerHTML = `
            <strong>Task:</strong> ${task.name}<br>
            <strong>Completed On:</strong> ${new Date().toLocaleString()}<br>
        `;
        completedTasksList.appendChild(completedTaskItem);
    };
    const updateTaskGridBackground = () => {
        taskGrid.style.backgroundColor = taskGrid.childElementCount > 0 ? 'transparent' : 'transparent';
    };
    document.getElementById('addTask').addEventListener('click', () => {
        const taskName = document.getElementById('task').value;
        const dateTime = document.getElementById('dateTime').value;
        const assignedTo = document.getElementById('assignedTo').value;
        if (taskName && dateTime) {
            const task = { name: taskName, dateTime, assignedTo };
            saveTask(task);
            addTaskToGrid(task);
            document.getElementById('task').value = '';
            document.getElementById('dateTime').value = '';
            document.getElementById('assignedTo').value = '';
        } else {
            alert('Please fill in the task and date/time.');
        }
    });
    document.getElementById('showCompleted').addEventListener('click', function () {
        const isHidden = completedTasksList.style.display === 'none';
        completedTasksList.style.display = isHidden ? 'block' : 'none';
        this.textContent = isHidden ? 'Hide Completed Tasks' : 'Show Completed Tasks';
    });
    const clearCompletedTasks = () => {
        localStorage.removeItem('completedTasks');
        completedTasksList.innerHTML = '';
    };
    document.getElementById('clearCompletedTasks').addEventListener('click', clearCompletedTasks);
    loadTasks();
});