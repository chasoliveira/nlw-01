import Knex from "knex";
import { PointScheme } from "../../Models/Point";

export async function up(knex: Knex) {
  return knex.schema.createTable(PointScheme.table, table => {
    table.increments(PointScheme.columns.id).primary();
    table.string(PointScheme.columns.image).notNullable();
    table.string(PointScheme.columns.name).notNullable();
    table.string(PointScheme.columns.email).notNullable();
    table.string(PointScheme.columns.whatsapp).notNullable();
    table.decimal(PointScheme.columns.latitude).notNullable();
    table.decimal(PointScheme.columns.longitude).notNullable();
    table.string(PointScheme.columns.city).notNullable();
    table.string(PointScheme.columns.uf, 2).notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(PointScheme.table);
}