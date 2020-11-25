// Add required packages
const express = require("express");
const app = express();

// Set up EJS
app.set("view engine", "ejs");


// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    //res.send ("Hello world...");
    res.render("index");
});

// Add database package and connection string (can remove ssl)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get("/", (req, res) => {
    //res.send ("Hello world...");
    const sql = "SELECT * FROM PRODUCT ORDER BY PROD_ID";
    pool.query(sql, [], (err, result) => {
        var message = "";
        var model = {};
        if(err) {
            message = `Error - ${err.message}`;
        } else {
            message = "success";
            model = result.rows;
        };
        res.render("index", {
            message: message,
            model : model
        });
    });
});

const fileUpload = require("express-fileupload");
app.use(fileUpload());
const multer = require("multer");
const upload = multer();

app.get("/output", (req, res) => {
    var message = "";
    res.render("output",{ message: message });
   });
   
   
   app.post("/output", (req, res) => {
       const sql = "SELECT * FROM PRODUCT ORDER BY PROD_ID";
       pool.query(sql, [], (err, result) => {
           var message = "";
           if(err) {
               message = `Error - ${err.message}`;
               res.render("output", { message: message })
           } else {
               var output = "";
               result.rows.forEach(product => {
                   output += `${product.prod_id},${product.prod_name},${product.prod_desc},${product.prod_price}\r\n`;
               });
               res.header("Content-Type", "text/csv");
               res.attachment("export.csv");
               return res.send(output);
           };
       });
   });