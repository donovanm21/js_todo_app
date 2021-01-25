//////////////////////////
// JSON Storage process //
//////////////////////////

/* 

Purpose : Construct a storage mechanism to store all todo app relevant data to the local storage

- Set a default "template" for minimal data needed for the app to load and function.
- Check a unique field to see if it contains a value (user / id), if not have an prompt asking for a user's name.
- Once the app is initialized for a user, it will load the default app data (categories, priorities etc).
- Allow user to create categories and task etc. as well as removing the default example content.

Functions:

JSON_F1. Random string generator
JSON_F2. Locally stored parsed data
JSON_F3. Parse data and set local data
JSON_F4. Set unique app id
JSON_F5. Prompt for user's name
JSON_F6. App setup for local storage
JSON_F7. Last app update

*/

// Template for initializing the application on first load and load some example content.

todoData = {
    id : "",
    user : "",
    category : {
        c1 : "General",
        c2 : "Home",
        c3 : "Work"
    },
    priority : {
        p1 : "High",
        p2 : "Medium",
        p3 : "Low"
    },
    todo_data : {
        task0 : {
            title : "Example 1",
            description : "Description for task 1",
            date_due : "2021-03-10",
            time_due : "10:00",
            priority : "Medium",
            tags : ["General"],
            completed : false
        },
        task1 : {
            title : "Example 2",
            description : "Description for task 2",
            date_due : "2021-03-10",
            time_due : "10:00",
            priority : "High",
            tags : ["Work"],
            completed : false
        },
        task2 : {
            title : "Example 3",
            description : "Description for task 3",
            date_due : "2021-03-10",
            time_due : "10:00",
            priority : "Low",
            tags : ["Home", "General"],
            completed : false
        }
    },
    last_update : ""
};

// JSON_F1. Random string generator
function randomID() {
    const result = Math.random().toString(36).substring(2,8);
    return result;
 }

// JSON_F2. Locally stored parsed data
function getLocalData() {
    const userData = localStorage.getItem('userData');
    const parseData = JSON.parse(userData);
    return parseData;
}

// JSON_F3. Parse data and set local data
function parseData(data) {
    const userData = JSON.stringify(data);
    localStorage.setItem('userData', userData);
}

// JSON_F4. Set unique app id
function appId() {
    const localData = getLocalData();
    if(localData['id'] == "") {
        const appId = randomID();
        localData['id'] = appId;
        parseData(localData);
        lastUpdate();
    }
}

// JSON_F5. Prompt for user's name
function userName() {
    let user = prompt("Please enter your name");
    if (user != null) {
        const localData = getLocalData();
        localData['user'] = user;
        parseData(localData);
        lastUpdate();
    }
}

// JSON_F6. App setup for local storage
function appInit() {
    // Set JSON Data on app inilialization.
    if(localStorage.getItem('userData') == null) {
        const todoJSON = JSON.stringify(todoData);
        localStorage.setItem('userData', todoJSON);
        console.log('Userdata initialized');
    } else {
        console.log('Userdata already initialized');
    }
    // Get Stored local JSON data once set.
    if(localStorage.getItem('userData') != null) {
        const localData = getLocalData();
        if(localData['user'] == "") {
            userName();
        } else {
            const user = localData['user'];
            document.getElementById("greeting").innerHTML = "Hello " + user + "! Welcome to the best ToDo app!";
        }
    }
    appId();
}

// JSON_F7. Last app update
function lastUpdate() {
    const currentDate = Date.now();
    const localData = getLocalData();
    localData['last_update'] = currentDate;
    parseData(localData);
}

////////////////////////////////////////////////////
// Main Application logic, classes and functions. //
////////////////////////////////////////////////////

