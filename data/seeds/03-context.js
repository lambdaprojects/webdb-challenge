exports.seed = function(knex, Promise) {
  return knex("context").insert([
    { name: "Home" },
    { name: "Work" },
    { name: "At computer" }
  ]);
};
