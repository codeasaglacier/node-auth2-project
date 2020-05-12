const knex = require( "knex" )
const kenxfile = require( "../knexfile" )

module.exports = knex( kenxfile )