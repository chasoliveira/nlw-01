import Knex from "knex";
import { PointItemScheme } from "../../Models/PointItem";
import { PointScheme } from "../../Models/Point";
import { ItemScheme } from "../../Models/Item";

export async function up(knex: Knex) {
  return knex.schema.createTable(PointItemScheme.table, table => {
    table.increments(PointItemScheme.columns.id).primary();
    table.integer(PointItemScheme.columns.pointId).notNullable()
      .references(PointScheme.columns.id).inTable(PointScheme.table);
    table.integer(PointItemScheme.columns.itemId).notNullable()
      .references(ItemScheme.columns.id).inTable(ItemScheme.table);
  });
};

export async function down(knex: Knex) {
  return knex.schema.dropTable(PointItemScheme.table);
};