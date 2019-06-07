const db = require("../dbConfig.js");

module.exports = {
  get,
  getById,
  add,
  remove,
  update
};

function get() {
  return db("context");
}

function getById(id) {
  return db("context");
}

function add(context) {
  return db("context")
    .insert(context)
    .then(([id]) => this.get(id));
}

function remove(id) {
  return db("context")
    .where("id", id)
    .del();
}

function update(id, context) {
  return db("context")
    .where("id", id)
    .update(context)
    .then(count => (count > 0 ? this.get(id) : null));
}
