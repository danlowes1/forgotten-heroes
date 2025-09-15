// routes/hero.js
const app = require("express").Router();

// import the models
const { Hero } = require("../models/index");

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    const { hero_name } = req.body;
    const hero = await Hero.create({ hero_name });
    res.status(201).json(hero);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding hero", error: error });
  }
});

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    console.log("Getting all heroes");
    const heroes = await Hero.findAll();
    console.log(heroes);
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: "Error adding hero", error: error });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const hero = await Post.findByPk(req.params.id);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving hero" });
  }
});

// Route to update a hero
app.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const post = await Hero.update(
      { name },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating hero" });
  }
});

// Route to delete a hero
app.delete("//:id", async (req, res) => {
  try {
    const hero = await hero.destroy({ where: { id: req.params.id } });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: "Error deleting hero" });
  }
});

// export the router
module.exports = app;