/*

Functions:

APP_F1. Get all current task keys
APP_F2. Simple function to retrieve all the tasks stored locally
APP_F3. Get the current task count in local storage
APP_F4. Create new category class and add new category to local storage.
APP_F5. Function to generate the category grid based on element count.
APP_F6. Category Array using getter method
APP_F7. Range Slider showing priority level
APP_F8. Add new task
APP_F9. Get all existing task from storage
APP_F10. Fetch task info and display it in preview
APP_F11. Update task info

Classes:

APP_C1. Main class for instantiating new tasks
APP_C2. Class for instantiating new categories
APP_C3. Class for instantiating new priority levels

*/

// APP_C1. Main class for instantiating new tasks
class Task {
    constructor(title, description, date_due, time_due, priority, tags, completed) {
        this.title = title;
        this.description = description;
        this.date_due = date_due;
        this.time_due = time_due;
        this.priority = priority;
        this.tags = tags;
        this.completed = completed;
    }

    // Method to write new task to local storage
    addTask() {
        if(localStorage.getItem('userData') != null) {
            const userData = getLocalData();
            const obj = userData['todo_data'];
            let objLen = Object.keys(obj).length;
            const taskNum = objLen;
            if(userData['todo_data']['task' + taskNum] == null) {
                userData['todo_data']['task' + taskNum] = {};
                userData['todo_data']['task' + taskNum]['title'] = this.title;
                userData['todo_data']['task' + taskNum]['description'] = this.description;
                userData['todo_data']['task' + taskNum]['date_due'] = this.date_due;
                userData['todo_data']['task' + taskNum]['time_due'] = this.time_due;
                userData['todo_data']['task' + taskNum]['priority'] = this.priority;
                userData['todo_data']['task' + taskNum]['tags'] = this.tags;
                userData['todo_data']['task' + taskNum]['completed'] = this.completed;
                parseData(userData);
            } else {
                console.log('Task name '+ task +' already exist.');
            }
        } else {
            console.log('APP Error: No local store configured!');
        }
    }
    // Static method for priority.

    // Remove a task
    deleteTask(task) {
        if(localStorage.getItem('userData') != null) {
            const userData = getLocalData();
            if(userData['todo_data'][task] != null) {
                delete userData['todo_data'][task];
                parseData(userData);
            } else {
                console.log('Task name '+ task +' do not exist.');
            }
        }
    }
}

// APP_C2. Class for new categories
class Category {
    constructor(value) {
        this.value = value;
    }
    // Adding a new category.
    addCategory() {
        if(localStorage.getItem('userData') != null) {
            const userData = getLocalData();
            const obj = userData['category'];
            let objLen = Object.keys(obj).length;
            const cNum = objLen + 1;
            if(Object.values(obj).indexOf(this.value) > -1) {
                console.log('Category '+ this.value +' already exist.');
            } else {
                userData['category']['c' + cNum] = this.value;
                parseData(userData);
            }
        } else {
            console.log('APP Error: No local store configured!');
        }
    }
    // Getter to check the current object count.
    get catArr() {
        const localData = getLocalData();
        const Obj = localData['category'];
        return Object.values(Obj);
    }
}

// APP_C3. Class for new priority levels
/*class Priority {
    constructor(value) {
        this.value = value;
    }
    // Adding a new priority level.
    addPriority() {
        if(localStorage.getItem('userData') != null) {
            const userData = getLocalData();
            const obj = userData['priority'];
            let objLen = Object.keys(obj).length;
            const pNum = objLen + 1;
            if(Object.values(obj).indexOf(this.value) > -1) {
                console.log('Priority '+ this.value +' already exist.');
            } else {
                userData['priority']['p' + pNum] = this.value;
                parseData(userData);
            }
        } else {
            console.log('APP Error: No local store configured!');
        }
    }
}*/

// APP_F1. Get all current task keys
function taskKeys() {
    const localData = getLocalData();
    const Obj = localData['todo_data'];
    return Object.keys(Obj);
}

// APP_F2. Simple function to retrieve all the tasks stored locally
function taskArr() {
    const localData = getLocalData();
    const Obj = localData['todo_data'];
    return Object.values(Obj);
}

