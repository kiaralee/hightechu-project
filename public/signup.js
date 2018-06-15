/* Your JS codes here */
var ref = firebase.database().ref();
console.log(ref);
var currentUser = new Object();

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        //Go to profile page 
		logout();  
    } else {
        //No user signed in
    }
});


function signup() {
    txtEmail = document.getElementById('signemail').value;
    txtPass = document.getElementById('signpass').value;
    firebase.auth().createUserWithEmailAndPassword(txtEmail, txtPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error: " + errorMessage);
    });
}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
		alert("User creation successful! You will now be redirected to login");
		window.location = "Login.html";
      }).catch(function(error) {
        // An error happened.
      });
} 

function resetPass() {
    var auth = firebase.auth();
    var emailAddress = document.getElementById('loginEmail').value;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    alert("Email sent")
    }).catch(function(error) {
    // An error happened.
    });
}

for(var cell of document.querySelectorAll(".login")) {
    cell.addEventListener("keyup", function(event) {
        if(event.key !== "Enter") return; // Use `.key` instead.
        document.querySelector("#btnLogin").click(); // Things you want to do.
        event.preventDefault(); // No need to `return false;`.
    })
};

for(var cell of document.querySelectorAll(".signup")) {
    cell.addEventListener("keyup", function(event) {
        if(event.key !== "Enter") return; // Use `.key` instead.
        document.querySelector("#btnSignup").click(); // Things you want to do.
        event.preventDefault(); // No need to `return false;`.
    })
};
