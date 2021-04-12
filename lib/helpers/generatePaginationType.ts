import { getFilterTypeStorage } from '../types/getFilterTypeStorage';


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
    const filterTypeStorage = getFilterTypeStorage();
    if (filterTypeStorage.has(type)) {
        return () => filterTypeStorage.get(type);
    }
};
