import Knex from "knex";
import { ItemScheme } from "../../Models/Item";

export async function up(knex: Knex) {
  return knex.schema.createTable(ItemScheme.table, table => {
    table.increments(ItemScheme.columns.id).primary();
    table.string(ItemScheme.columns.image).notNullable();
    table.string(ItemScheme.columns.title).notNullable();
  });
};

export async function down(knex: Knex) {
  return knex.schema.dropTable(ItemScheme.table);
};