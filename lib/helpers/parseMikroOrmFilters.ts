export function parseMikroOrmFilters(source : any) {
    const parsed : any = {};
    const keywords = [ 'and', 'or', 'not', 'eq' ];
    for (const key in source) {
        const tKey = keywords.includes(key)
            ? '$' + key
            : key;

        if (source[key] instanceof Array) {
            parsed[tKey] = [];
            for (const idx in source[key]) {
                if (source[key][idx] instanceof Object) {
                    parsed[tKey][idx] = parseMikroOrmFilters(source[key][idx]);
                }
                else {
                    parsed[tKey][idx] = source[key][idx];
                }
            }
        }
        else if (source[key] instanceof Object) {
            parsed[tKey] = parseMikroOrmFilters(source[key]);
        }
        else {
            parsed[tKey] = source[key];
        }
    }
    return parsed;
}
