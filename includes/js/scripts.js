
// JSON Storage process

/* Construct a storage mechanism to store all todo app relevant data to the local storage
- Set a default "template" for minimal data needed for the app to load and function.
- Check a unique field to see if it contains a value (user / id), if not have an prompt asking for a user's name.
- Once the app is initialized for a user, it will load the default app data (categories, priorities etc).
- Allow user to create categories and task etc. as well as removing the default example content.
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
            tags : "general"
        },
        task2 : {
            title : "Example 2",
            description : "Description for task 2",
            date_due : "",
            time_due : "",
            category : "work",
            priority : "high",
            tags : "work"
        },
        task3 : {
            title : "Example 3",
            description : "Description for task 3",
            date_due : "",
            time_due : "",
            category : "home",
            priority : "low",
            tags : "home"
        }
    },
    last_update : ""
};

// Random string generator.
function randomID() {
    const result = Math.random().toString(36).substring(2,8);
    return result;
 }

// Locally stored parsed data
function getLocalData() {
    const userData = localStorage.getItem('userData');
    const parseData = JSON.parse(userData);
    return parseData;
}

// Parse data and set local data.
function parseData(data) {
    const userData = JSON.stringify(data);
    localStorage.setItem('userData', userData);
}

// Set unique app id.
function appId() {
    const localData = getLocalData();
    if(localData['id'] == "") {
        const appId = randomID();
        localData['id'] = appId;
        parseData(localData);
        lastUpdate();
    }
}

// Prompt for user's name
function userName() {
    let user = prompt("Please enter your name");
    if (user != null) {
        const localData = getLocalData();
        localData['user'] = user;
        parseData(localData);
        lastUpdate();
    }
}

// App setup for local storage.
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
            document.getElementById("greeting").innerHTML = "Hello " + user + "! <br><br> Welcome to the best ToDo app!<br><br>";
        }
    }
    appId();
}

// Last app update
function lastUpdate() {
    const currentDate = Date.now();
    const localData = getLocalData();
    localData['last_update'] = currentDate;
    parseData(localData);
}