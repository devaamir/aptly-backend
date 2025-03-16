const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const auth = require("../middleware/auth");

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { admin: { id: admin.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// List Hospitals (GET)
router.get("/hospitals", auth, async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Create Hospital (POST)
router.post("/hospital", auth, async (req, res) => {
  const { name, location } = req.body;
  try {
    const hospital = new Hospital({ name, location });
    await hospital.save();
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update Hospital (PUT)
router.put("/hospital/:id", auth, async (req, res) => {
  const { name, location } = req.body;
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true } // Return the updated document
    );
    if (!hospital) return res.status(404).json({ msg: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete Hospital (DELETE)
router.delete("/hospital/:id", auth, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).json({ msg: "Hospital not found" });
    res.json({ msg: "Hospital deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/// Create Doctor (POST)
router.post("/doctor", auth, async (req, res) => {
  const { name, specialty, hospital, profileImage } = req.body;
  try {
    const doctor = new Doctor({ name, specialty, hospital, profileImage });
    await doctor.save();
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// List Doctors by Hospital (GET)
router.get("/doctors/:hospitalId", auth, async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospital: req.params.hospitalId });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update Doctor (PUT)
router.put("/doctor/:id", auth, async (req, res) => {
  const { name, specialty, hospital, profileImage } = req.body;
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, specialty, hospital, profileImage },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete Doctor (DELETE)
router.delete("/doctor/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });
    res.json({ msg: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
