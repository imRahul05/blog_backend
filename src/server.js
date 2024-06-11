// import fs from 'fs';
// import path from 'path'
// import admin from 'firebase-admin'
// import express from "express";
// import 'dotenv/config';
// import { db, connectToDb } from "./db.js";
// import {fileURLToPath} from 'url';
// import dotenv from 'dotenv';





// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, './.env') });



// const credentials = JSON.parse(fs.readFileSync('./credentials.json')
// );
// admin.initializeApp({
//   credential: admin.credential.cert(credentials),
// })

// const app = express();

// app.use(express.json());

// app.use(express.static(path.join(__dirname,'../build')))

// // app.use(cors(
// //   {
// //     origin: 'https://blog-frontend-amwan1kwa-my-projects-react.vercel.app/',
// //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //     allowedHeaders: ['Content-Type', 'Authorization'],
// //     credentials: true,
// //   }
// // ))

// // Fallback to index.html for non-API routes

// app.get('/', (req, res)=>{
//   res.json("success");
// })
// app.get(/^(?!\/api).+/, (req, res) => {
//   res.sendFile(path.join(__dirname,'../build/index.html'))

//   // whenever a browser a send a request to our server is not api route then we are send the html file
// })

// app.use(async(req, res ,next) => {
//   const {authtoken} = req.headers;

// if(authtoken) {
//   try {
//     req.user = await admin.auth().verifyIdToken(authtoken);
//   } catch (e) {
//     return  res.sendStatus(400);
//   }
// }
// req.user = req.user || {};
// next();
// })
// app.get("/api/articles/:name", async (req, res) => {
//     const { name } = req.params;
//     const {uid} =req.user; 
  
//     try {
//       // Ensure that the db object is properly initialized
//       if (!db) {
//         throw new Error("Database connection is not initialized");
//       }
  
//       const article = await db.collection("articles").findOne({ name });
  
//       if (article) {
//         const upvoteIds =  article.upvoteIds || [];
//         article.canUpvote = uid && !upvoteIds.includes(uid);
//         res.json(article);
//       } else {
//         res.sendStatus(404);
//       }
//     } catch (error) {
//       console.error("Error fetching article:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }); 


//   app.use((req, res,next) => {
//     if(req.user){
//       next()
//     }else{
//       res.sendStatus(401);
//     }
//   })

// app.put("/api/articles/:name/upvote", async (req, res) => {
//   const { name } = req.params;
//   const {uid} =req.user; 
//   const article = await db.collection("articles").findOne({ name });
  
//   if (article) {
//     const upvoteIds =  article.upvoteIds || [];
//     const canUpvote = uid && !upvoteIds.includes(uid);

//    if(canUpvote){
//     await db.collection("articles").updateOne( { name },{
//       $inc: { upvotes: 1 },
//       $push : {upvoteIds: uid}   
//       // $push is used to push element in anarray in MONGODB
//      });

//    }


//   const updateArticle = await db.collection("articles").findOne({ name });

  
//     res.json(updateArticle); 
//   } else {
//     res.send("The article doesn't exist");
//   }
// });




// app.post("/api/articles/:name/comments", async (req, res) => {
//   const { name } = req.params;
//   const {  text } = req.body;
//   const {email } = req.user;

//   await db.collection("articles").updateOne(
//     { name },
//     {
//       $push: { comments: { postedby:email, text } },
//     }
//   );
//   const article = await db.collection("articles").findOne({ name });

//   if (article) {
//     res.json(article);
//   } else {
//     res.send("The article doesn't exist");
//   }
// });


// const PORT = process.env.PORT || 8000;

// connectToDb(() => {
//   console.log("Connecting to database ...");
//   app.listen(PORT, () => {
//     console.log("server is listening on port" + PORT);
//   });
// });
import fs from 'fs';
import path from 'path'
import admin from 'firebase-admin'
import express from "express";
import 'dotenv/config';
import { db, connectToDb } from "./db.js";
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

const credentials = JSON.parse(fs.readFileSync('./credentials.json'));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
})

const app = express();

app.use(express.json());

// Use the cors middleware
app.use(cors({
  origin: 'https://blog-frontend-amwan1kwa-my-projects-react.vercel.app', // replace with your client's domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // replace with the methods your client will use
  credentials: true,
}));

app.use(express.static(path.join(__dirname,'../build')))

app.get('/', (req, res)=>{
  res.json("success");
})
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname,'../build/index.html'))
})

app.use(async(req, res ,next) => {
  const {authtoken} = req.headers;

if(authtoken) {
  try {
    req.user = await admin.auth().verifyIdToken(authtoken);
  } catch (e) {
    return  res.sendStatus(400);
  }
}
req.user = req.user || {};
next();
})

app.get("/api/articles/:name", async (req, res) => {
    const { name } = req.params;
    const {uid} =req.user; 
  
    try {
      if (!db) {
        throw new Error("Database connection is not initialized");
      }
  
      const article = await db.collection("articles").findOne({ name });
  
      if (article) {
        const upvoteIds =  article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.includes(uid);
        res.json(article);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }); 

app.use((req, res,next) => {
  if(req.user){
    next()
  }else{
    res.sendStatus(401);
  }
})

app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const {uid} =req.user; 
  const article = await db.collection("articles").findOne({ name });
  
  if (article) {
    const upvoteIds =  article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

   if(canUpvote){
    await db.collection("articles").updateOne( { name },{
      $inc: { upvotes: 1 },
      $push : {upvoteIds: uid}   
     });
   }

  const updateArticle = await db.collection("articles").findOne({ name });
    res.json(updateArticle); 
  } else {
    res.send("The article doesn't exist");
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const {  text } = req.body;
  const {email } = req.user;

  await db.collection("articles").updateOne(
    { name },
    {
      $push: { comments: { postedby:email, text } },
    }
  );
  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send("The article doesn't exist");
  }
});

const PORT = process.env.PORT || 8000;

connectToDb(() => {
  console.log("Connecting to database ...");
  app.listen(PORT, () => {
    console.log("server is listening on port" + PORT);
  });
});