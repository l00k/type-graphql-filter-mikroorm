export type FilterOperator =
  | "eq"
  | "gt"
  | "gte"
  | "in"
  | "lt"
  | "lte"
  | "ne"
  | "nin"
  | "like"
  | "re"
  | "ilike"
  | "overlap"
  | "contains"
  | "contained"
  ;

export type LogicalOperator =
  | "and"
  | "or"
  | "not"

export const FILTER_OPERATORS: (LogicalOperator|FilterOperator)[] = [ "eq", "gt", "gte", "in", "lt", "lte", "ne", "nin", "like", "re", "ilike", "overlap", "contains", "contained", "and", "or", "not" ];

export const LOGICAL_RETURN_TYPE_OPERATORS: LogicalOperator[] = ["and", "or", "not"];

export const ARRAY_RETURN_TYPE_OPERATORS: (LogicalOperator|FilterOperator)[] = ["and", "or", "in"];
