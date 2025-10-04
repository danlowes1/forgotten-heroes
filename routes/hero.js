// routes/hero.js
const { callStoredProc } = require("../utils/storedProcHelper");
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
    const hero = await Hero.findByPk(req.params.id);
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving hero" });
  }
});


// route to get a hero by name
app.get("/name/:hero_name", async (req, res) => {
  try {
    const hero = await Hero.findOne({
      where: {
        hero_name: req.params.hero_name // The name from the URL parameter
      }
    });

    if (hero) {
      res.json(hero);
    } else {
      res.status(404).json({ error: "Hero not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving hero by name" });
  }
});


// Example: POST route to find or create a Hero
// This uses req.body for cleaner data handling for creation
app.post("/find-or-create", async (req, res) => {
  const { hero_name } = req.body; 

  try {
    // 1. Define the criteria for finding the record
    const [hero, created] = await Hero.findOrCreate({
      where: { 
        hero_name: hero_name // Search condition (the name we are checking)
      },
      // 2. Define the values for the new record (if it's not found)
      defaults: {
        hero_name: hero_name,
      }
    });

    // findOrCreate returns an array:
    // [0] is the instance (the found or newly created hero object)
    // [1] is a boolean (true if a new record was created, false if it was found)

    if (created) {
      // The record was INSERTED
      res.status(201).json({
        message: "New hero created successfully.",
        hero: hero
      });
    } else {
      // The record was FOUND
      res.status(200).json({
        message: "Hero found successfully.",
        hero: hero
      });
    }

  } catch (error) {
    console.error("Error finding or creating hero:", error);
    // You can use a 400 status if the data provided in the body was invalid
    res.status(500).json({ error: "An error occurred during find or create." });
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
app.delete("/:id", async (req, res) => {
  try {
    const result = await Hero.destroy({ where: { id: req.params.id } });
    res.json({ deleted: result });
    // res.json(hero);
  } catch (error) {
    res.status(500).json({ error: "Error deleting hero" });
  }
});

// Route to get a random hero name from stored procedure
app.get("/random", async (req, res) => {
  try {
    const result = await callStoredProc("up_SEL_HeroRandomName");

    // Sequelize returns an array of rows, so grab the first one
    const randomHeroName = result[0]?.RandomHeroName;

    res.json({ RandomHeroName: randomHeroName });
  } catch (error) {
    console.error("Error calling stored procedure:", error);
    res.status(500).json({ error: "Failed to get random hero" });
  }
});


// export the router
module.exports = app;
