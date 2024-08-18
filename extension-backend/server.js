const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} = require("firebase/firestore");

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const expressApp = express();
const port = 8000;

expressApp.use(cors());
expressApp.use(express.json());

expressApp.get("/", (req, res) => {
  res.send("Hello from our API!! 🦕");
});

expressApp.post("/question", async (req, res) => {
  try {
    const { title, difficulty, link, email, uid, topics, time } = req.body;
    const QuestionDetails = {
      title,
      difficulty,
      link,
      email,
      uid,
      topics,
      time,
    };
    if (QuestionDetails) {
      await addDoc(collection(db, "questions"), QuestionDetails);
      res.send("Question added");
    } else {
      res.send("Question not added");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong :(");
  }
});

expressApp.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
