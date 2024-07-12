import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

const env = await load();


const firebaseConfig = {
  apiKey: env["API_KEY"],
  authDomain: env["AUTH_DOMAIN"],
  databaseURL: env["DATABASE_URL"],
  projectId: env["PROJECT_ID"],
  storageBucket: env["STORAGE_BUCKET"],
  messagingSenderId: env["MESSAGING_SENDER_ID"],
  appId: env["APP_ID"],
  measurementId: env["MEASUREMENT_ID"],
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const router = new Router();
const DenoApp = new Application();

DenoApp.use(oakCors({ origin: "*" }));

router
  .get("/", (ctx) => {
    ctx.response.body = "Hello from our API!! 🦕";
  })
  .get("/question", async (ctx) => {
    try {
      const test = await getDocs(collection(db, "questions"));
      const data = test.docs.map((doc) => doc.data());
      ctx.response.body = data;
    } catch (e) {
      console.log(e);
      ctx.response.body = "Something went wrong :(";
    }
  })
  .post("/question", async (ctx) => {
    try {
      const { title, difficulty, link, email, uid, topics, time } = await ctx.request.body("json").value;
      const QuestionDetails = {
        title,
        difficulty,
        link,
        email,
        uid,
        topics,
        time
      };
      if (QuestionDetails) {
        await addDoc(collection(db, "questions"), QuestionDetails);
        ctx.response.body = "Question added";
      } else {
        ctx.response.body = "Question not added";
      }
    } catch (error) {
      console.log(error);
    }
  });
  

DenoApp.use(router.routes());
DenoApp.use(router.allowedMethods());

DenoApp.addEventListener("listen", () => {
  console.log("App is running on http://localhost:8000");
});

DenoApp.use();

DenoApp.listen({ port: 8000 });


