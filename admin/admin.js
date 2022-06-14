import { auth, db, set, get, child, ref, dbRef } from "../firebaseConfig.js"
import Task from "../modal/task.js";

//console.log(Date.now());
//Variables to access the html doc
var displayAdminUserName = document.getElementById("displayAdminUserName");

//variable to store tasks
var tasksData = [];
var firebaseDataObj = [];
//checking if user is signed in or not.
const userId = window.localStorage.getItem('uid');
if(userId){
    //console.log(userId);
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
//            console.log(snapshot.val());
            if(snapshot.val().role === "admin"){
                //TO DO
                displayAdminUserName.innerHTML = `Hello, ${snapshot.val().username}`;
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

//LogOut button
signOutAdmin.addEventListener('click', e => {
    redirectToSignIn();
})

//Create Task Login
createTask.addEventListener('click', e => {
    var createTaskAssigneeEmail = document.getElementById("createTaskAssigneeEmail").value;
    var createTaskName = document.getElementById("createTaskName").value;
    var createTaskHourlyRate = document.getElementById("createTaskHourlyRate").value;
    var createTaskDescription = document.getElementById("createTaskDescription").value;
    var taskId = Date.now();
    var task = new Task();
    //var assignedBy = window.localStorage.getItem('uemailId');
    
    //Task object that will be stored in db
    task.taskId = taskId;
    task.taskName = createTaskName;
    task.assignedTo = createTaskAssigneeEmail;
    //task.assignedBy = assignedBy;
    task.taskHourlyRate = createTaskHourlyRate;
    task.taskStartDateTime = 0;
    task.taksEndDateTime = 0;
    task.taskDescription = createTaskDescription;
    task.taskStatus = "Submitted";

    console.log(task);

    set(ref(db,'tasks/'+taskId),task).then(() => {
        Email.send({
            Host : "smtp.elasticemail.com",
            Username : "manisingh893@gmail.com",
            Password : "B75BE9FCDE041C22B9B7B88113E43791045B",
            To : task.assignedTo,
            From : "manisingh893@gmail.com",
            Subject : "Task Assignment - "+taskId,
            Body : "New Task has been assigned to you. Please continue to SignIn/SignUp to start working on the task."
        }).then(
          console.log("sent")
        );
    }).catch((error) => {
        console.error(error);
    });
})

//function to SignOut and redirect to SignIn page
function redirectToSignIn(){
    window.localStorage.setItem('uid','');
    window.localStorage.setItem('uemailId','');
    window.location.replace("../index.html");
}

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

//let dataFlow = document.getElementById("testingDataFLow");
//Once we have the data, display it on the screen.
function displayTasks(tasks){
    let tableDisplaySubmittedTasks = document.getElementById("tableDisplaySubmittedTasks");
    let tableDisplayInProgressTasks = document.getElementById("tableDisplayInProgressTasks");
    let tableDisplayCompletedTasks = document.getElementById("tableDisplayCompletedTasks");
    let tableDisplayCancelledTasks = document.getElementById("tableDisplayCancelledTasks");
    for(let elem of tasks){
        if(elem.taskStatus == "Submitted"){
            // tableDisplaySubmittedTasks.innerHTML += `
            //     <tr>
            //         <td>${elem.taskName}</td>
            //         <td>${elem.assignedTo}</td>
            //         <td>${elem.taskStartDateTime}</td>
            //         <td>${elem.taksEndDateTime}</td>
            //         <td>${elem.taskHourlyRate}</td>
            //         <td><button class="btn btn-outline-warning" onClick="updateEditModalDetails()" data-bs-toggle="modal" data-bs-target="#editModel">Edit</button> </td>
            //     </tr>
            // `;
            let row = tableDisplaySubmittedTasks.insertRow();
            let taskName = row.insertCell(0);
            let assignedTo = row.insertCell(1);
            let startDate = row.insertCell(2);
            let endDate = row.insertCell(3);
            let hourlyRate = row.insertCell(4);
            let edtButton = row.insertCell(5);
            taskName.innerHTML = elem.taskName;
            startDate.innerHTML = elem.taskStartDateTime;
            endDate.innerHTML = elem.taksEndDateTime;
            assignedTo.innerHTML = elem.assignedTo;
            hourlyRate.innerHTML = elem.taskHourlyRate; 
            let btn = document.createElement('input');
            btn.type = "button";
            btn.className = "btn btn-outline-warning";
            btn.value = "Edit";
            //btn.data-bs-toggle = "modal";

            btn.onclick = (function() {return function() {updateEditModalDetails(elem.taskId);}})("entry");
            edtButton.appendChild(btn);
            //console.log(elem.taskId);
            //dataFlow.innerHTML += "\n"+ elem.assignedTo; 
        }else if(elem.taskStatus == "InProgress"){
            console.log("inProgrss");
            let row = tableDisplayInProgressTasks.insertRow();
            let taskName = row.insertCell(0);
            let assignedTo = row.insertCell(1);
            let startDate = row.insertCell(2);
            let endDate = row.insertCell(3);
            let hourlyRate = row.insertCell(4);
            let edtButton = row.insertCell(5);
            taskName.innerHTML = elem.taskName;
            startDate.innerHTML = elem.taskStartDateTime;
            endDate.innerHTML = elem.taksEndDateTime;
            assignedTo.innerHTML = elem.assignedTo;
            hourlyRate.innerHTML = elem.taskHourlyRate; 
        }else if(elem.taskStatus == "Completed"){
            let row = tableDisplayCompletedTasks.insertRow();
            let taskName = row.insertCell(0);
            let assignedTo = row.insertCell(1);
            let startDate = row.insertCell(2);
            let endDate = row.insertCell(3);
            let hourlyRate = row.insertCell(4);
            let edtButton = row.insertCell(5);
            taskName.innerHTML = elem.taskName;
            startDate.innerHTML = elem.taskStartDateTime;
            endDate.innerHTML = elem.taksEndDateTime;
            assignedTo.innerHTML = elem.assignedTo;
            hourlyRate.innerHTML = elem.taskHourlyRate; 
            console.log("Completed");
        }else if(elem.taskStatus == "Cancelled"){
            let row = tableDisplayCancelledTasks.insertRow();
            let taskName = row.insertCell(0);
            let assignedTo = row.insertCell(1);
            let startDate = row.insertCell(2);
            let endDate = row.insertCell(3);
            let hourlyRate = row.insertCell(4);
            let edtButton = row.insertCell(5);
            taskName.innerHTML = elem.taskName;
            startDate.innerHTML = elem.taskStartDateTime;
            endDate.innerHTML = elem.taksEndDateTime;
            assignedTo.innerHTML = elem.assignedTo;
            hourlyRate.innerHTML = elem.taskHourlyRate; 
            console.log("Cancelled");
        }
    }
}

//function to update modal details
function updateEditModalDetails(taskId){
    //let modal = document.getElementById("");
    let myModal = new bootstrap.Modal(document.getElementById('editModel'), {});
    myModal.show();
    console.log("clicked");
    console.log(firebaseDataObj[taskId]);
}

