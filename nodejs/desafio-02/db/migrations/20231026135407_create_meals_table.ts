exports.up = function (knex) {
  return knex.schema.createTable('meals', function (table) {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.boolean('is_diet_meal').notNullable()
    table.timestamps(true, true)

    table.foreign('user_id').references('id').inTable('users')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('meals')
}
