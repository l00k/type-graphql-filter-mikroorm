import { FILTER_OPERATORS, LOGICAL_OPERATORS } from '../types';


function isPlainObject(value : any)
{
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isSmartConditionContainer(source : any)
{
    return !Object.keys(source)
        .find(key => !FILTER_OPERATORS.includes(key));
}

export function parseMikroOrmFilters<T>(source : T, parsePlainValue : boolean = true): T
{
    if (source instanceof Array) {
        const parsed : any[] = [];
        Object.values(source)
            .forEach((value) => {
                parsed.push(parseMikroOrmFilters(value));
            });
        return <any> parsed;
    }
    else if (isPlainObject(source)) {
        if (isSmartConditionContainer(source)) {
            const parsed : any = {};
            Object.entries(source)
                .forEach(([ index, value ]) => {
                    const key = FILTER_OPERATORS.includes(index)
                        ? '$' + index
                        : index;
                    parsed[key] = parseMikroOrmFilters(
                        value,
                        LOGICAL_OPERATORS.includes(index)
                    );
                });
            return parsed;
        }
        else if (parsePlainValue) {
            const parsed : any = {};
            Object.entries(source)
                .forEach(([ index, value ]) => {
                    parsed[index] = parseMikroOrmFilters(value);
                });
            return parsed;
        }
    }

    return source;
}