// APP_F3. Get the current task count in local storage
function taskCount() {
    const localData = getLocalData();
    const obj = localData['todo_data'];
    let objLen = Object.keys(obj).length;
    return objLen;
}

// APP_F4. Create new category class and add new category to local storage.
function newTaskCategory() {
    let newCategory = document.getElementById('new-task-category').value;
    let previewCategory = document.getElementById('task-preview-category').value;
    if(newCategory != "") {
        let tempCat = new Category(newCategory);
        tempCat.addCategory();
    } else if(previewCategory != "") {
        let tempCat = new Category(previewCategory);
        tempCat.addCategory();
    } else {
        console.log('Error: Please enter a category');
    }
}

/* Future Improvement
switch(objLen) {
    case objLen % 3 == 0:
        for(i in obj) {
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj[i] +'</div>';
        }
        break;
    case objLen % 3 == 1:
        for(i in obj) {
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj[i] +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj[i] +'</div>';
        }
        break;
    case objLen % 3 == 2:
        for(i in obj) {
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj[i] +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj[i] +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-bottom">'+ obj[i] +'</div>';
        }
        break;
}
*/

// APP_F5. Function to generate the category grid based on element count. Not efficient but showscases the intention.
function catLoad() {
    const userData = getLocalData();
    const obj = userData['category'];
    let objLen = Object.keys(obj).length;
    switch (objLen) {
        case 3:
            // Code for 3 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            break;
        case 4:
            // Code for 4 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            break;
        case 5:
            // Code for 5 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-bottom">'+ obj.c5 +'</div>';
            break;
        case 6:
            // Code for 6 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            break;
        case 7:
            // Code for 7 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c7 +'</div>';
            break;
        case 8:
            // Code for 8 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c7 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-bottom">'+ obj.c8 +'</div>';
            break;
        case 9:
            // Code for 9 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c7 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c8 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c9 +'</div>';
            break;
        case 10:
            // Code for 10 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c7 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c8 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c9 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c10 +'</div>';
            break;
        case 11:
            // Code for 11 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c7 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c8 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c9 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c10 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-bottom">'+ obj.c11 +'</div>';
            break;
        case 12:
            // Code for 12 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c7 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c8 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c9 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c10 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c11 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c12 +'</div>';
            break;
        case 13:
            // Code for 13 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c7 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c8 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c9 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c10 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c11 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c12 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c13 +'</div>';
            break;
        case 14:
            // Code for 14 categories
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-top">'+ obj.c1 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c2 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c3 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c4 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c5 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c6 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c7 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c8 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c9 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c10 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c11 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c12 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item">'+ obj.c13 +'</div>';
            document.getElementById('category-grid').innerHTML += '<div class="grid-item item-bottom">'+ obj.c14 +'</div>';
            break;
      }
}

// APP_F6. Category Array using getter method
function getCategories(elementID, catID) {
    let catArray = new Category('tempArr');
    for(i = 0; i < catArray.catArr.length; i++) {
        document.getElementById(catID).innerHTML += '<div class="category-container" id="'+catID+'-cat-c'+i+'"></div>';
        document.getElementById(catID+'-cat-c'+i+'').innerHTML += '<label for='+ catArray.catArr[i] +'>'+catArray.catArr[i]+'';
        document.getElementById(catID+'-cat-c'+i+'').innerHTML += '<input id="'+elementID+'-c'+ i +'" type="checkbox" name="'+ catArray.catArr[i] +'" value="'+ catArray.catArr[i] +'"></label>';
    }
}

