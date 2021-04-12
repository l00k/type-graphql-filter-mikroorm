const paginationTypeStorage : Map<Function, Object> = new Map();

export function getPaginationTypeStorage() : Map<Function, Object>
{
    return paginationTypeStorage;
}
