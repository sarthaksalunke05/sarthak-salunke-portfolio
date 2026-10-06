require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const Project = mongoose.model("Project", new mongoose.Schema({
  title: String, description: String, tech: [String], link: String,
}));
const Message = mongoose.model("Message", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}));

// Edit these to match your real projects
const seed = [
  { title: "OpenCart Automation Testing", description: "Automated test suite for the OpenCart e-commerce site: login, search, cart and checkout flows.", tech: ["Java", "Selenium", "TestNG"], link: "https://github.com/sarthaksalunke05/opencart-automation" },
  { title: "TrackBase Employee Dashboard", description: "Employee dashboard project customised with a new theme and published to GitHub.", tech: ["JavaScript", "React"], link: "https://github.com/sarthaksalunke05/trackbase" },
  { title: "Data Analytics Dashboard", description: "Sales analysis with SQL queries and an interactive Power BI report.", tech: ["SQL", "Power BI", "Excel"], link: "https://github.com/sarthaksalunke05" },
];

app.get("/api/projects", async (_req, res) => res.json(await Project.find()));

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "Fill in name, email and message." });
  await Message.create({ name, email, message });
  res.json({ ok: true });
});

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully ✅");

    await Project.deleteMany({});
    await Project.insertMany(seed);
    console.log("Projects seeded successfully ✅");
    app.listen(process.env.PORT || 5000, () => {
      console.log("API running on port " + (process.env.PORT || 5000));
    });
  })
  .catch((e) => {
    console.error("MongoDB connection failed:", e.message);
    process.exit(1);
  });