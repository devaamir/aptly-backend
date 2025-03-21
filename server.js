const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const Admin = require("./models/Admin");

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // For local development
  "https://aptly-admin.netlify.app", // For production
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Seed Admin User
const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: "admin@aptly.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      const admin = new Admin({
        email: "admin@aptly.com",
        password: hashedPassword,
      });
      await admin.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  }
};

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    seedAdmin(); // Call the seeding function after connection
  })
  .catch((err) => console.log("MongoDB connection error:", err.message));

// Routes
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
