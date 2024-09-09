const db = require('../../data/dbConfig');

function find() {
  return db('users');
}

function findById(id) {
  return db('users').where('id', id).first();
}

async function add({ username, password }) {
  const [id] = await db('users').insert({ username, password });
  return findById(id);
}

module.exports = {
  find,
  findById,
  add,
}