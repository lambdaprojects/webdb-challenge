exports.up = function(knex, Promise) {
  return knex.schema.createTable("context", function(context) {
    context.increments();

    context.string("name", 128).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("context");
};
