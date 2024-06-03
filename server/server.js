const express = require('express');
const connectDb = require('./Config/dbconfig');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Package = require('./models/packages')
const jwt = require('jsonwebtoken')

const app = express();

require('dotenv').config({ path: './config/.env' });
const cors = require('cors');
app.use(cors());

// Connection to database
connectDb();

const Reviews = require('./models/reviews')

app.get('/api/travel/getallReviews', async (req, res) => {
    try {
        console.log("Sending all reviews");

        // Fetch all reviews from the database
        const allReviews = await Reviews.find();
        console.log('allReviews:', allReviews)
        // Send the reviews back to the client
        res.status(200).json(allReviews);
    } catch (error) {
        // Handle any errors that occur during the retrieval process
        console.error("Error retrieving reviews:", error);
        res.status(500).send("Internal Server Error");
    }
})



// Middleware to parse JSON request bodies
app.use(express.json({ limit: '10mb' })); // Increase the limit for JSON requests


app.use("/api/travel", require('./Routers/Userroutes'))


// Apply the admin routes to the desired path
app.use("/api/admin", require('./Routers/adminroutes'))

app.use('/api/userbooking', require('./Routers/booking_routes'),)


//for token validation checking
app.get('/api/checkvalid', require('./middleware/validateToken'), (req, res) => {
    console.log("valid")
    res.status(200).end()
})



//for error handling
app.use(require('./middleware/errorHandler'))

app.listen(process.env.PORT, () => {
    console.log('Server is up and listening at port:', process.env.PORT);
});

