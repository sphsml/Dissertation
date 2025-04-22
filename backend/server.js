const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const db = mysql.createPool({
  connectionLimit: 30, // Adjust as needed
  host: "localhost",
  user: "root",
  password: "",
  database: "fyplogin",
  port: 3306,
});

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials:true}
));
app.use(cookieParser());

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM Users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const storedHashedPassword = result[0].password;
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (passwordMatch) {
      res.cookie("userEmail", email, {
        httpOnly:true,
        secure:false,
        maxAge:24*60*60*1000
      });
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid email or password." });
    }
  });
});


function hi_user(email, accessibility) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO hi_view (email, accessibility) VALUES (?, ?)";
    db.query(sql, [email, accessibility], (err) => {
      if (err) {
        reject(500);
      } else {
        resolve(200);
      }
  });
});
}

function nd_user(email, accessibility) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO nd_view (email, accessibility) VALUES (?, ?)";
    db.query(sql, [email, accessibility], (err) => {
      if (err) {
        reject(500);
      } else {
        resolve(200);
      }
  });
  });
}

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, accessibility } = req.body;
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql =
      "INSERT INTO Users (firstName, lastName, email, password, accessibility) VALUES (?, ?, ?, ?, ?)";
      db.query(sql, [firstName, lastName, email, hashedPassword, accessibility], (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error registering user" });
        }
        res.cookie("userEmail", email, {
          httpOnly:true,
          secure:false,
          maxAge:24*60*60*1000
        });
        res.cookie("accessibility", accessibility, {
          httpOnly:true,
          secure:false,
          maxAge:24*60*60*1000
        })
        return res.status(201).json({ message: "User registered successfully" });
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/vi_view", async (req, res) => {
  try {
    const email = req.cookies.userEmail;
    const { voice, pitch, rate, volume } = req.body;

    const sql =
      "INSERT INTO vi_view (email, voice, pitch, rate, volume) VALUES (?, ?, ?, ?, ?)";
    console.log(email);
    db.query(sql, [email, voice, pitch, rate, volume], (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error saving VI preferences" });
      }

      return res.status(201).json({ message: "VI preferences saved successfully" });
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/hi_view", async (req, res) => {
  try {
    const { email, accessibility } = req.body;

    const sql =
      "INSERT INTO hi_view (email, voice, pitch, rate, volume) VALUES (?, ?)";
    
    db.query(sql, [email, accessibility], (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error saving HI preferences" });
      }

      return res.status(201).json({ message: "HI preferences saved successfully" });
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/nd_view", async (req, res) => {
  try {
    const { email, accessibility } = req.body;

    const sql =
      "INSERT INTO nd_view (email, voice, pitch, rate, volume) VALUES (?, ?)";
    
    db.query(sql, [email, accessibility], (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error saving ND preferences" });
      }

      return res.status(201).json({ message: "ND preferences saved successfully" });
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
