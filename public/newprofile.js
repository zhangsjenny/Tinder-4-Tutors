//Initialize function on startup
window.onload = function() {
  window.TinderTutor = new TinderTutor();
};

//Get parameters from URL function
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Form Event Listeners
$(function() { //shorthand document.ready function
    $('#section1').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        submitSection1();
    });
});

$(function() { //shorthand document.ready function
    $('#section2').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        submitSection2();
    });
});

$(function() { //shorthand document.ready function
    $('#section3').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        submitSection3();
    });
});

$(function() { //shorthand document.ready function
    $('#section4').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        submitSection4();
    });
});

$(function() { //shorthand document.ready function
    $('#section5').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        submitSection5();
    });
});

$(function() { //shorthand document.ready function
    $('#section6').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        submitSection6();
    });
});

//Form Submit Functions
function submitSection1() {
	document.getElementById('section1').setAttribute('hidden','true');
	document.getElementById('section2').removeAttribute('hidden');
}

function submitSection2() {
	document.getElementById('section2').setAttribute('hidden','true');
	document.getElementById('section3').removeAttribute('hidden');
}

function submitSection3() {
	document.getElementById('section3').setAttribute('hidden','true');
	document.getElementById('section4').removeAttribute('hidden');
}

function submitSection4() {
	document.getElementById('section4').setAttribute('hidden','true');

	var choice = document.getElementById('inputTutor').value;

	if(choice == "Tutor" || choice == "Both") {
		document.getElementById('section5').removeAttribute('hidden');
	}
	else {
		document.getElementById('section6').removeAttribute('hidden');
	}
}

function submitSection5() {
	document.getElementById('section5').setAttribute('hidden','true');

	var choice = document.getElementById('inputTutor').value;

	if(choice == "Both") {
		document.getElementById('section6').removeAttribute('hidden');
	}
	else {
		document.getElementById('section7').removeAttribute('hidden');
	}
}

function submitSection6() {
	document.getElementById('section6').setAttribute('hidden','true');
	document.getElementById('section7').removeAttribute('hidden');
}

//Firebase Initialization
function TinderTutor() {
  this.checkSetup();

  // Authorization Elements
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');

  // //Form Elements
  this.formSection1 = document.getElementById('section1');

  this.nameInput = document.getElementById('inputName');
  this.emailInput = document.getElementById('inputEmail');
  this.genderInput = document.getElementById('inputGender');
  this.ageInput = document.getElementById('inputAge');
  this.pictureInput = document.getElementById('inputPicture');
  this.locationInput = document.getElementById('inputLocation');
  this.tutorInput = document.getElementById('inputTutor');
  this.educationInput = document.getElementById('inputEducation');
  this.majorInput = document.getElementById('inputMajor');
  this.subjectsTutoringInput = document.getElementById('inputSubjectsTutoring');
  this.gradeInput = document.getElementById('inputGrade');
  this.gpaInput = document.getElementById('inputGPA');
  this.subjectsLearningInput = document.getElementById('inputSubjectsLearning');

  this.submitButton7 = document.getElementById('submit7');

  // Button Binds
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.submitButton7.addEventListener('click', this.submitProfile.bind(this));

  this.initFirebase();
}

// Checks that the Firebase SDK has been correctly setup and configured.
TinderTutor.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

TinderTutor.prototype.initFirebase = function() {
  //Shortcuts to Firebase SDK features
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  //Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

TinderTutor.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

TinderTutor.prototype.signOut = function() {
  this.auth.signOut();
  var redirectlink = "index.html";
  window.location.redirect(redirectlink);
};

TinderTutor.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = "Hi, " + userName + "!  ";

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    //Set user email in text field
    this.nameInput.value = user.displayName;
    this.emailInput.value = user.email;
    this.pictureInput.value = user.photoURL;

    //Show Section 1 of form
    this.formSection1.removeAttribute('hidden');

  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');

    var redirectlink = "index.html";
  	window.location.replace(redirectlink);
  }
};

TinderTutor.prototype.checkSignedInWithMessage = function() {
  //Return true if the user is signed in Firebase
  if (this.auth.currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  
  console.log(data);
  return false;
};

TinderTutor.prototype.submitProfile = function() {
	//Load database
	var email = this.emailInput.value;
	var newstring = email.replace(/\./g,' ');
	console.log(newstring);
  this.userDatabase = this.database.ref('users/' + newstring);
  
	//Push your client information to database
  this.userDatabase.set({
  	email: this.emailInput.value,
  	name: this.nameInput.value,
  	gender: this.genderInput.value,
    age: this.ageInput.value,
    picture: this.pictureInput.value,
    location: this.locationInput.value,
    tutorstatus: this.tutorInput.value,
    education: this.educationInput.value,
    major: this.majorInput.value,
    subjectsTutoring: this.subjectsTutoringInput.value,
    grade: this.gradeInput.value,
    gpa: this.gpaInput.value,
    subjectsLearning: this.subjectsLearningInput.value
  }).then(function() {
    // var client = snapshot.numChildren();
    // console.log(client);
  }.bind(this)).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
};