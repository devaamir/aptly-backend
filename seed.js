const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

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

// Call this after mongoose.connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    seedAdmin();
  })
  .catch((err) => console.log("MongoDB connection error:", err.message));
