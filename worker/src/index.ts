import { createClient } from "redis"; 
const client = createClient(); // Create Redis client instance

async function processSubmission(submission: string) { // Function to process submissions from queue
    const { problemId, code, language } = JSON.parse(submission); 

    console.log(`Processing submission for problemId ${problemId}...`); 
    console.log(`Code: ${code}`); 
    console.log(`Language: ${language}`);
    // Here you would add your actual processing logic

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000)); // Artificial delay for processing
    console.log(`Finished processing submission for problemId ${problemId}.`); // Log processing completion
}

async function startWorker() { // Main worker function

    try {
        await client.connect(); // Connect to Redis server
        console.log("Worker connected to Redis."); 
        
        while (true) { // Infinite loop to continuously process submissions
            try {
                const submission = await client.brPop("problems", 0); // Blocking pop from 'problems' queue
                // @ts-ignore
                await processSubmission(submission.element); // Process the submission
            } catch (error) {
                console.error("Error processing submission:", error); // Log processing errors
                // Implement your error handling logic here. For example, you might want to push
                // the submission back onto the queue or log the error to a file.
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error); // Log connection errors
    }
}

startWorker(); 