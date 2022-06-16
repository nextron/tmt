import { createUserWithEmailAndPassword, signInWithEmailAndPassword, auth, db, set, get, child, ref, dbRef } from "./firebaseConfig.js"


//error message
var signInErrorMessage = document.getElementById("signInErrorMessage");
var signUpErrorMessage = document.getElementById("signUpErrorMessage");

//localStorage.clear();
//checking if user is logged in or not.
const userId = window.localStorage.getItem('uid');
if(userId){
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            signInErrorMessage.innerHTML = ""
            console.log(snapshot.val());
            if(snapshot.val().role === "admin"){
                window.location.replace("admin/admin.html");
            }else{
                window.location.replace("member/member.html");
            }
        }
        //  else {
        //     window.location.replace("index.html");
        // }
    }).catch((error) => {
        window.location.replace("index.html");
    });
}

//Create User
signUpButton.addEventListener('click', (e) => {
    //User registration
    //getting user details
    var signUpEmail = document.getElementById("signUpEmail").value;
    var signUpPassword = document.getElementById("signUpPassword").value;
    var signUpName = document.getElementById("signUpName").value;
    //var signUpRadioMember = document.getElementById("signUpRadioMember").checked;
    var signUpRole = "member";

    //Checking if the user is member or admin.
    // if(!signUpRadioMember){
    //     signUpRole = "admin";
    // }

    if(signUpEmail === "" || signUpPassword == "" || signUpName === ""){
        signUpErrorMessage.innerHTML = "Please provide Email ID, Password, and User Name."
    }else{
        //Firebase Registring user
        createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            //Storing userdetails
            set(ref(db, 'users/' + user.uid),{
                role: signUpRole,
                username: signUpName,
                emailId: signUpEmail
            }).catch((error) => {
                console.error(error);
            });
            //setting a global userId
            window.localStorage.setItem('uid',user.uid);
            window.localStorage.setItem('uemailId',signUpEmail);
            if(signUpRole === "admin"){
                window.location.replace("admin/admin.html");
            }else{
                window.location.replace("member/member.html");
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //console.log(error.code);
            if(errorCode == "auth/invalid-email"){
                signUpErrorMessage.innerHTML = "Please provide a valid EmailID"
            }else if(errorCode == "auth/weak-password"){
                signUpErrorMessage.innerHTML = "Password should be of aleast 6 characters."
            }else if(errorCode == "auth/email-already-in-use"){
                signUpErrorMessage.innerHTML = "EmailId is already in use."
            }else{
                console.log(errorMessage+ " Went wrong.");
            }
        });
    }
});

//Login User
signInButton.addEventListener('click', (e) => {
    var signInEmailId = document.getElementById("signInEmailId").value;
    var signinPassword = document.getElementById("signinPassword").value;
    //console.log(signInEmailId);
    if(signInEmailId === "" || signinPassword === "" ){
        signInErrorMessage.innerHTML = "Please provide EmailID and Password."
    }else{
        signInWithEmailAndPassword(auth, signInEmailId, signinPassword)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            //If the user exists fetching the details of the user.
            //console.log(user.uid);
            get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    signInErrorMessage.innerHTML = ""
                    console.log(snapshot.val());
                    //setting a global userId
                    window.localStorage.setItem('uid',user.uid);
                    window.localStorage.setItem('uemailId',signInEmailId);
                    if(snapshot.val().role === "admin"){
                        window.location.replace("admin/admin.html");
                    }else{
                        window.location.replace("member/member.html");
                    }
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode == "auth/user-not-found"){
                signInErrorMessage.innerHTML = "User Not found."
                console.log("user not found")
            }else if(errorCode == "auth/wrong-password"){
                signInErrorMessage.innerHTML = "Password is incorrect."
                console.log("wrong password")
            }else if(errorCode == "auth/invalid-email"){
                signInErrorMessage.innerHTML = "Please provide a valid EmailID"
                console.log("wrong password")
            }else{
                console.log(errorMessage + "Went wrong.");
            }
        });
    }
})