import * as GraphQL from 'type-graphql';
import * as ClassValidator from 'class-validator';
import { getMetadataStorage as getTypeGraphQLMetadataStorage } from 'type-graphql/dist/metadata/getMetadataStorage';
import { getPaginationTypeStorage } from '../types';


/**
 * Generate a type-graphql InputType from a @ObjectType decorated
 * class by calling the @InputType and @Field decorators
 *
 * This should be used to generate the type of the @Arg
 * decorator on the corresponding resolver.
 *
 * @param type
 */
export const generatePaginationType = (
    type : Function,
    itemsPerPageOptions : number[]
) => {
    // get cached result
    const paginationTypeStorage = getPaginationTypeStorage();
    if (paginationTypeStorage.has(type)) {
        return () => paginationTypeStorage.get(type) as ReturnType<any>;
    }

    // get storage
    const typeGraphQLMetadata = getTypeGraphQLMetadataStorage();

    // get target model
    const objectTypesList = typeGraphQLMetadata.objectTypes;
    const graphQLModel = objectTypesList.find((ot) => ot.target === type);

    if (!graphQLModel) {
        throw new Error(`Please decorate your class "${ type }" with @ObjectType if you want to filter it`);
    }

    // Create a new empty class with the "<graphQLModel.name>Pagination" name
    const paginationTypeName = graphQLModel.name + 'Pagination';
    const typeContainer = {
        [paginationTypeName]: class {},
    };

    // Call the @InputType decorator on that class
    GraphQL.InputType(paginationTypeName)(typeContainer[paginationTypeName]);

    // Simulate creation of fields for this class/InputType by calling @Field()
    const prototype = typeContainer[paginationTypeName].prototype;

    GraphQL.Field(() => Number)(prototype, 'page');
    ClassValidator.Min(1)(prototype, 'page');

    GraphQL.Field(() => Number)(prototype, 'itemsPerPage');
    ClassValidator.IsIn(itemsPerPageOptions)(prototype, 'itemsPerPage');

    paginationTypeStorage.set(type, typeContainer[paginationTypeName]);

    return () => typeContainer[paginationTypeName] as ReturnType<any>;
};
