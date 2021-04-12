import { Field, InputType } from 'type-graphql';
import { getMetadataStorage as getTypeGraphQLMetadataStorage } from 'type-graphql/dist/metadata/getMetadataStorage';
import { getMetadataStorage } from '../metadata/getMetadataStorage';
import { ARRAY_RETURN_TYPE_OPERATORS, LOGICAL_RETURN_TYPE_OPERATORS, ReturnTypeFunc } from '../types';

import { getFilterTypeStorage } from '../types/getFilterTypeStorage';


/**
 * Generate a type-graphql InputType from a @ObjectType decorated
 * class by calling the @InputType and @Field decorators
 *
 * This should be used to generate the type of the @Arg
 * decorator on the corresponding resolver.
 */
export function generateFilterType(
    type : Function
) : ReturnTypeFunc
{
    // get cached result
    const filterTypeStorage = getFilterTypeStorage();
    if (filterTypeStorage.has(type)) {
        return () => filterTypeStorage.get(type) as ReturnType<any>;
    }

    // get storage
    const metadataStorage = getMetadataStorage();

    const typeGraphQLMetadata = getTypeGraphQLMetadataStorage();

    // get target model
    const objectTypesList = typeGraphQLMetadata.objectTypes;
    const graphQLModel = objectTypesList.find((ot) => ot.target === type);

    if (!graphQLModel) {
        throw new Error(`Please decorate your class "${ type }" with @ObjectType if you want to filter it`,);
    }

    // Create a new empty class with the "<graphQLModel.name>_Condition" name
    const conditionTypeName = graphQLModel.name + '_Condition';
    const typeContainer = {
        [conditionTypeName]: class {},
    };

    // Call the @InputType decorator on that class
    InputType(conditionTypeName)(typeContainer[conditionTypeName]);

    // Simulate creation of fields for this class/InputType by calling @Field()
    const filtersData = metadataStorage.filters.filter((f) => f.target === type);
    for (const { field, operators, getReturnType } of filtersData) {
        // When dealing with methods decorated with @Field, we need to lookup the GraphQL
        // name and use that for our filter name instead of the plain method name
        const graphQLField = typeGraphQLMetadata.fieldResolvers.find(fr => fr.target === type && fr.methodName === field);
        const fieldName = graphQLField ? graphQLField.schemaName : field;

        // Field operators wrapper @InputType
        const fieldConditionTypeName = graphQLModel.name + '_' + fieldName.toString() + '_Condition';
        typeContainer[fieldConditionTypeName] = class {};

        InputType(fieldConditionTypeName)(typeContainer[fieldConditionTypeName]);

        // Assign operator wrapper to field
        Field(() => typeContainer[fieldConditionTypeName], { nullable: true })(
            typeContainer[conditionTypeName].prototype,
            field,
        );

        for (const operator of operators) {
            const baseReturnType = LOGICAL_RETURN_TYPE_OPERATORS.includes(operator as any)
                ? typeContainer[fieldConditionTypeName]
                : typeof getReturnType === 'function'
                    ? getReturnType()
                    : String;

            const returnTypeFunction = ARRAY_RETURN_TYPE_OPERATORS.includes(operator)
                ? () => [ baseReturnType ]
                : () => baseReturnType;

            Field(returnTypeFunction, { nullable: true })(
                typeContainer[fieldConditionTypeName].prototype,
                operator,
            );
        }
    }

    // Simulate creation of fields for this class/InputType by calling @Field()
    const filtersChildsData = metadataStorage.filtersChilds.filter((f) => f.target === type);
    for (const { field, getReturnType } of filtersChildsData) {
        Field(getReturnType, { nullable: true })(
            typeContainer[conditionTypeName].prototype,
            field,
        );
    }

    // Add logical operators
    for (const operator of LOGICAL_RETURN_TYPE_OPERATORS) {
        const returnTypeFunction = ARRAY_RETURN_TYPE_OPERATORS.includes(operator)
            ? () => [ typeContainer[conditionTypeName] ]
            : () => typeContainer[conditionTypeName];

        Field(returnTypeFunction, { nullable: true })(
            typeContainer[conditionTypeName].prototype,
            operator,
        );
    }

    filterTypeStorage.set(type, typeContainer[conditionTypeName]);

    // define final object type
    const filterTypeName : string = conditionTypeName.replace(/_Condition$/, '_Filter');
    typeContainer[filterTypeName] = class extends typeContainer[conditionTypeName] {};
    InputType(filterTypeName)(typeContainer[filterTypeName]);

    return () => typeContainer[filterTypeName] as ReturnType<any>;
};
