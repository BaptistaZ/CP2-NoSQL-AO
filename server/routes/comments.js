const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/:movieId", async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar comentários" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { movieId, text } = req.body;

  if (!text) return res.status(400).json({ message: "Comentário vazio!" });

  try {
    const newComment = new Comment({
      movieId,
      userId: req.user.id,
      userName: req.user.name,
      text,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar comentário" });
  }
});

module.exports = router;
