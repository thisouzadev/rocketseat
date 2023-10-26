import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {}

export async function down(knex: Knex): Promise<void> {}

exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').primary()
    table.string('username').notNullable()
    table.string('password').notNullable()
    table.string('email').notNullable().unique()

    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
