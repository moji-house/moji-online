import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArFwKZ1XzJ8Cv8QdL-sU9JkwLSbfyZ8BI",
  authDomain: "house-5e5f7.firebaseapp.com",
  projectId: "house-5e5f7",
  storageBucket: "house-5e5f7.appspot.com",
  messagingSenderId: "800572738073",
  appId: "1:800572738073:web:2d2fe820248bcd5a423888",
  measurementId: "G-3WTYBYDYPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage with specific bucket
const storage = getStorage(app);

export const uploadToFirebase = async (file: any) => {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    // Create a unique file name
    const fileName = `${Date.now()}-${file.name}`;

    // Create reference with specific bucket
    const storageRef = ref(storage, `properties/${fileName}`);
    
    // Convert file to Blob if it's not already
    const fileBlob = file instanceof Blob ? file : new Blob([file], { type: file.type });
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, fileBlob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading file to Firebase:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      serverResponse: error.serverResponse
    });
    
    // Check if it's a storage bucket issue
    if (error.code === 'storage/unknown' || error.code === 'storage/bucket-not-found') {
      console.error('Storage bucket issue detected. Please check your Firebase configuration and Storage setup.');
    }
    
    throw error;
  }
}; 