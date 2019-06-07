exports.up = function(knex, Promise) {
  return knex.schema.createTable("actions_context", function(actions_context) {
    actions_context.increments();

    actions_context
      .integer("action_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("actions")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    actions_context
      .integer("context_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("context")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("actions_context");
};
