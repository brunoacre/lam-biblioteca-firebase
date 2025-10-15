import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-ze8S1FyrqulSIw9P-LClZpIiqCWszIY",
  authDomain: "app-react-native-2025.firebaseapp.com",
  projectId: "app-react-native-2025",
  storageBucket: "app-react-native-2025.appspot.com",
  messagingSenderId: "1086621941454",
  appId: "1:1086621941454:web:6a02516733806a2fb09a9f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);