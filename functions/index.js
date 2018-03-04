//This file was copied over from an old project and is not being used. I need one in order for Firebase to work so this serves as a placeholder.

'use strict';

//npm stuff
//Import the Firebase SDK for Google Cloud Functions
const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision');
//const client = new vision();
//const client = new vision.ImageAnnotatorClient();
const client = new vision.v1.ImageAnnotatorClient({});
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
//Import and Initialize the Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.processOnChange = functions.storage.object().onChange(event => {
  console.log("onChange worked!");
  console.log(event);

  const object = event.data;
  // Exit if this is a deletion or a deploy event.
  if (object.resourceState === 'not_exists') {
    return console.log('This is a deletion event.');
  } else if (!object.name) {
    return console.log('This is a deploy event.');
  }

  console.log(`gs://${object.bucket}/${object.name}`);
  const image = {
    source: {imageUri: `gs://${object.bucket}/${object.name}`}
  };

  // Performs label detection on the gcs file
  client
    .labelDetection(`gs://${object.bucket}/${object.name}`)
    .then(results => {
      console.log(results);
      const labels = results[0].labelAnnotations;

      var keywords = [];
      for (var i = results[0].labelAnnotations.length - 1; i >= 0; i--) {
        if(results[0].labelAnnotations[i].score >= 0.5) {
          keywords.push(results[0].labelAnnotations[i].description);
        }
      }
      console.log(keywords);
      var client = object.name;
      client = client.slice(7,-4);
      console.log(client);

      return searchForWord(keywords, client);

    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});

function searchForWord(keywords, client) {
  //Get the current word
  //this.userDatabase = admin.database.ref(`/current`);
  var ref = admin.database().ref("current");
  ref.once("value").then(function(snapshot) {
    var key = snapshot.key;
    console.log(key);
    var childKey = snapshot.child("current").key;
    console.log(childKey);
  });

  // var setClient = function(data) {
  //   var val = data.val();
  //   var client = data.key;
  //   console.log(client);



  // }.bind(this);
  // this.userDatabase.limitToLast(1).on('child_added', setClient);
  // this.userDatabase.limitToLast(1).on('child_changed', setClient);



  return admin.database().ref(`/current`).update({word: "apple"});
}

// ScavengerHunt.prototype.joinGame = function() {
//   //Load database, /users/ database path
//   this.userDatabase = this.database.ref('users');

//   //Push your client information to database
//   this.userDatabase.push({
//     name: user.displayName,
//     points: 0
//   }).then(function(snapshot) {
//     var client = snapshot.numChildren();
//     console.log(client);
//   }.bind(this)).catch(function(error) {
//     console.error('Error writing new message to Firebase Database', error);
//   });
// };

// Moderates messages by lowering all uppercase messages and removing swearwords.



/*exports.moderator = functions.database
    .ref('/messages/{messageId}').onWrite(event => {
      const message = event.data.val();

      if (message && !message.sanitized) {
        // Retrieved the message values.
        console.log('Retrieved message content: ', message);

        // Run moderation checks on on the message and moderate if needed.
        const moderatedMessage = moderateMessage(message.text);

        // Update the Firebase DB with checked message.
        console.log('Message has been moderated. Saving to DB: ', moderatedMessage);
        return event.data.adminRef.update({
          text: moderatedMessage,
          sanitized: true,
          moderated: message.text !== moderatedMessage
        });
      }
    });*/