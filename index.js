const express=require("express");
const{MongoClient,ObjectId}=require('mongodb')
const cors=require("cors")

const app=express();

app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173","https://gilded-kitten-a2e735.netlify.app/"]
}))

const URL=process.env.URL;

let db;

async function connectToDatabase() {
    if(!db){ // This condition checks if db is undefined or null
        let client = await new MongoClient(URL).connect(); // Establishes the connection only if db is not initialized
        db=client.db("Project1") // Sets the db variable with the connected database
        console.log("Connected to MongoDB!!!")
    }
    return db; // Reuses the existing connection if it's already established
}

app.post("/books",async(req,res)=>{
    try {
        await connectToDatabase();
        const collection=db.collection("books");
        console.log("Inserting books");
        await collection.insertOne(req.body);
        console.log("Books Inserted");
        res.json({Message:"Books created"})
    } catch (error) {
        res.status(500).json({Message:"Something went wrong!",error:error.Message}) // Sends the specific error message
    }
})

app.get("/books",async(req,res)=>{
    try {
        await connectToDatabase();
        const collection=db.collection("books");
        console.log("Receiving books")
        const books=await collection.find({}).toArray();
        res.json(books)
    } catch (error) {
        res.status(500).json({Message:"Something went wrong",error:error.Message})
    }
})

app.get("/books/:bookId", async (req, res) => {
    try {
        await connectToDatabase();
        const collection = db.collection("books");
        console.log("Fetching book by ID");
        const book = await collection.findOne({ _id: new ObjectId(req.params.bookId) });
        res.json(book);
    } catch (error) {
        res.status(500).json({ Message: "Something went wrong", error: error.message });
    }
});

app.put("/books/:bookId",async(req,res)=>{
    try {
        await connectToDatabase();
        const collection=db.collection("books");
        console.log("Modifying books");
        const update=await collection.updateOne({_id:new ObjectId(req.params.bookId)},{$set:req.body})
        console.log("Books Updated")
        res.json({Message:"Books Updated"})
    } catch (error) {
        res.status(500).json({Message:"Something went wrong",error:error.Message})
    }
})

app.delete("/books/:bookId",async(req,res)=>{
    try {
        await connectToDatabase();
        const collection=db.collection("books");
        console.log("Deleting Books");
        await collection.deleteOne({_id:new ObjectId(req.params.bookId)});
        console.log("Books Deleted");
        res.json({Message:"Books Deleted!"});
    } catch (error) {
        res.status(500).json({Message:"Something went wrong",error:error.Message})
    }    
})

const port=3006;

app.listen(port,()=>{console.log(`Server is running in the port ${port}`)})