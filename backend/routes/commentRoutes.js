const express = require("express");
const db = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

async function canSeePost(userId, postId) {
    const [posts] = await db.query(
        `SELECT 
            posts.id,
            posts.user_id,
            posts.visibility,
            users.profile_visibility
         FROM posts
         JOIN users ON posts.user_id = users.id
         WHERE posts.id = ?`,
        [postId]
    );

    if (posts.length === 0) {
        return false;
    }

    const post = posts[0];

    if (post.user_id == userId) {
        return true;
    }

    const [friends] = await db.query(
        "SELECT * FROM friendships WHERE user1_id = ? AND user2_id = ?",
        [userId, post.user_id]
    );

    if (friends.length > 0) {
        return true;
    }

    if (post.visibility === "public" && post.profile_visibility === "public") {
        return true;
    }

    return false;
}

async function canSeeComment(userId, commentId) {
    const [rows] = await db.query(
        "SELECT post_id FROM comments WHERE id = ?",
        [commentId]
    );

    if (rows.length === 0) {
        return false;
    }

    return await canSeePost(userId, rows[0].post_id);
}

// add comment to post
router.post("/post/:postId", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;
        const content = req.body.content;

        if (!content) {
            return res.status(400).json({ message: "Comment is required" });
        }

        const allowed = await canSeePost(userId, postId);

        if (!allowed) {
            return res.status(403).json({ message: "You cannot comment on this post" });
        }

        await db.query(
            "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [postId, userId, content]
        );

        res.status(201).json({ message: "Comment added" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// get comments of one post
router.get("/post/:postId", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const allowed = await canSeePost(userId, postId);

        if (!allowed) {
            return res.status(403).json({ message: "You cannot see comments of this post" });
        }

        const [comments] = await db.query(
            `
            SELECT 
                comments.id,
                comments.content,
                comments.created_at,
                users.id AS user_id,
                users.name,
                users.avatar,

                COUNT(DISTINCT comment_likes.id) AS likes_count,

                MAX(CASE 
                    WHEN my_likes.user_id IS NOT NULL THEN 1 
                    ELSE 0 
                END) AS liked_by_me

            FROM comments
            JOIN users ON comments.user_id = users.id

            LEFT JOIN comment_likes 
                ON comments.id = comment_likes.comment_id

            LEFT JOIN comment_likes AS my_likes 
                ON comments.id = my_likes.comment_id
                AND my_likes.user_id = ?

            WHERE comments.post_id = ?

            GROUP BY comments.id
            ORDER BY comments.created_at ASC
            `,
            [userId, postId]
        );

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// delete my comment
router.delete("/:id", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;

        const [comments] = await db.query(
            "SELECT * FROM comments WHERE id = ? AND user_id = ?",
            [commentId, userId]
        );

        if (comments.length === 0) {
            return res.status(404).json({ message: "Comment not found or not yours" });
        }

        await db.query(
            "DELETE FROM comments WHERE id = ?",
            [commentId]
        );

        res.json({ message: "Comment deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// like comment
router.post("/:id/like", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;

        const allowed = await canSeeComment(userId, commentId);

        if (!allowed) {
            return res.status(403).json({ message: "You cannot like this comment" });
        }

        const [oldLike] = await db.query(
            "SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?",
            [commentId, userId]
        );

        if (oldLike.length > 0) {
            return res.status(400).json({ message: "You already liked this comment" });
        }

        await db.query(
            "INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)",
            [commentId, userId]
        );

        res.json({ message: "Comment liked" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// remove comment like
router.delete("/:id/like", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;

        const allowed = await canSeeComment(userId, commentId);

        if (!allowed) {
            return res.status(403).json({ message: "You cannot remove like from this comment" });
        }

        await db.query(
            "DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?",
            [commentId, userId]
        );

        res.json({ message: "Comment like removed" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;