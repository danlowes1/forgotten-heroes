// routes/index.js
const router = require("express").Router();

const postRoutes = require("./post");
const heroRoutes = require("./hero");
const userRoutes = require("./user");
const hero_ai_findRoutes = require("./hero_ai_find");
const hero_ai_urlRoutes = require("./hero_ai_url");
const contactRoutes = require("./contact"); // ✅ include contact

// default test route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// mount all subroutes
router.use("/posts", postRoutes);
router.use("/heroes", heroRoutes);
router.use("/users", userRoutes);
router.use("/hero_ai_finds", hero_ai_findRoutes);
router.use("/hero_ai_urls", hero_ai_urlRoutes);
router.use("/contact", contactRoutes); // ✅ now lives at /api/contact

module.exports = router;
