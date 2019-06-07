const db = require("../dbConfig.js");

module.exports = {
  get,
  add,
  remove,
  update
};

function get() {
  return db("actions_context");
}

function add(action_context) {
  return db("actions_context")
    .insert(action_context)
    .then(([id]) => this.get(id));
}

function remove(id) {
  return db("actions_context")
    .where("id", id)
    .del();
}

function update(id, action_context) {
  return db("actions_context")
    .where("id", id)
    .update(action_context)
    .then(count => (count > 0 ? this.get(id) : null));
}
