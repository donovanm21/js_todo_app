
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

todoData = {
    id : "",
    user : "",
    category : {
        c1 : "general",
        c2 : "home",
        c3 : "work"
    },
    priority : {
        p1 : "high",
        p2 : "medium",
        p3 : "low"
    },
    todo_data : {
        task1 : {
            title : "Example 1",
            description : "Description for task 1",
            date_due : "",
            time_due : "",
            category : "general",
            priority : "medium",
            tags : ["general"]
        },
        task2 : {
            title : "Example 2",
            description : "Description for task 2",
            date_due : "",
            time_due : "",
            category : "work",
            priority : "high",
            tags : ["work"]
        },
        task3 : {
            title : "Example 3",
            description : "Description for task 3",
            date_due : "",
            time_due : "",
            category : "home",
            priority : "low",
            tags : ["home"]
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

APP_F1.
APP_F2.

Classes:

APP_C1. Main class for instantiating new tasks
APP_C2. Class for new categories
APP_C3. Class for new priority levels

*/

// APP_C1. Main class for instantiating new tasks
class Task {
    constructor(title, description, date_due, time_due, category, priority, tags) {
        this.title = title;
        this.description = description;
        this.date_due = date_due;
        this.time_due = time_due;
        this.category = category;
        this.priority = priority;
        this.tags = tags;
    }

    // Method to write new task to local storage
    storeTask(task) {
        if(localStorage.getItem('userData') != null) {
            const userData = getLocalData();
            if(userData['todo_data'][task] == null) {
                userData['todo_data'][task] = {};
                userData['todo_data'][task]['title'] = this.title;
                userData['todo_data'][task]['description'] = this.description;
                userData['todo_data'][task]['date_due'] = this.date_due;
                userData['todo_data'][task]['time_due'] = this.time_due;
                userData['todo_data'][task]['category'] = this.category;
                userData['todo_data'][task]['priority'] = this.priority;
                userData['todo_data'][task]['tags'] = this.tags;
                parseData(userData);
            } else {
                console.log('Task name '+ task +' already exist.');
            }
        } else {
            console.log('APP Error: No local store configured!');
        }
    }

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
}

// APP_C3. Class for new priority levels
class Priority {
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
}
