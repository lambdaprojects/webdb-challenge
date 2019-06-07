exports.seed = function(knex, Promise) {
  return knex("actions_context").insert([
    { action_id: "1", context_id: "1" },
    { action_id: "2", context_id: "2" },
    { action_id: "3", context_id: "2" }
  ]);
};
