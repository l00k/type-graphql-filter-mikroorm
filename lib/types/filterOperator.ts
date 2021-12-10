export type FilterOperator =
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'nin'
    | 'like'
    | 're'
    | 'ilike'
    | 'overlap'
    | 'contains'
    | 'contained'
    ;

export type LogicalOperator =
    | 'and'
    | 'or'
    | 'not'
    ;

export const FILTER_OPERATORS : string[] = [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'like', 're', 'ilike', 'overlap', 'contains', 'contained', 'and', 'or', 'not' ];

export const LOGICAL_OPERATORS : string[] = [ 'and', 'or', 'not' ];

export const ARRAY_OPERATORS : string[] = [ 'and', 'or', 'in', 'nin' ];

export const DEFAULT_FILTERS : FilterOperator[] = [ 'eq', 'ne', 'in', 'nin' ];
export const BOOLEAN_DEFAULT_FILTERS : FilterOperator[] = [ 'eq', 'ne', 'in', 'nin' ];
export const NUMBER_DEFAULT_FILTERS : FilterOperator[] = [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin' ];
export const STRING_DEFAULT_FILTERS : FilterOperator[] = [ 'eq', 'ne', 'like', 'in', 'nin', 'ilike', 'overlap', 'contains', 'contained' ];
export const DATE_DEFAULT_FILTERS : FilterOperator[] = [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin' ];
