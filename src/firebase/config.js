import firebase from 'firebase/app'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: 'AIzaSyBxAABQ1NIyWgxHRyMOScWfKhAdHt84Xts',
  authDomain: 'vote-a790f.firebaseapp.com',
  projectId: 'vote-a790f',
  storageBucket: 'vote-a790f.appspot.com',
  messagingSenderId: '1167458848',
  appId: '1:1167458848:web:bba6d8b1ffa2e0dad87245',
  measurementId: '93C8QN0CJB',
};




// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

const auth = firebase.auth()
const db = firebase.firestore()

if (window.location.hostname === 'localhost') {
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', '8080');
}

export { db, auth }
export default firebase