// APP_F7. Range Slider showing priority level
function sliderDisplay(sliderID, priorityID) {
    let slider = document.getElementById(sliderID);
    let priority = document.getElementById(priorityID);
    if(slider.value == 2){
        priority.innerHTML = '<textarea style="color: orange; display: none;" id="'+priorityID+'-ta">Medium</textarea>';
        priority.innerHTML += '<p style="color: orange;">Medium</p>';
    }
    // Update priority output on slider value change.
    slider.oninput = function() {
        if(slider.value == 1){
        priority.innerHTML = '<textarea style="color: lightblue; display: none;" id="'+priorityID+'-ta">Low</textarea>';
        priority.innerHTML += '<p style="color: lightblue;">Low</p>';
        } else if(slider.value == 2) {
            priority.innerHTML = '<textarea style="color: orange; display: none;" id="'+priorityID+'-ta">Medium</textarea>';
            priority.innerHTML += '<p style="color: orange;">Medium</p>';
        } else {
            priority.innerHTML = '<textarea style="color: red; display: none;" id="'+priorityID+'-ta">High</textarea>';
            priority.innerHTML += '<p style="color: red;">High</p>';
        }
    }
}

// APP_F8. Add new task
function addNewTask() {
    let taskTitle = document.getElementById('new-task-title').value;
    let catArray = new Category('tempArr');
    if(taskTitle != "") {
        let taskTitle = document.getElementById('new-task-title').value;
        let taskDescription = document.getElementById('new-task-description').value;
        let taskDateDue = document.getElementById('new-task-date-due').value;
        let taskTimeDue = document.getElementById('new-task-time-due').value;
        let taskPriority = document.getElementById('new-task-priority-ta').value;
        let taskTags = [];
        for(i = 0; i < catArray.catArr.length; i++) {
            let nCatSelected = document.getElementById('n-c'+i+'');
            if(nCatSelected.checked !== false) {
                let tempCat = document.getElementById('n-c'+i+'').value;
                taskTags.push(tempCat);
            }
            let pCatSelected = document.getElementById('p-c'+i+'');
            if(pCatSelected.checked !== false) {
                let tempCat = document.getElementById('p-c'+i+'').value;
                taskTags.push(tempCat);
            }
        }
        let tempNewCategory = document.getElementById('new-task-category').value;
        if(tempNewCategory != "") {
            taskTags.push(tempNewCategory);
        }
        let tempNewTask = new Task(taskTitle, taskDescription, taskDateDue, taskTimeDue, taskPriority, taskTags, false);
        tempNewTask.addTask();
        newTaskCategory();
    } else {
        console.log('Error: Please fill in all the fields');
    }
}

// APP_F9. Get all existing task from storage
function getTasks() {
    let taskArray = taskArr();
    let taskKeysArray = taskKeys();
    for(i = 0; i < taskArray.length; i++) {
        document.getElementById('task-wrapper').innerHTML += '<a id="'+i+'" onclick="fetchTask(this.id);previewTaskToggle();"><div class="task-item" id="task-item'+i+'"></div></a>';
        document.getElementById('task-item'+i+'').innerHTML += '<div name="task-key" class="task-key"><textarea id="task-key'+i+'">'+ taskKeysArray[i] +'</textarea></div>';
        document.getElementById('task-item'+i+'').innerHTML += '<div class="task-text">'+ taskArray[i]['title'] +'</div>';
        if(taskArray[i]['priority'] == "High") {
            for(n = 0; n < taskArray[i]['tags'].length; n++) {
                document.getElementById('task-item'+i+'').innerHTML += '<div class="icon-category icon-priority-high">'+ taskArray[i]['tags'][n][0] +'</div>';
            }
        } else if(taskArray[i]['priority'] == "Medium") {
            for(n = 0; n < taskArray[i]['tags'].length; n++) {
                document.getElementById('task-item'+i+'').innerHTML += '<div class="icon-category icon-priority-medium">'+ taskArray[i]['tags'][n][0] +'</div>';
            }
        } else {
            for(n = 0; n < taskArray[i]['tags'].length; n++) {
                document.getElementById('task-item'+i+'').innerHTML += '<div class="icon-category icon-priority-low">'+ taskArray[i]['tags'][n][0] +'</div>';
            }
        }
        document.getElementById('task-item'+i+'').innerHTML += '<div class="clear"></div>';
        let taskCompleted = taskArray[i]['completed'];
        if(taskCompleted == true) {
            let newClass = document.getElementById('task-item'+i);
            newClass.classList.add('task-completed');
        }
    }
}

