const express = require("express");
const db = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// get my profile
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT id, name, email, avatar, profile_visibility, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get all users except me
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await db.query(
      "SELECT id, name, email, avatar, profile_visibility FROM users WHERE id != ?",
      [userId]
    );

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get one user profile
router.get("/:id", auth, async (req, res) => {
  try {
    const profileId = req.params.id;

    const [rows] = await db.query(
      "SELECT id, name, email, avatar, profile_visibility, created_at FROM users WHERE id = ?",
      [profileId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// update my profile
router.put("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar, profile_visibility } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    await db.query(
      "UPDATE users SET name = ?, avatar = ?, profile_visibility = ? WHERE id = ?",
      [name, avatar || "default-avatar.png", profile_visibility || "public", userId]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;