// routes/hero_ai_find.js
const app = require("express").Router();

// import the models, including Hero for the join
const { Hero_ai_find, Hero } = require("../models/index");

// NEW ROUTE (MOVED TO TOP): Get hero_ai_find records by hero_name
app.get("/by-hero-name/:hero_name", async (req, res) => {
  try {
    const hero_name = req.params.hero_name;
    const hero_ai_finds = await Hero_ai_find.findAll({
      include: [
        {
          model: Hero, // Include the Hero model
          where: {
            hero_name: hero_name, // Filter the included Hero model by hero_name
          },
        },
      ],
    });

    if (hero_ai_finds.length === 0) {
      return res
        .status(404)
        .json({
          message: `No Hero AI finds found for hero_name: ${hero_name}`,
        });
    }

    res.json(hero_ai_finds);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error retrieving hero_ai_finds by hero name" });
  }
});

// Find by hero_id
app.get("/by-hero-id/:hero_id", async (req, res) => {
  try {
    const hero_id = req.params.hero_id; // Get the ID from the route parameters
    const hero_ai_finds = await Hero_ai_find.findAll({
      where: {
        hero_id: hero_id, // Filter by the hero_id field
      },
    });

    // Return the array of records
    res.json(hero_ai_finds);
    
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Error retrieving hero_ai_finds by hero ID" });
  }
});


// Route to get a specific post by ID
app.get("/:id", async (req, res) => {
  try {
    const hero_ai_find = await Hero_ai_find.findByPk(req.params.id);
    if (!hero_ai_find) {
      return res.status(404).json({ message: "Hero AI find not found" });
    }
    res.json(hero_ai_find);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving hero_ai_find" });
  }
});

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    const { content, hero_id } = req.body;
    const hero_ai_find = await Hero_ai_find.create({ content, hero_id });
    res.status(201).json(hero_ai_find);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding hero_ai_find", error: error });
  }
});

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    console.log("Getting all heroes");
    const hero_ai_finds = await Hero_ai_find.findAll();
    console.log(hero_ai_finds);
    res.json(hero_ai_finds);
  } catch (error) {
    res.status(500).json({ message: "Error adding hero_ai_find", error: error });
  }
});

// Route to update a hero_ai_find
app.put("/:id", async (req, res) => {
  try {
    const { content, findDate } = req.body;
    const post = await Hero_ai_find.update(
      { content, findDate },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating hero_ai_find" });
  }
});

// Route to delete a hero_ai_find
app.delete("/:id", async (req, res) => {
  try {
    const hero_ai_find = await Hero_ai_find.destroy({ where: { id: req.params.id } });
    res.json(hero_ai_find);
  } catch (error) {
    res.status(500).json({ error: "Error deleting hero_ai_find" });
  }
});

// export the router
module.exports = app;