// controllers/heroController.js
const { callStoredProc } = require("../utils/storedProcHelper");

async function getRandomHeroName(req, res) {
  try {
    const result = await callStoredProc("up_SEL_HeroRandomName", []);

    // MySQL often wraps results; check the first row
    const randomHeroName = result[0]?.RandomHeroName;

    res.json({ RandomHeroName: randomHeroName });
  } catch (err) {
    res.status(500).json({ error: "Failed to get hero name" });
  }
}

module.exports = { getRandomHeroName };
