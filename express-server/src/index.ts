import express from "express"; 
import { createClient } from "redis";

const app = express(); 
app.use(express.json()); 

const client = createClient(); // Create Redis client instance
client.on('error', (err) => console.log('Redis Client Error', err)); // Set up Redis error handler

app.post("/submit", async (req, res) => { 
    const problemId = req.body.problemId; 
    const code = req.body.code; 
    const language = req.body.language; 

    try {
        await client.lPush("problems", JSON.stringify({ code, language, problemId })); // Push to Redis queue
        // Store in the database
        res.status(200).send("Submission received and stored."); 
    } catch (error) {
        console.error("Redis error:", error); 
        res.status(500).send("Failed to store submission."); 
    }
});

async function startServer() { // Function to start the server
    try {
        await client.connect(); // Connect to Redis
        console.log("Connected to Redis"); 

        app.listen(3000, () => { // Start Express server
            console.log("Server is running on port 3000"); 
        });
    } catch (error) {
        console.error("Failed to connect to Redis", error); 
    }
}

startServer(); 