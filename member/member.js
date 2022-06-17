import { auth, db, set, get, child, ref, dbRef, update } from "../firebaseConfig.js"
import Task from "../modal/task.js";


//Variables to access the html doc
var displayMemberUserName = document.getElementById("displayMemberUserName");
//variable to store tasks
var tasksData = [];
var firebaseDataObj = [];
var selectedTaskId;

//checking if user is signed in or not.
const userId = window.localStorage.getItem('uid');
const userEmailId = window.localStorage.getItem('uemailId');
if(userId){
    //console.log(userId);
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
//            console.log(snapshot.val());
            if(snapshot.val().role === "member"){
                //TO DO
                displayMemberUserName.innerHTML = `Hello, ${snapshot.val().username}`;
            }else{
                redirectToSignIn();
            }
        } else {
            redirectToSignIn();
        }
    }).catch((error) => {
        redirectToSignIn();
    });
}else{
    redirectToSignIn();
}

//function to SignOut and redirect to SignIn page
function redirectToSignIn(){
    window.localStorage.setItem('uid','');
    window.localStorage.setItem('uemailId','');
    window.location.replace("../index.html");
}

//LogOut button
signOutMember.addEventListener('click', () => {
    redirectToSignIn();
})

getAllTasks();
//getting all the tasks
function getAllTasks(){  
    get(child(dbRef, `tasks`)).then((snapshot) => {
        if (snapshot.exists()) {
            let task = new Task();
            tasksData = [];
            firebaseDataObj = [];
            firebaseDataObj = snapshot.val();
            //console.log(snapshot.val());
            for(let id in snapshot.val()){
                //console.log(snapshot.val()[id]);
                task = snapshot.val()[id];
                tasksData.push(task);
            }
            displayTasks(tasksData);
            //console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
}

//fucntion to display tasks available
function displayTasks(tasks){
    //console.log(tasks);
    //Accessing tables
    let tableDisplayMemberAvailableTasks = document.getElementById("tableDisplayMemberAvailableTasks");
    let tableDisplayMemberCompletedTasks = document.getElementById("tableDisplayMemberCompletedTasks");
    //Clearing the table if they have any content
    clearTable("tableDisplayMemberAvailableTasks");
    clearTable("tableDisplayMemberCompletedTasks");

    //console.log(userEmailId);
    for(let elem of tasks){
        if(elem.assignedTo == userEmailId){
            if(elem.taskStatus == "Submitted" || elem.taskStatus == "InProgress"){
                //displaying availabale tasks for the user.
                let row = tableDisplayMemberAvailableTasks.insertRow();
                let taskName = row.insertCell(0);
                let taskDescription = row.insertCell(1);
                let startDate = row.insertCell(2);
                let endDate = row.insertCell(3);
                let hourlyRate = row.insertCell(4);
                let startEndButton = row.insertCell(5);
                taskName.innerHTML = elem.taskName;
                taskDescription.innerHTML = elem.taskDescription;
                if(elem.taskStatus == "Submitted"){
                    startDate.innerHTML = "Not Started";
                    endDate.innerHTML = "Not Started";
                }else{
                    let date = new Date(elem.taskStartDateTime);
                    let startDateTimeString = date.toLocaleString();
                    startDate.innerHTML = startDateTimeString;
                    endDate.innerHTML = "In Progress";
                }
                hourlyRate.innerHTML = elem.taskHourlyRate; 

                //Button to start or end the task.
                let btn = document.createElement('input');
                btn.type = "button";
                if(elem.taskStartDateTime == 0){
                    btn.className = "btn btn-outline-info";
                    btn.value = "Start";
                }else{
                    btn.className = "btn btn-outline-warning";
                    btn.value = "End";
                }
                btn.onclick = (function() {return function() {updateTaskStatus(elem.taskId);}})("");
                startEndButton.appendChild(btn);
                //console.log(elem);
            }else if(elem.taskStatus == "Completed"){
                console.log(elem);
                let row = tableDisplayMemberCompletedTasks.insertRow();
                let taskName = row.insertCell(0);
                let startDate = row.insertCell(1);
                let endDate = row.insertCell(2);
                let hourlyRate = row.insertCell(3);
                let hoursWorked = row.insertCell(4);
                let paymentExpected = row.insertCell(5);

                taskName.innerHTML  = elem.taskName;
                // User Start Task Date Time
                let startDateObject = new Date(elem.taskStartDateTime);
                let startDateTimeString = startDateObject.toLocaleString();
                startDate.innerHTML = startDateTimeString;
                //User End Task Date Time
                let endDateObject = new Date(elem.taksEndDateTime);
                let endDateTimeString = endDateObject.toLocaleString();
                endDate.innerHTML = endDateTimeString;
                hourlyRate.innerHTML = elem.taskHourlyRate;

                //Calculations number of hours worked with moment js
                let x = (endDateObject - startDateObject);
                //console.log(x);
                let d = moment.duration(x, 'milliseconds');
                let hours = Math.floor(d.asHours());
                let mins = (Math.floor(d.asMinutes()) - hours * 60)/60;
                //console.log("Hours:" + hours + " Mins:" + mins);
                hoursWorked.innerHTML = hours + mins + " Hours";
                //console.log(msToTime(endDateObject - startDateObject));
                 
                //Expected Payemnt
                let payment = (hours+mins) * elem.taskHourlyRate;
                paymentExpected.innerHTML = payment + " $";

            }
        }
    }
}

//function to clear table
function clearTable(tableName){
    let table = document.getElementById(tableName);
    let rowCount = table.rows.length;
    //console.log("rowCount",rowCount);
    for (let i = 1; i < rowCount; i++) {
        //console.log(index)
        table.deleteRow(1);
    }
}


//Function to udpate Task status
function updateTaskStatus(taskId){

    const updates = {};
    let taskTime = Date.now();
    if(firebaseDataObj[taskId].taskStatus == "Submitted"){
        updates['/tasks/' + taskId + '/taskStartDateTime'] = taskTime;
        updates['/tasks/' + taskId + '/taskStatus'] = "InProgress";
        update(ref(db), updates).then(() => {
            getAllTasks();
        });
    }else if(firebaseDataObj[taskId].taskStatus == "InProgress"){
        updates['/tasks/' + taskId + '/taksEndDateTime'] = taskTime;
        updates['/tasks/' + taskId + '/taskStatus'] = "Completed";
        update(ref(db), updates).then(() => {
            getAllTasks();
        });
    }else{
        console.log("Invalid Input");
    }

    // let date = new Date(taskId);
    // let text = date.toLocaleString();
    // console.log(text);
    // console.log("update"+taskId);
}

// function msToTime(duration) {
//     var milliseconds = parseInt((duration % 1000) / 100),
//       seconds = Math.floor((duration / 1000) % 60),
//       minutes = Math.floor((duration / (1000 * 60)) % 60),
//       hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
//     hours = (hours < 10) ? "0" + hours : hours;
//     minutes = (minutes < 10) ? "0" + minutes : minutes;
//     seconds = (seconds < 10) ? "0" + seconds : seconds;
  
//     return hours + "." + minutes;
// }