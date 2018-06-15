var ref = firebase.database().ref(); 

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        //Go to profile page 
		window.location = "main.html"; 
    } else {
        //No user signed in
    }
}); 

function go() {
	let code = document.getElementById('code').value; 
	let user = document.getElementById("user").value;
	if (user == "") {
		alert("Error: Please enter a session screen name");
	} 

	if (code.startsWith("#")) {
		if (checkWhitespace(code) == false) {
			if (checkSpecial(code.substring(1)) == false) {
				localStorage.setItem("code", code);
				if (checkWhitespace(user) == false) {
					if (checkSpecial(user) == false) {	
						localStorage.setItem("user", user); 
						login();
					} else {
						alert("Error: Names can only contain letters and numbers");
					} 
				} else {
					alert("Error: Names cannot contain spaces");
				} 
			} else {
				alert("Error: Codes can only contain letters and numbers");
			}
		} else {
			alert("Error: Codes cannot contain spaces"); 
		}
	} else {
		alert("Error: All codes must begin with #"); 
	} 	
}

function login() {
	email = document.getElementById("email").value;
	pass = document.getElementById("pass").value;
	firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert("Error: " + errorMessage);
	});
} 

// checks if any fields contain whitespace
function checkWhitespace(str) {
    chars = str.split(' '); // splits string, looks for blank spaces
    if (chars.length > 1) {
        return true;
    } else {
         return false;
    }
}
// checks for illegal characters
function checkSpecial(str) {
	let sc = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "|", "<", ",", ":", ";", ">", ".", "?", "/", "~", "`"];
	for (i = 0; i <= sc.length - 1; i++) {
		if (str.includes(sc[i])) {
			return true;
		}
	}
	return false;
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