const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const db = mysql.createPool({
  connectionLimit: 30, // Adjust as needed
  host: "localhost",
  user: "root",
  password: "",
  database: "fyplogin",
  port: 3306,
});

const tableMap = {
  vi: "vi_view",
  hi: "hi_view",
  nd: "nd_view",
};

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM Users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const storedHashedPassword = result[0].password;
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.cookie("userEmail", email, {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("name", result[0].firstName, {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    if (result[0].accessibility) {
      const accessibility = result[0].accessibility;

      if (accessibility === "vi") {
        return vi_user(email, accessibility, (err, accessibilityData) => {
          if (err) {
            console.error("Error fetching accessibility data:", err);
            return res
              .status(500)
              .json({ message: "Error retrieving accessibility settings" });
          }

          res.cookie(
            "accessibility",
            JSON.stringify({
              type: accessibility,
              data: accessibilityData,
            }),
            {
              httpOnly: false,
              secure: false,
              maxAge: 24 * 60 * 60 * 1000,
            }
          );
          return res.status(200).json({ message: "Login successful" });
        });
      }

      if (accessibility === "hi") {
        return hi_user(email, accessibility, (err, accessibilityData) => {
          if (err) {
            console.error("Error fetching accessibility data:", err);
            return res
              .status(500)
              .json({ message: "Error retrieving accessibility settings" });
          }

          res.cookie(
            "accessibility",
            JSON.stringify({
              type: accessibility,
              data: accessibilityData,
            }),
            {
              httpOnly: false,
              secure: false,
              maxAge: 24 * 60 * 60 * 1000,
            }
          );
          return res.status(200).json({ message: "Login successful" });
        });
      }
      if (accessibility === "nd") {
        return nd_user(email, accessibility, (err, accessibilityData) => {
          if (err) {
            console.error("Error fetching accessibility data:", err);
            return res
              .status(500)
              .json({ message: "Error retrieving accessibility settings" });
          }

          res.cookie(
            "accessibility",
            JSON.stringify({
              type: accessibility,
              data: accessibilityData,
            }),
            {
              httpOnly: false,
              secure: false,
              maxAge: 24 * 60 * 60 * 1000,
            }
          );
          return res.status(200).json({ message: "Login successful" });
        });
      }
    } else {
      // No accessibility settings, normal login
      return res.status(200).json({ message: "Login successful" });
    }
  });
});

app.post("/verify-password", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM Users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const storedHashedPassword = result[0].password;
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({ message: "Password verified successfully." });
  });
});

function hi_user(email, accessibility, callback) {
  const table = tableMap[accessibility];
  if (!table) {
    return callback(new Error("Invalid accessibility value"), null);
  }
  const accessSQL = `SELECT notification_type, text_size, custom_cursor, simple_english FROM ${table} WHERE email = ?`;
  db.query(accessSQL, [email], (err, results) => {
    if (err) {
      console.error("Error fetching accessibility data for user ", email);
      return callback(err, null);
    }
    return callback(null, results[0] || {});
  });
}

function nd_user(email, accessibility, callback) {
  const table = tableMap[accessibility];
  if (!table) {
    return callback(new Error("Invalid accessibility value"), null);
  }
  const accessSQL = `SELECT notification_type,
      text_size,
      custom_cursor,
      bionic_reading,
      text_to_speech,
      voice: voice?.name || "",
      pitch,
      rate,
      volume,
      text_colour,
      component_colour FROM ${table} WHERE email = ?`;
  db.query(accessSQL, [email], (err, results) => {
    if (err) {
      console.error("Error fetching accessibility data for user ", email);
      return callback(err, null);
    }
    return callback(null, results[0] || {});
  });
}

function vi_user(email, accessibility, callback) {
  const table = tableMap[accessibility];
  if (!table) {
    return callback(new Error("Invalid accessibility value"), null);
  }
  const accessSQL = `SELECT voice, pitch, rate, volume FROM ${table} WHERE email = ?`;
  db.query(accessSQL, [email], (err, results) => {
    if (err) {
      console.error("Error fetching accessibility data for user ", email);
      return callback(err, null);
    }
    return callback(null, results[0] || {});
  });
}

