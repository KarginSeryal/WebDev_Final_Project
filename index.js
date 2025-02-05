/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

console.log("successful connection to js")

/* === Firebase Setup === */
const firebaseConfig = {

    apiKey: "AIzaSyA7TFkTgCI1bMWWEg-MPDBNbNJxXJGMyfU",

    authDomain: "techticketingapp.firebaseapp.com",

    projectId: "techticketingapp",

    storageBucket: "techticketingapp.firebasestorage.app",

    messagingSenderId: "733618698014",

    appId: "1:733618698014:web:e91ec3a5e39b1759d5fb0f"

  };

const app= initializeApp(firebaseConfig)
const auth = getAuth(app)
console.log(auth)

const db = getFirestore(app);
console.log(db)

console.log(app.options.projectId)


/* === UI === */

/* == UI - Elements == */


const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")
const userProfilePictureEl = document.getElementById("user-profile-picture")
const userGreetingEl = document.getElementById("user-greeting")

const submitButtonEl = document.getElementById("submit-btn")


// INPUT FIELDS

const mainCategory = document.getElementById("main-category") // DROPDOWN
const peopleAffected = document.getElementById("affected")
const description = document.getElementById("description")
const attemptedSolution = document.getElementById("attemptedSolution")
const needAdmin = document.getElementsByName("needAdmin")
const roomFloor = document.getElementById("roomFloor")
const roomWing = document.getElementById("roomWing")
const roomNum = document.getElementById("roomNum")
const affectedTerminals = document.getElementById("affectedTerminals")
const teacher = document.getElementById("teacherName")
const date = document.getElementById("dateInp")




/* == UI - Event Listeners == */


signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)
submitButtonEl.addEventListener("click", submitButtonPressed)

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for
    showLoggedInView()
    showProfilePicture(userProfilePictureEl, user)
    showUserGreeting(userGreetingEl, user)
    console.log("User is signed in")


    const uid = user.uid;
    // ...
  } else {
    showLoggedOutView()
    console.log("User is signed out")
    // ...
  }
});


/* === Functions === */

function getRadioValue() {
  for (const radio of needAdmin) {
    if (radio.checked) {
      let selectedValue = radio.value;
      return selectedValue; // Move return statement inside if block
    }
  }
  console.log('No option selected');
  return "unsure";
}

  

/* = Functions - Firebase - Authentication = */

function authCreateAccountWithEmail() {
    console.log("Sign up with email and password")
    const email = emailInputEl.value
    const password = passwordInputEl.value

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showLoggedInView()
        console.log("Account create: success")
    })
    .catch((error) => {
        console.error(error.message)
    })

} 

function authSignInWithEmail() {
    console.log("Sign in with email and password")
    const email = emailInputEl.value
    const password = passwordInputEl.value

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showLoggedInView()
    })
    .catch((error) => {
        console.error(error.message)
    })
}

function authSignOut() {
    signOut(auth).then(() => {
        showLoggedOutView()
        // Sign-out successful.
    }).catch((error) => {
        console.log(error.message)
        // An error happened.
    })
}


/* == Functions - UI Functions == */


function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
}


function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
}


function showView(view) {
    view.style.display = "flex"
}


function hideView(view) {
    view.style.display = "none"
}

function clearInputField() {
    date.value=""
    mainCategory.value=""
    peopleAffected.value=""
    description.value=""
    attemptedSolution.value=""
    needAdmin.value=""
    roomFloor.value=""
    roomWing.value=""
    roomNum.value=""
    affectedTerminals.value=""
    teacher.value=""
    date.value=""
}

function submitButtonPressed() {
    const user = auth.currentUser.uid
    const cat = mainCategory.value
    const time = serverTimestamp()
    const pA = peopleAffected.value
    const desc = description.value
    const aS = attemptedSolution.value
    const nA = getRadioValue()
    const rF = roomFloor.value
    const rW = roomWing.value
    const rN = roomNum.value
    const aT = affectedTerminals.value
    const t = teacher.value
    const d = date.value

    if (user) {
        addTicketToDB(user, cat, time, pA, desc, aS, nA, rF, rW, rN, aT, t, d)
        clearInputField()
    }
 }

 

 /* = Functions - Firebase - Cloud Firestore = */


async function addTicketToDB(user, category, time, peopleAffected, description, attemptedSolution, needAdmin, roomFloor, roomWing, roomNum, affectedTerminals, teacher, date) {

try {
    const docRef = await addDoc(collection(db, category), {
        uid: user,
        mainCategory: category,
        ticketDate: time,
        peopleAffected: peopleAffected,
        description: description,
        attemptedSolution: attemptedSolution,
        needAdmin: needAdmin, 
        roomFloor: roomFloor,
        roomWing: roomWing,
        roomNum: roomNum,
        affectedTerminals: affectedTerminals,
        teacher: teacher,
        date: date

    });    
    console.log("Document written with ID: ", docRef.id);
    console.log("Post User UID: " + user.uid)
    console.log("Timestamp: " + serverTimestamp())
} catch (e) {
    console.error("Error adding document: ", e);
}    
}
 
//credit: coursera

