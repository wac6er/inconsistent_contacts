

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnpegvv3g_YyjdWVsyBviFWYc0Yd5IW4Y",
    authDomain: "inconsistentcontacts.firebaseapp.com",
    projectId: "inconsistentcontacts",
    storageBucket: "inconsistentcontacts.appspot.com",
    messagingSenderId: "649011739657",
    appId: "1:649011739657:web:89485d0bb67fa1831e8cd8",
    measurementId: "G-CHG2ESSEY5"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the authentication service
const auth = getAuth(app);

// Initialize Firebase Analytics (optional)
const analytics = getAnalytics(app);

export { auth, analytics };