function setAccessibilityCookie(res, email, accessibility, callback) {}

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, accessibility } = req.body;
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql =
      "INSERT INTO Users (firstName, lastName, email, password, accessibility) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [firstName, lastName, email, hashedPassword, accessibility],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error registering user" });
        }
        res.cookie("userEmail", email, {
          httpOnly: false,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie("name", firstName, {
          httpOnly: false,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res
          .status(201)
          .json({ message: "User registered successfully" });
      }
    );
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

    db.query(sql, [email, voice, pitch, rate, volume], (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error saving VI preferences" });
      }

      const accessibilityData = { voice, pitch, rate, volume };

      res.cookie(
        "accessibility",
        JSON.stringify({
          type: "vi",
          data: accessibilityData,
        }),
        {
          httpOnly: false,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        }
      );

      return res
        .status(201)
        .json({ message: "VI preferences saved successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/hi_view", async (req, res) => {
  try {
    const email = req.cookies.userEmail;
    const { notification_type, text_size, custom_cursor, simple_english } =
      req.body;

    if (!email) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const sql = `
      INSERT INTO hi_view (email, notification_type, text_size, custom_cursor, simple_english)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [email, notification_type, text_size, custom_cursor, simple_english],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ message: "Error saving HI preferences" });
        }

        const accessibilityData = {
          notification_type,
          text_size,
          custom_cursor,
          simple_english,
        };

        res.cookie(
          "accessibility",
          JSON.stringify({
            type: "hi",
            data: accessibilityData,
          }),
          {
            httpOnly: false,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
          }
        );

        return res
          .status(201)
          .json({ message: "HI preferences saved successfully" });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/nd_view", async (req, res) => {
  try {
    const email = req.cookies.userEmail;
    const {
      notification_type,
      text_size,
      custom_cursor,
      bionic_reading,
      text_to_speech,
      voice,
      pitch,
      rate,
      volume,
      text_colour,
      component_colour,
    } = req.body;

    if (!email) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const sql = `
      INSERT INTO nd_view (email, notification_type,
      text_size,
      custom_cursor,
      bionic_reading,
      text_to_speech,
      voice,
      pitch,
      rate,
      volume,
      text_colour,
      component_colour)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
    `;

    db.query(
      sql,
      [
        email,
        notification_type,
        text_size,
        custom_cursor,
        bionic_reading,
        text_to_speech,
        voice,
        pitch,
        rate,
        volume,
        text_colour,
        component_colour,
      ],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ message: "Error saving ND preferences" });
        }

        const accessibilityData = {
          notification_type,
          text_size,
          custom_cursor,
          bionic_reading,
          text_to_speech,
          voice,
          pitch,
          rate,
          volume,
          text_colour,
          component_colour,
        };

        res.cookie(
          "accessibility",
          JSON.stringify({
            type: "nd",
            data: accessibilityData,
          }),
          {
            httpOnly: false,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
          }
        );

        return res
          .status(201)
          .json({ message: "ND preferences saved successfully" });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/payments", async (req, res) => {
  const email = req.cookies.userEmail;
  const { amount } = req.body;

  if (!email) return res.status(401).json({ error: "User not logged in." });
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid payment amount." });
  }

  const selectSql = "SELECT balance FROM Users WHERE email = ?";
  db.query(selectSql, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const currentBalance = parseFloat(results[0].balance);
    if (currentBalance < amount) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    const newBalance = currentBalance - amount;

    const updateSql = "UPDATE Users SET balance = ? WHERE email = ?";
    db.query(updateSql, [newBalance, email], (updateErr) => {
      if (updateErr) {
        console.error("Error updating balance:", updateErr);
        return res.status(500).json({ error: "Could not update balance." });
      }

      return res.status(200).json({
        message: "Payment successful.",
        newBalance: newBalance,
      });
    });
  });
});

app.post("/api/transfer", async (req, res) => {
  const email = req.cookies.userEmail;
  const { amount } = req.body;

  if (!email) return res.status(401).json({ error: "User not logged in." });
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid transfer amount." });
  }

  // Fetch user's current balance
  const selectSql = "SELECT balance FROM Users WHERE email = ?";
  db.query(selectSql, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const currentBalance = parseFloat(results[0].balance);
    const newBalance = currentBalance + parseFloat(amount);

    const updateSql = "UPDATE Users SET balance = ? WHERE email = ?";
    db.query(updateSql, [newBalance, email], (updateErr) => {
      if (updateErr) {
        console.error("Error updating balance:", updateErr);
        return res.status(500).json({ error: "Could not update balance." });
      }

      return res.status(200).json({
        message: "Transfer successful.",
        newBalance: newBalance,
      });
    });
  });
});

app.post("/update-settings", async (req, res) => {
  try {
    const email = req.cookies.userEmail;
    const { password, voice, pitch, rate, volume } = req.body;

    if (!email) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (password) {
      const sqlPassword = "UPDATE Users SET password = ? WHERE email = ?";
      db.query(sqlPassword, [password, email], (err) => {
        if (err) {
          console.error("Password update failed:", err);
          return res.status(500).json({ message: "Failed to update password" });
        }
      });
    }

    const sqlAccessibility =
      "REPLACE INTO vi_view (email, voice, pitch, rate, volume) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlAccessibility, [email, voice, pitch, rate, volume], (err) => {
      if (err) {
        console.error("Accessibility update failed:", err);
        return res
          .status(500)
          .json({ message: "Failed to update accessibility preferences" });
      }

      res.cookie(
        "accessibility",
        JSON.stringify({
          type: "vi",
          data: { voice, pitch, rate, volume },
        }),
        {
          httpOnly: false,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        }
      );

      return res.status(200).json({ message: "Settings updated successfully" });
    });
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("userEmail");
  res.clearCookie("accessibility");
  res.clearCookie("name");
  return res.status(200).json({ message: "Logged out successfully" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
