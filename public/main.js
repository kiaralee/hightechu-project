//Make sure the database connection works

// console.log(ref);
var currentUser = new Object();
var code = localStorage.getItem("code").substring(1);
let user = localStorage.getItem("user");
var ref = firebase.database().ref('codes/' + code + '/posts/');

// uses firebase to log out
function logout() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		window.location = "Login.html";
		console.log("Successfully signed out.");
	}).catch(function(error) {
		// An error happened.
		alert(error);
	});
}

// displays feed based on current code eg.#dogs
function displayFeed() {
	document.title = "#" + code;
	updatePosts();
}

// creates post & sends it to database
function post() {
	var txtCaption = document.getElementById('txtCaption');
	var txturl = document.getElementById('txturl');

	var postData = {
		author: user,
		title: txtCaption.value,
		image: txturl.value,
		likes: 0,
	};

	ref.push(postData);
	txtCaption.value = "";
	txturl.value = "";
	updatePosts();
}

// displays all posts for the given code
function updatePosts() {

	// must clear div before adding or it duplicates?
	let container = document.getElementById("contents");
	container.innerHTML = '';

	ref.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var childKey = childSnapshot.key;
			var childData = childSnapshot.val();
			if (childData == null) return;
			// display element
			var div = document.createElement('div');
			div.className = "basicbox";
			try {
				div.innerHTML = '<div class="container">' +
					'<img src="' + childData.image + '" alt="Group placeholder" class="image">' +
					'<div class="overlay">' +
					'<div class="text">' +
					'<br>' +
					'<span id="numLikes' + childData.image + '">' + childData.likes + ' likes<br></span>' +
					'<b>Author: ' + childData.author + '</b><br>' + childData.title + '</div>' +
					'<div class="comments">' +
					'<div class="space"></div>' +
					'<div class="scrolling" id="commentSection' + childData.image + '">' +
					 	// for comments
					'</div>' +
					'<div class="textComments">' +
					'<span id="border"><input type="text" class="commentText" id="commentText' + childData.image + '" placeholder="Post a comment" oninput="spanBorder()"></input>' +
					'<button class="post" onclick=\'postComment(this, \"' + childData.image + '\")\'>Post</button></span>' +
					'</div>' + '</div>' +
					'<div class="buttons">' +
					'<img src="icons/img-like.png" alt="Like" class="click" onclick=\'like(this, \"' + childData.image + '\")\'><br>' +
					'<img src="icons/img-comment.png" alt="Comment" class="click" onclick=\'showComments(this, \"' + childData.image + '\")\'>' +
					'</div>' + '</div>' + '</div>' + '</div>';
				container.prepend(div);
			} catch (err) {
				console.log(err);
			}
		});
	});

}

// LIKES

// toggles like image
function like(y, url) {
	let liked = !y.src.match("fill")
	y.src = liked ? "icons/img-like-fill.png" : "icons/img-like.png";
	getSnapshot('image', url).once('value', snap => {
		snap.forEach(function(childSnapshot) {
			let value = childSnapshot.val().likes;
			if (liked) value++
				else value--;
			childSnapshot.ref.update({
				likes: value
			});
			document.getElementById("numLikes" + url).innerHTML = value + ' likes<br>';
		});
	});

}
// COMMENTS (NO DATABASE):
// shows comments div per block by navigating the DOM
function showComments(x, url) {
	if (x.src.match("fill")) {
		x.src = "icons/img-comment.png";
		let p = x.parentElement.parentElement.children;
		p[1].style.display = "none";
		p[0].style.display = "block";
	} else {
		x.src = "icons/img-comment-fill.png";
		let p = x.parentElement.parentElement.children;
		p[1].style.display = "block";
		p[0].style.display = "none";
	}
	updateComments(url);
}
// changes border opacity on input click
function spanBorder() {
	if (document.getElementsByClassName("commentText")[0].value != "") {
		document.getElementById("border").style.borderBottom = "0.2vw solid rgba(75,75,75,0.6)";
	} else {
		document.getElementById("border").style.borderBottom = "0.2vw solid rgba(75,75,75,0.3)";
	}
}

// takes user input, creates new text node from it, prepends to top of section
// finds specific post
function postComment(x, url) {
	let commentText = document.getElementById('commentText' + url).value;
	uploadComment(user, commentText, url);
	//addComment(commentText, 'commentText' + url);
	//updateComments(url);
}

// uploads comment to database
function uploadComment(user, commentString, postID) {
	// 1. find element (childSnapshot)
	// 2. add to 'comment child'
	getSnapshot('image', postID).once('value', snap => {
		snap.forEach(function(childSnapshot) {
			let commentObject = { user: user,
							comment: commentString
						  };
			ref.child(childSnapshot.key).child('comments').push(commentObject);
  			});
	});;
	updateComments(postID);
}

// fetch comments from db
function updateComments(url) {
	let commentContainer = document.getElementById("commentSection" + url);
	commentContainer.innerHTML = "";
	getSnapshot('image', url).once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var comments = childSnapshot.val().comments;
			console.log(comments);
			for(key in comments) {
					addComment(comments[key], url);
				}
		}); // childSnapshot
	}); // getSnapshot
}

function addComment(commentObject, url) {
	let commentContainer = document.getElementById("commentSection" + url); // div to append to
	var div = document.createElement('div');
	div.className = "ltrcomments";
	try {
		div.innerHTML = '<b>' + commentObject.user + '</b>: ' + commentObject.comment;
		commentContainer.prepend(div);
	} catch (err) {console.log(err);}
}

function getSnapshot(key, equalTo) {
	return ref.orderByChild(key).equalTo(equalTo).limitToFirst(1);
}
