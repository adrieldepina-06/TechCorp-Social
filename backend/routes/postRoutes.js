const express = require("express");
const multer = require("multer");
const db = require("../db");
const auth = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// image upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// create post with optional image
router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        const userId = req.user.id;
        const content = req.body.content;
        const visibility = req.body.visibility || "public";

        let image = null;

        if (req.file) {
            image = "/uploads/" + req.file.filename;
        }

        if (!content && !image) {
            return res.status(400).json({ message: "Write something or add image" });
        }

        await db.query(
            "INSERT INTO posts (user_id, content, image, visibility) VALUES (?, ?, ?, ?)",
            [userId, content || "", image, visibility]
        );

        res.status(201).json({ message: "Post created" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// get timeline posts
router.get("/timeline", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const [posts] = await db.query(
            `
                SELECT 
                    posts.id,
                    posts.content,
                    posts.image,
                    posts.visibility,
                    posts.created_at,
                    users.id AS user_id,
                    users.name,
                    users.avatar,

                    COUNT(DISTINCT post_likes.id) AS likes_count,
                    COUNT(DISTINCT comments.id) AS comments_count,

                    MAX(CASE 
                    WHEN my_likes.user_id IS NOT NULL THEN 1 
                    ELSE 0 
                    END) AS liked_by_me

                FROM posts
                JOIN users ON posts.user_id = users.id

                LEFT JOIN post_likes ON posts.id = post_likes.post_id
                LEFT JOIN comments ON posts.id = comments.post_id

                LEFT JOIN post_likes AS my_likes 
                    ON posts.id = my_likes.post_id 
                    AND my_likes.user_id = ?

                WHERE 
                    posts.user_id = ?
                    OR posts.user_id IN (
                    SELECT 
                        CASE
                        WHEN user1_id = ? THEN user2_id
                        ELSE user1_id
                        END
                    FROM friendships
                    WHERE user1_id = ? OR user2_id = ?
                    )  
                    OR (posts.visibility = 'public' AND users.profile_visibility = 'public')  

                GROUP BY posts.id
                ORDER BY posts.created_at DESC
                `,
            [userId, userId, userId, userId, userId]
        );

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// get posts of one user
router.get("/user/:id", auth, async (req, res) => {
    try {
        const myId = req.user.id;
        const userId = req.params.id;

        const [users] = await db.query(
            "SELECT id, profile_visibility FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = users[0];

        let canSeePrivate = false;

        if (myId == userId) {
            canSeePrivate = true;
        } else {
            const [friends] = await db.query(
                `SELECT * FROM friendships
         WHERE (user1_id = ? AND user2_id = ?)
         OR (user1_id = ? AND user2_id = ?)`,
                [myId, userId, userId, myId]
            );

            if (friends.length > 0) {
                canSeePrivate = true;
            }
        }

        if (profile.profile_visibility === "private" && !canSeePrivate) {
            return res.status(403).json({ message: "This profile is private" });
        }

        let sql = `
      SELECT 
        posts.id,
        posts.content,
        posts.image,
        posts.visibility,
        posts.created_at,
        users.id AS user_id,
        users.name,
        users.avatar,

        COUNT(DISTINCT post_likes.id) AS likes_count,
        COUNT(DISTINCT comments.id) AS comments_count,

        MAX(CASE 
          WHEN my_likes.user_id IS NOT NULL THEN 1 
          ELSE 0 
        END) AS liked_by_me

      FROM posts
      JOIN users ON posts.user_id = users.id

      LEFT JOIN post_likes ON posts.id = post_likes.post_id
      LEFT JOIN comments ON posts.id = comments.post_id

      LEFT JOIN post_likes AS my_likes 
        ON posts.id = my_likes.post_id 
        AND my_likes.user_id = ?

      WHERE posts.user_id = ?
    `;

        let values = [myId, userId];

        if (!canSeePrivate) {
            sql += " AND posts.visibility = 'public'";
        }

        sql += " GROUP BY posts.id ORDER BY posts.created_at DESC";

        const [posts] = await db.query(sql, values);

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});
// like post
router.post("/:id/like", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const [oldLike] = await db.query(
            "SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?",
            [postId, userId]
        );

        if (oldLike.length > 0) {
            return res.status(400).json({ message: "You already liked this post" });
        }

        await db.query(
            "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)",
            [postId, userId]
        );

        res.json({ message: "Post liked" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// remove like
router.delete("/:id/like", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        await db.query(
            "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?",
            [postId, userId]
        );

        res.json({ message: "Like removed" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// delete my post
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const [posts] = await db.query(
      "SELECT * FROM posts WHERE id = ? AND user_id = ?",
      [postId, userId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: "Post not found or not yours" });
    }

    const post = posts[0];

    await db.query(
      "DELETE FROM posts WHERE id = ?",
      [postId]
    );

    if (post.image) {
      const fileName = path.basename(post.image);
      const imagePath = path.join(__dirname, "..", "uploads", fileName);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;