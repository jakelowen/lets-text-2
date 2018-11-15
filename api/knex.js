const knex = require('knex');
const pg = require('pg');

const { DATABASE_URL } = process.env;

// Create knex client for connecting to Postgres
const createKnex = () => {
  pg.defaults.ssl = true;
  const knexClient = knex({
    client: 'pg',
    connection: DATABASE_URL,
  });
  return knexClient;
};

module.exports = createKnex;
