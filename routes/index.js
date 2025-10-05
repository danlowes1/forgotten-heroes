// routes/index.js
const router = require("express").Router();

const postRoutes = require("./post");
const heroRoutes = require("./hero");
const userRoutes = require("./user");
const hero_ai_findRoutes = require("./hero_ai_find");
const hero_ai_urlRoutes = require("./hero_ai_url");

// create a default route for /api
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

router.use("/posts", postRoutes);
router.use("/heroes", heroRoutes);
router.use("/users", userRoutes);
router.use("/hero_ai_finds", hero_ai_findRoutes);
router.use("/hero_ai_urls", hero_ai_urlRoutes);


// create a default route for /api
// router.get("/api", (req, res) => {
//   res.json({ message: "Welcome to the API" });
// });

// router.use("/api/posts", postRoutes);
// router.use("/api/heroes", heroRoutes);
// router.use("/api/users", userRoutes);
// router.use("/api/hero_ai_finds", hero_ai_findRoutes);  // ****** check this line
// router.use("/api/hero_ai_urls", hero_ai_urlRoutes);


module.exports = router;