// APP_F10. Fetch task info and display it in preview
function fetchTask(clickedId) {
    const catArray = new Category('tempArr');
    const taskArrKey = taskArr();
    let taskKey = document.getElementById('task-key'+clickedId).value;
    let taskTitle = taskArrKey[clickedId]['title'];
    let taskDescription = taskArrKey[clickedId]['description'];
    let taskDateDue = taskArrKey[clickedId]['date_due'];
    let taskTimeDue = taskArrKey[clickedId]['time_due'];
    let taskPriority = taskArrKey[clickedId]['priority'];
    let taskTags = taskArrKey[clickedId]['tags'];
    document.getElementById('task-preview-taskkey').value = taskKey;
    document.getElementById('task-preview-title').value = taskTitle;
    document.getElementById('task-preview-description').value = taskDescription;
    document.getElementById('task-preview-date-due').value = taskDateDue;
    document.getElementById('task-preview-time-due').value = taskTimeDue;
    for(i in catArray.catArr) {
        if(taskTags.includes(catArray.catArr[i])) {
            document.getElementById('p-c'+i+'').checked = true;
        }
    }
    let taskCompleted = taskArrKey[clickedId]['completed'];
    if(taskCompleted == true) {
        let taskDelete = document.getElementById('task-delete');
        taskDelete.classList.add('not-hidden');
        let taskUndo = document.getElementById('task-undo');
        taskUndo.classList.add('not-hidden');
    } else {
        let taskCompleted = document.getElementById('task-completed');
        taskCompleted.classList.add('not-hidden');
        let taskUpdate = document.getElementById('task-update');
        taskUpdate.classList.add('not-hidden');
    }
}

// APP_F11. Update task info
function updateTask(value) {
    let taskTitle = document.getElementById('task-preview-title').value;
    let catArray = new Category('tempArr');
    if(taskTitle != "") {
        let taskKey = document.getElementById('task-preview-taskkey').value;
        let taskTitle = document.getElementById('task-preview-title').value;
        let taskDescription = document.getElementById('task-preview-description').value;
        let taskDateDue = document.getElementById('task-preview-date-due').value;
        let taskTimeDue = document.getElementById('task-preview-time-due').value;
        let taskPriority = document.getElementById('task-preview-priority-ta').value;
        let taskTags = [];
        for(i = 0; i < catArray.catArr.length; i++) {
            let nCatSelected = document.getElementById('n-c'+i+'');
            if(nCatSelected.checked !== false) {
                let tempCat = document.getElementById('n-c'+i+'').value;
                taskTags.push(tempCat);
            }
            let pCatSelected = document.getElementById('p-c'+i+'');
            if(pCatSelected.checked !== false) {
                let tempCat = document.getElementById('p-c'+i+'').value;
                taskTags.push(tempCat);
            }
        }
        let tempNewCategory = document.getElementById('task-preview-category').value;
        if(tempNewCategory != "") {
            taskTags.push(tempNewCategory);
        }
        let localData = getLocalData();
        if(value == 'u') {
            localData['todo_data'][taskKey]['title'] = taskTitle;
            localData['todo_data'][taskKey]['description'] = taskDescription;
            localData['todo_data'][taskKey]['date_due'] = taskDateDue;
            localData['todo_data'][taskKey]['time_due'] = taskTimeDue;  
            localData['todo_data'][taskKey]['priority'] = taskPriority;
            localData['todo_data'][taskKey]['tags'] = taskTags;
        } else if(value == 'c'){
            localData['todo_data'][taskKey]['completed'] = true;
        } else if(value == 'un'){
            localData['todo_data'][taskKey]['completed'] = false;
        } else if(value == 'd'){
            let taskObj = localData['todo_data'];
            delete taskObj[taskKey];
        } else {
            console.log('Task Update');
        }
        parseData(localData);
        // Add new Category if one is specified
        newTaskCategory();
    } else {
        console.log('Error: Please fill in all the fields');
    }
}