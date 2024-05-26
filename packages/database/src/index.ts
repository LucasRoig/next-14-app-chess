import * as edgedb from "edgedb";
import e from "../dbschema/edgeql-js"

export const queryBuilder = e;
export const dbClient = edgedb.createClient();
