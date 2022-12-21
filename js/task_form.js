function taskformTemplate(category, color, title, description, duedate, priority, id) {
    return `
<div class="background" onclick="closePopup()">
</div>
    <div class="taskform">
        <div>
            <div class="category" style="background-color: ${color}">${category}</div>
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="duedate"><b>Due date:</b> ${duedate}</div>
            <div class="priority"><b>Priority:</b><div class="prioicon ${priority}">${priority}<img src="assets/img/${priority}.svg"></div></div>
            <div class="subtasks"><b>Subtasks:</b></div>
            <div class="subtaskwindow" id="subtasks"></div>
            <div class="assignedto"><b>Assigned To:</b>
                <div id="assignedto"></div>
            </div>
        </div>
            <div class="close" onclick="closePopup()">x</div>
            <div class="edit" onclick="renderEditTask(${id})"><img src="../assets/img/edit-button.png" alt="edit"></div>
    </div>`;
}

function renderAssignedTo(assignedTo) {
    for (let i = 0; i < assignedTo['user'].length; i++) {
        let user = assignedTo['user'][i];
        document.getElementById('assignedto').innerHTML += `
        <div class="user"><div class="name" style="background-color: ${user['iconcolor']}">${user['icon']}</div>${user['name']}</div>
        `;
    };
}

function renderSubTasks(id) {
    for (let i = 0; i < tasklist[id]['subtasks']['tasks'].length; i++) {
        let subtask = tasklist[id]['subtasks']['tasks'][i];
        if (subtask['completed'] == false){
        document.getElementById('subtasks').innerHTML += `
        <div class="subtask"><input type="checkbox" id="${i}" onchange="taskStatusChange(${i}, ${id})"><label for="${i}">${subtask['task']}</label></div>
        `;}else {
        document.getElementById('subtasks').innerHTML += `
        <div class="subtask"><input type="checkbox" id="${i}" onchange="taskStatusChange(${i}, ${id})" checked><label for="${i}">${subtask['task']}</label></div>
        `;
        }
    }
}

function renderEditTask(id){
    task = tasklist.filter(t => t['id'] == id);
    let title = task[0]['title'];
    let description = task[0]['description'];
    let duedateunformated = JSON.stringify(task[0]['duedate']);
    let year = duedateunformated.slice(0, 4);
    let month = duedateunformated.slice(4, 6);
    let day = duedateunformated.slice(6);
    let duedate = year + '-' + month + '-' + day;
    let priority = task[0]['priority'];
    let subtasks = task[0]['subtasks']['tasks'];
    document.getElementById('popup').innerHTML = editTaskTemplate(id);
    document.getElementById('titleinput').value = title;
    document.getElementById('descriptioninput').value = description;
    document.getElementById('duedate').value = duedate;
    loadSubtasks(subtasks, id);
}

function editTaskTemplate(id) {
    return `
    <div class="background" onclick="closePopup()"></div>
    <div class="taskform">
        <div>
            <div class="edittitle">Title <input type="text" required placeholder="Enter a Title" id="titleinput"></div>
            <div class="editdescription">Description <textarea id="descriptioninput" placeholder="Enter a Description" required></textarea></div>
            <div class="duedate">Due Date <input type="date" id="duedate" placeholder="dd/mm/yyyy" required></div>
            <div class="prio">Prio 
                <div class="prioselect">
                    <div class="prio-urgent" id="urgent" onclick="selectPrio('urgent')">Urgent <img src="assets/img/urgent.svg"></div>
                    <div class="prio-medium" id="medium" onclick="selectPrio('medium')">Medium <img src="assets/img/medium.svg"></div>
                    <div class="prio-low" id="low" onclick="selectPrio('low')">Low <img src="assets/img/low.svg"></div>
                </div>
            </div>
            <div class="editsubtask">
                Subtasks
                <div class="subtaskedit">
                    <input class="input-subtask" type="text" min="2" max="200" required
                    placeholder="Add new subtask" id="newsubtask">
                    <img src="./assets/img/plus-subtask.png" alt="Add" onclick="addNewSubask(${id})">
                </div>
                <div id="subtasks"></div>
            </div>
            <div class="assignedto">Assigned to <select id="assign" placeholder="Select contacts to assign"></select></div>
        </div>
        <div>
            <div class="close" onclick="closePopup()">x</div>
            <div class="editTask" onclick="editTask()"><img src="../assets/img/check-button.png" alt="Ok"></div>
        </div
    </div>
    `;
}

