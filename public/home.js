//Initialize TinderTutor function on startup
window.onload = function() {
  window.TinderTutor = new TinderTutor();
};

//Firebase Initialization
function TinderTutor() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.profileCount = document.getElementById('profileCounter');
  this.profEmail = document.getElementById('profileEmail');
  this.currEmail = document.getElementById('currentEmail');
  this.sampleCard = document.getElementById('sampleprofile');
  this.pass = document.getElementById('passButton');
  this.like = document.getElementById('likeButton');

  // Saves message on form submit.
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.pass.addEventListener('click', this.passFunction.bind(this));
  this.like.addEventListener('click', this.likeFunction.bind(this));

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
    this.userName.innerHTML = "Hi, " + userName + "! Edit your profile";
    this.currEmail.value = user.email;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');

    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    this.profileCount.value = 1;

    //Load Profiles
    this.loadUserProfiles();
    this.sampleCard.setAttribute('hidden', 'true');    
  } 
  else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
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

TinderTutor.prototype.loadUserProfiles = function() {
  this.usersRef = this.database.ref('users');
  this.usersRef.off();

  console.log("test");
  var counter = 0;

  var addProfile = function(data) {
    counter = counter + 1;

    var val = data.val();

    this.displayUserProfile(val.name, val.email, val.age, val.location, val.picture, val.subjectsTutoring, val.subjectsLearning, counter);
  }.bind(this);
  this.usersRef.limitToLast(20).on('child_added', addProfile);
  this.usersRef.limitToLast(20).on('child_changed', addProfile);
};

TinderTutor.prototype.displayUserProfile = function(name, email, age, location, image, subjectsTutoring, subjectsLearning, profnum) {
  console.log(profnum);
  var $node = null;
  $node = $('<div hidden class="profile-number" id="profile' + profnum + '"><div class="card-header"><h4 class="my-0 font-weight-normal profile-title"></h4></div><div class="card-body"><img class="mb-2 profile-image"><ul class="list-unstyled mt-3 mb-4"><li class="profile-tutorlist">Tutors:</li></ul></div><input hidden class="profile-email" type="email" placeholder="Email" value="' + email + '" aria-label="Email" id="profileEmail' + profnum + '"></div>');
  //$node.find(".profile-number").attr('id', "profile" + profnum);
  $node.find(".profile-title").html(name + " (" + age + ", " + location + ")");
  $node.find(".profile-image").attr('src', image);
  $node.find(".profile-tutorlist").html("Tutors: " + subjectsTutoring + "<br>Learning: " + subjectsLearning);

  $node.prependTo("#profileDisplay");
  document.getElementById('profile1').removeAttribute('hidden');
};

TinderTutor.prototype.passFunction = function() {
  var count = parseInt(this.profileCount.value);
  var current = this.currEmail.value;
  var currentemail = current.replace(/\./g,' ');
  var idString = "profile" + count;
  var emailString = "profileEmail" + count;
  var newEmail = document.getElementById(emailString).value;
  var newEmailString = newEmail.replace(/\./g,' ');
  console.log(count);

  this.userDatabase = this.database.ref('users/' + newEmailString + '/likes');
  this.userDatabase.set({
    [currentemail]: -1
  }).then(function() {
    // var client = snapshot.numChildren();
    // console.log(client);
  }.bind(this)).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });

  document.getElementById(idString).setAttribute('hidden', 'true');

  count = count + 1;
  this.profileCount.value = count;
  var idString = "profile" + count;
  document.getElementById(idString).removeAttribute('hidden');
};

TinderTutor.prototype.likeFunction = function() {
  var count = parseInt(this.profileCount.value);
  var current = this.currEmail.value;
  var currentemail = current.replace(/\./g,' ');
  var idString = "profile" + count;
  var emailString = "profileEmail" + count;
  var newEmail = document.getElementById(emailString).value;
  var newEmailString = newEmail.replace(/\./g,' ');
  console.log(count);

  this.userDatabase = this.database.ref('users/' + newEmailString + '/likes');
  this.userDatabase.set({
    [currentemail]: 1
  }).then(function() {
    // var client = snapshot.numChildren();
    // console.log(client);
  }.bind(this)).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });

  document.getElementById(idString).setAttribute('hidden', 'true');

  count = count + 1;
  this.profileCount.value = count;
  var idString = "profile" + count;
  document.getElementById(idString).removeAttribute('hidden');
};