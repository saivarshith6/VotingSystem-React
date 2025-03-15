const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Poll = require("./models/pollModel");

const app = express();
const port = 5050;

app.use(express.json());
app.use(cors()); // ✅ Enable CORS for React frontend

// ✅ Get all polls
app.get("/polls", async (req, res) => {
  try {
    const polls = await Poll.find({});
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ DELETE a poll by ID
app.delete("/polls/:id", async (req, res) => {
  try {
    const deletedPoll = await Poll.findByIdAndDelete(req.params.id);
    if (!deletedPoll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.json({ message: "Poll deleted successfully", deletedPoll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Vote on a poll
app.post("/polls/:id/vote", async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    poll.options[optionIndex].votes++; // Increase vote count
    await poll.save();
    res.json({ message: "Vote counted!", poll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb+srv://2211cs010696:iF6VpepQ6T5uAGcj@yathish.6bgkc.mongodb.net/?retryWrites=true&w=majority&appName=yathish", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running at: http://localhost:${port}`);
    });
  })
  .catch((error) => console.error(error));
