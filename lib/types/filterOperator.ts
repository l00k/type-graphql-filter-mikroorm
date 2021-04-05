export type FilterOperator =
  | "eq"
  | "gt"
  | "gte"
  | "in"
  | "lt"
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

export const LOGICAL_RETURN_TYPE_OPERATORS: LogicalOperator[] = ["and", "or", "not"];

export const ARRAY_RETURN_TYPE_OPERATORS: (LogicalOperator|FilterOperator)[] = ["and", "or", "in"];
