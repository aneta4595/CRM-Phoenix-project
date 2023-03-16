import { LeadSizeModel } from "../models/lead-size.model";

export interface FilterValueQueryModel {
    readonly scopes: Set<string>;
    readonly sizes: LeadSizeModel[];
}
