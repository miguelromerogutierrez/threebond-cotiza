const knex = require('../db').knex;
const bookshelf = require('bookshelf')(knex);

const Customer = bookshelf.Model.extend({
    tableName: 'customers'
});

module.exports = Customer;