const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("admin123", salt);

    const admin = new Admin({
      email: "admin@aptly.com",
      password,
    });

    await admin.save();
    console.log("Admin created successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding admin:", err);
    mongoose.connection.close();
  });
