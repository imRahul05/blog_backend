import { MongoClient } from "mongodb";
import 'dotenv/config'; // This should be at the top of your file

let db;

async function connectToDb(cb){



    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@bloggy-cluster.nqahjfs.mongodb.net/?retryWrites=true&w=majority&appName=Bloggy-cluster`);
    await client.connect();
  
    db = client.db("react-blog-db");
    cb();


    
} 

export{
    db,
    connectToDb,
}