import { FILTER_OPERATORS } from '../types';


export function parseMikroOrmFilters(source : any)
{
    const parsed : any = {};
    for (const key in source) {
        if (!source.hasOwnProperty(key)) {
            continue;
        }

        const tKey = FILTER_OPERATORS.includes(key)
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
        else if (
            source[key] instanceof Object
            && source[key].constructor === Object
        ) {
            parsed[tKey] = parseMikroOrmFilters(source[key]);
        }
        else {
            parsed[tKey] = source[key];
        }
    }
    return parsed;
}
