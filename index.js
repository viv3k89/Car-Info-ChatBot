const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mysql = require("mysql2");

// Connect to MySQL database
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Replace with your MySQL username
    password: "suraj_pandey879122", // Replace with your MySQL password
    database: "carinfo", // Database name
});

// Handle database connection
const connectDB = () => {
    db.connect((err) => {
        if (err) {
            console.error("Error connecting to the database:", err);
        } else {
            console.log("Connected to the database.");
        }
    });
};

// Initialize DB connection
connectDB();

// Set up view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON data

// Array to store car results
let cars = [];

// Helper function to handle repeated views rendering
const renderView = (res, view) => {
    res.render(view);
};

// Define routes for rendering views
app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/dash",(req,res)=>{
    res.render("dashboard.ejs");
});
app.get("/2nd",(req,res)=>{
    res.render("2nd.ejs");
});
app.get("/2ndhandcar",(req,res)=>{
    res.render("2ndhandcar.ejs");
});
app.get("/accessories",(req,res)=>{
    res.render("accessories.ejs");
});
app.get("/chatbot",(req,res)=>{
    res.render("chatbot.ejs");
});
const imageSources = [
    "https://stimg.cardekho.com/images/carexteriorimages/630x420/Lamborghini/Urus/10635/1724844423793/front-left-side-47.jpg?impolicy=resize&imwidth=480",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoD8oS-x5Fc3htlEyFFHAub7riEnAYFThdQA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCDf26g0JxF8YtRUu92oGaQm2Hc8dxmNyy6A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRceRIqMUOp9gIdHIJQ8q86ItupyWj3_MaFrA&s"
];
// Route to handle the summary data
app.post("/summary", (req, res) => {
    const { Brand, Year, Price, EngineType, FuelEconomy, SafetyRatings } = req.body;
    const minPrice = Price - 1000000;
    const maxPrice = Price + 1000000;

    // SQL query to get cars based on preferences
    const query = `
        SELECT * 
        FROM cars 
        WHERE Make = ? AND Year = ? AND Price BETWEEN ? AND ? AND SafetyRatings = ?;
    `;
    const values = [Brand, Year, minPrice, maxPrice, SafetyRatings];
    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Error fetching cars:", err);
            res.status(500).json({ error: "Error fetching data from the database" });
        } else {
            // Store the results in the cars array and send a response
            cars = results;
            console.log("Matching cars:", results);
            res.redirect("/carshow");
        }
    });
});

// Route to show car details on a separate page
app.get("/carshow", (req, res) => {
    res.render("carshow", { cars });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
