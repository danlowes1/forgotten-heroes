// models/index.js
// import all models
const Post = require("./post");
const Hero = require("./hero");
const User = require("./user");
const Hero_ai_find = require("./hero_ai_find");
const Hero_ai_url = require("./hero_ai_url");

/// Hero>Post 1 to many
Post.belongsTo(Hero, {
  foreignKey: "hero_id",
  as: "hero",
});

Hero.hasMany(Post, {
  foreignKey: "hero_id",
  as: "hero_posts",
});

Hero_ai_find.belongsTo(Hero, {
  foreignKey: "hero_id",
  onDelete: 'CASCADE',
  // as: "hero_ai_find",
});

Hero.hasMany(Hero_ai_find, {
  foreignKey: "hero_id",
  // as: "Hero_hero_ai_find",
});
///Hero>Hero_ai_url 1 to many 
Hero_ai_url.belongsTo(Hero, {
  foreignKey: "hero_id",
  onDelete: 'CASCADE', // delete all hero_urls when a hero is deleted
  as: "hero_ai_url",
});

Hero.hasMany(Hero_ai_url, {
  foreignKey: "hero_id",
  as: "Hero_hero_ai_url",
});

///User>Post 1 to many 
Post.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(Post, {
  foreignKey: "user_id",
  as: "user_posts",
});


module.exports = {
  Post,
  Hero,
  User,
  Hero_ai_find,
  Hero_ai_url
};


