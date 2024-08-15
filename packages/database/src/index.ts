import * as edgedb from "edgedb";
export * as edgedb from "edgedb";
import e from "../dbschema/edgeql-js";
export * from "../dbschema/interfaces";

export const queryBuilder = e;
export const dbClient = edgedb.createClient();