import { getMetadataStorage } from '../metadata';
import { ReturnTypeFunc } from '../types';


export function FilterChilds(getReturnType : ReturnTypeFunc) : PropertyDecorator
{
    return (prototype, field : string | symbol) => {
        const metadataStorage = getMetadataStorage();

        console.log(prototype.constructor, field, getReturnType());

        metadataStorage.filtersChilds.push({
            target: prototype.constructor,
            field,
            getReturnType
        });
    };
}
