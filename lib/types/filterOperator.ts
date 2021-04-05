export type FilterOperator =
  | "lt"
  | "gt"
  | "lte"
  | "gte"
  | "eq"
  | "ne"
  | "in"
  | "like"
  | "likeAny"
  | "exist";

export type LogicalOperator =
  | "and"
  | "or"
  | "not"

export const LOGICAL_RETURN_TYPE_OPERATORS: LogicalOperator[] = ["and", "or", "not"];

export const ARRAY_RETURN_TYPE_OPERATORS: (LogicalOperator|FilterOperator)[] = ["and", "or", "in", "likeAny"];
