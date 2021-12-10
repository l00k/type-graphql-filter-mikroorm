import 'reflect-metadata';
import { getMetadataStorage } from '../metadata';
import {
    BOOLEAN_DEFAULT_FILTERS, DATE_DEFAULT_FILTERS, DEFAULT_FILTERS,
    FilterOperator,
    NUMBER_DEFAULT_FILTERS,
    ReturnTypeFunc,
    STRING_DEFAULT_FILTERS
} from '../types';
import * as GraphQL from 'type-graphql';


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
        
        const Type = Reflect.getMetadata('design:type', Target, propertyName);
        
        if (!operators) {
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
                operators = DEFAULT_FILTERS;
            }
        }
        else {
            operators = typeof operators === 'string'
                ? [ operators ]
                : operators;
        }
        
        if (!returnTypeFunction) {
            if (Type === Number) {
                returnTypeFunction = () => GraphQL.Float;
            }
            else if (Type === Date) {
                returnTypeFunction = () => GraphQL.GraphQLISODateTime;
            }
        }
        
        metadataStorage.filters.push({
            field: propertyName,
            operators,
            getReturnType: returnTypeFunction,
            target: Target.constructor,
        });
    };
}
