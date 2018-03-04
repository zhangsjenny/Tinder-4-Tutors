//Initialize TinderTutor function on startup
window.onload = function() {
  window.TinderTutor = new TinderTutor();
};

function continuelogin() {
  var redirectlink = "home.html";
  window.location.replace(redirectlink);
}

//Firebase Initialization
function TinderTutor() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.continueButton = document.getElementById('continue-button');

  // Saves message on form submit.
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

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
};

TinderTutor.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var userName = user.displayName;

    // Set the user's profile pic and name.
    this.userName.textContent = "Hi, " + userName + "!";

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.continueButton.removeAttribute('hidden');

    this.continueButton.textContent = "Continue as " + userName;
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.continueButton.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
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