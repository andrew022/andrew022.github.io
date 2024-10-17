// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToGrid(task);
    });

    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.forEach(task => {
        addCompletedTask(task);
    });

    // Update the background color based on the number of tasks loaded
    updateTaskGridBackground(); 
}

// Function to add a task to the grid
function addTaskToGrid(task) {
    const taskGrid = document.getElementById('taskGrid');
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.style.backgroundColor = shouldHighlight(task.dateTime) ? 'lightcoral' : 'white';

    // Create countdown display
    const countdownDisplay = document.createElement('div');
    countdownDisplay.className = 'countdown-display';
    
    // Add HTML for task details and countdown
    taskCard.innerHTML = `
        <strong><u>Task</u></strong><br> ${task.name}<br>
        <strong><u>Due</u></strong><br> ${new Date(task.dateTime).toLocaleString()}<br>
        ${task.assignedTo ? `<strong><u>End User</u></strong><br> ${task.assignedTo}<br>` : ''}
        <strong><u>Time Left</u></strong><br>
    `;
    
    // Append countdown display to task card
    countdownDisplay.style.fontSize = 'smaller'; // Make text smaller
    taskCard.appendChild(countdownDisplay);
    
    // Complete button
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.textContent = 'Complete';
    taskCard.appendChild(completeButton);

    // Function to update the countdown
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = new Date(task.dateTime).getTime() - now;

        // Calculate time components
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result
        if (distance < 0) {
            countdownDisplay.innerHTML = "EXPIRED";
            clearInterval(countdownInterval); // Clear the interval if time is up
        } else {
            countdownDisplay.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        }
    }

    // Update the countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Add event listener for the complete button
    completeButton.addEventListener('click', function() {
        completeTask(task);
        taskGrid.removeChild(taskCard);
        clearInterval(countdownInterval); // Clear the interval when the task is completed
        updateTaskGridBackground();
    });

    taskGrid.appendChild(taskCard);
    updateTaskGridBackground();
}

// Function to check if a task should be highlighted
function shouldHighlight(dateTime) {
    const now = new Date();
    const taskTime = new Date(dateTime);
    const oneHourInMillis = 60 * 60 * 1000;
    return (taskTime - now) <= oneHourInMillis && (taskTime - now) > 0;
}

// Function to save tasks to localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to move task to completed tasks
function completeTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Remove the completed task from the tasks array
    const updatedTasks = tasks.filter(t => t.name !== task.name || t.dateTime !== task.dateTime);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.push(task);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    addCompletedTask(task);
}

// Function to add a completed task to the dropdown
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

// Function to update the background of the task grid
function updateTaskGridBackground() {
    const taskGrid = document.getElementById('taskGrid');
    if (taskGrid.childElementCount > 0) {
        taskGrid.style.backgroundColor = 'transparent';
    } else {
        taskGrid.style.backgroundColor = 'transparent'; // Set to transparent if no tasks
    }
}

// Event listener for the add task button
document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskName = document.getElementById('task').value;
    const dateTime = document.getElementById('dateTime').value;
    const assignedTo = document.getElementById('assignedTo').value;

    if (taskName && dateTime) {
        const task = {
            name: taskName,
            dateTime: dateTime,
            assignedTo: assignedTo
        };

        // Save task to localStorage and add it to the grid
        saveTask(task);
        addTaskToGrid(task);

        // Clear input fields
        document.getElementById('task').value = '';
        document.getElementById('dateTime').value = '';
        document.getElementById('assignedTo').value = '';
    } else {
        alert('Please fill in the task and date/time.');
    }
});

// Function to toggle the visibility of completed tasks
document.getElementById('toggleCompleted').addEventListener('click', function() {
    const completedTasksList = document.getElementById('completedTasksList');
    if (completedTasksList.style.display === 'none') {
        completedTasksList.style.display = 'block';
        this.textContent = 'Hide Completed Tasks';
    } else {
        completedTasksList.style.display = 'none';
        this.textContent = 'Show Completed Tasks';
    }
});

// Function to clear completed tasks
function clearCompletedTasks() {
    localStorage.removeItem('completedTasks');
    const completedTasksList = document.getElementById('completedTasksList');
    completedTasksList.innerHTML = ''; // Clear the dropdown display
}

// Event listener for the clear completed tasks button
document.getElementById('clearCompletedTasks').addEventListener('click', clearCompletedTasks);

// Load tasks when the page is loaded
window.onload = loadTasks;
