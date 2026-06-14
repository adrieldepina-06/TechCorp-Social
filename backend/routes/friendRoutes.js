const express = require("express");
const db = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// send friend request
router.post("/request/:id", auth, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    if (senderId == receiverId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    // check if they are already friends
    const [friends] = await db.query(
      "SELECT * FROM friendships WHERE user1_id = ? AND user2_id = ?",
      [senderId, receiverId]
    );

    if (friends.length > 0) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // check if there is already a pending request in any direction
    const [oldRequest] = await db.query(
      `SELECT * FROM friend_requests
       WHERE (
         (sender_id = ? AND receiver_id = ?)
         OR
         (sender_id = ? AND receiver_id = ?)
       )
       AND status = 'pending'`,
      [senderId, receiverId, receiverId, senderId]
    );

    if (oldRequest.length > 0) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    // insert request
    // ON DUPLICATE KEY allows sending again if an old rejected request exists
    await db.query(
      `INSERT INTO friend_requests (sender_id, receiver_id, status)
       VALUES (?, ?, 'pending')
       ON DUPLICATE KEY UPDATE status = 'pending', created_at = CURRENT_TIMESTAMP`,
      [senderId, receiverId]
    );

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get requests sent to me
router.get("/requests", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [requests] = await db.query(
      `SELECT 
        friend_requests.id,
        friend_requests.sender_id,
        users.name,
        users.email,
        users.avatar
       FROM friend_requests
       JOIN users ON friend_requests.sender_id = users.id
       WHERE friend_requests.receiver_id = ?
       AND friend_requests.status = 'pending'`,
      [userId]
    );

    res.json(requests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// accept friend request
router.post("/accept/:id", auth, async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT * FROM friend_requests
       WHERE id = ?
       AND receiver_id = ?
       AND status = 'pending'`,
      [requestId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const request = rows[0];

    await db.query(
      "UPDATE friend_requests SET status = 'accepted' WHERE id = ?",
      [requestId]
    );

    // bidirectional friendship
    // row 1: sender -> receiver
    // row 2: receiver -> sender
    await db.query(
      `INSERT IGNORE INTO friendships (user1_id, user2_id)
       VALUES (?, ?), (?, ?)`,
      [
        request.sender_id,
        request.receiver_id,
        request.receiver_id,
        request.sender_id
      ]
    );

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// reject friend request
router.post("/reject/:id", auth, async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT * FROM friend_requests
       WHERE id = ?
       AND receiver_id = ?
       AND status = 'pending'`,
      [requestId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    await db.query(
      "UPDATE friend_requests SET status = 'rejected' WHERE id = ?",
      [requestId]
    );

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get my friends
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [friends] = await db.query(
      `SELECT 
        users.id,
        users.name,
        users.email,
        users.avatar
       FROM friendships
       JOIN users ON users.id = friendships.user2_id
       WHERE friendships.user1_id = ?`,
      [userId]
    );

    res.json(friends);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get all pending requests sent or received by me
router.get("/my-requests", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [requests] = await db.query(
      `SELECT * FROM friend_requests
       WHERE (sender_id = ? OR receiver_id = ?)
       AND status = 'pending'`,
      [userId, userId]
    );

    res.json(requests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// remove friend
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    // delete both friendship directions
    await db.query(
      `DELETE FROM friendships
       WHERE (user1_id = ? AND user2_id = ?)
       OR (user1_id = ? AND user2_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    // delete old friend request records between the two users
    await db.query(
      `DELETE FROM friend_requests
       WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;