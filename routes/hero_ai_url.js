// create a new router
const app = require("express").Router();

// import the models
const { Hero_ai_url } = require("../models/index");

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    const { content, url } = req.body;
    const hero_ai_url = await Hero_ai_url.create({ content, url });
    res.status(201).json(hero_ai_url);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding hero_ai_url", error: error });
  }
});

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    console.log("Getting all heroes");
    const hero_ai_urls = await Hero_ai_url.findAll();
    console.log(hero_ai_urls);
    res.json(hero_ai_urls);
  } catch (error) {
    res.status(500).json({ message: "Error adding hero_ai_url", error: error });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const hero_ai_url = await Post.findByPk(req.params.id);
    res.json(hero_ai_url);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving hero_ai_url" });
  }
});

// Route to update a hero_ai_url
app.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const post = await Hero_ai_url.update(
      { name },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating hero_ai_url" });
  }
});

// Route to delete a hero_ai_url
app.delete("//:id", async (req, res) => {
  try {
    const hero_ai_url = await hero_ai_url.destroy({ where: { id: req.params.id } });
    res.json(hero_ai_url);
  } catch (error) {
    res.status(500).json({ error: "Error deleting hero_ai_url" });
  }
});

// export the router
module.exports = app;
