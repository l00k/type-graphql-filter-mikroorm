import 'reflect-metadata';
import { getMetadataStorage } from '../metadata';
import {
    BOOLEAN_DEFAULT_FILTERS, DATE_DEFAULT_FILTERS,
    FilterOperator,
    NUMBER_DEFAULT_FILTERS,
    ReturnTypeFunc,
    STRING_DEFAULT_FILTERS
} from '../types';


/**
 * This decorator will store filters information for the field in a metadata storage.
 * We will use this metadata later on to generate an InputType for the filters argument
 *
 * @param operators
 * @param returnTypeFunction
 */
export function Filter (
    operators? : FilterOperator | FilterOperator[],
    returnTypeFunction? : ReturnTypeFunc,
) : PropertyDecorator
{
    return (Target, propertyName : string | symbol) => {
        const metadataStorage = getMetadataStorage();
        
        if (typeof operators === 'undefined') {
            const Type = Reflect.getMetadata('design:type', Target, propertyName);
            
            if (Type === Boolean) {
                operators = BOOLEAN_DEFAULT_FILTERS;
            }
            else if (Type === Number) {
                operators = NUMBER_DEFAULT_FILTERS;
            }
            else if (Type === String) {
                operators = STRING_DEFAULT_FILTERS;
            }
            else if (Type === Date) {
                operators = DATE_DEFAULT_FILTERS;
            }
            else {
                operators = [];
            }
        }
        else {
            operators = typeof operators === 'string'
                ? [ operators ]
                : operators;
        }
        
        metadataStorage.filters.push({
            field: propertyName,
            operators,
            getReturnType: returnTypeFunction,
            target: Target.constructor,
        });
    };
}