function loadSubtasks(subtasks, id) {
    document.getElementById('subtasks').innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        document.getElementById('subtasks').innerHTML += `
        <div class="subtask" id="subtask${i}">
            <div><p>${subtask['task']}</p></div>
            <div>
                <button onclick="deleteSubtask(${i}, ${id})">Delete</button>
                <button onclick="editSubtask(${i}, ${id})">Edit</button>
            </div>
        </div>
        `
    }
}

function addNewSubask(id) {
    let newtask = document.getElementById('newsubtask').value;
    tasklist[id]['subtasks']['tasks'].push({'task': newtask, 'completed': false})
    document.getElementById('newsubtask').value = '';
    loadAll();
    renderBoard();
    task = tasklist.filter(t => t['id'] == id);
    let subtasks = task[0]['subtasks']['tasks'];
    loadSubtasks(subtasks, id);
}

function deleteSubtask(index, id){
    task = tasklist.filter(t => t['id'] == id);
    task[0]['subtasks']['tasks'].splice(index, 1);
    let subtasks = task[0]['subtasks']['tasks'];
    save();
    loadAll();
    renderBoard();
    loadSubtasks(subtasks, id);
}

function editSubtask(index, id) {
    task = tasklist.filter(t => t['id'] == id);
    let subtask = task[0]['subtasks']['tasks'][index];
    document.getElementById(`subtask${index}`).innerHTML = `
    <textarea id="subedit${index}" cols="30" rows="10" minlength="2" maxlength="200">${subtask['task']}</textarea>
    <div>
        <button onclick="saveSubEdit(${index}, ${id})">Save</button>
        <button onclick="cancelSubEdit(${index}, ${id})">Cancel</button>
    </div>
    `
}

function saveSubEdit(index, id) {
    newsubtask = document.getElementById(`subedit${index}`).value;
    tasklist[id]['subtasks']['tasks'][index]['task'] = newsubtask;
    loadAll();
    renderBoard();
    document.getElementById(`subtask${index}`).innerHTML = `
    <div><p>${newsubtask}</p></div>
    <div>
        <button onclick="deleteSubtask(${index}, ${id})">Delete</button>
        <button onclick="editSubtask(${index}, ${id})">Edit</button>
    </div>
    `
}

function cancelSubEdit(index, id) {
    task = tasklist.filter(t => t['id'] == id);
    let subtask = task[0]['subtasks']['tasks'][index];
    document.getElementById(`subtask${index}`).innerHTML = `
    <div><p>${subtask['task']}</p></div>
    <div>
        <button onclick="deleteSubtask(${index}, ${id})">Delete</button>
        <button onclick="editSubtask(${index}, ${id})">Edit</button>
    </div>
    `
}

function taskStatusChange(task, id){
    if (tasklist[id]['subtasks']['tasks'][task]['completed'] == true){
        tasklist[id]['subtasks']['tasks'][task]['completed'] = false;
    } else {
        tasklist[id]['subtasks']['tasks'][task]['completed'] = true;
    }
    save();
    loadAll();
    renderBoard();
}

function selectPrio(prio) {
    if (prio == 'urgent'){
        document.getElementById('urgent').classList.add('urgent');
        document.getElementById('medium').classList.remove('medium');
        document.getElementById('low').classList.remove('low');
    }
    if (prio == 'medium'){
        document.getElementById('urgent').classList.remove('urgent');
        document.getElementById('medium').classList.add('medium');
        document.getElementById('low').classList.remove('low');
    }
    if (prio == 'low'){
        document.getElementById('urgent').classList.remove('urgent');
        document.getElementById('medium').classList.remove('medium');
        document.getElementById('low').classList.add('low');
    }
}