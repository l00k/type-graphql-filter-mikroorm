import 'reflect-metadata';
import { getMetadataStorage } from '../metadata';
import { ReturnTypeFunc } from '../types';


export function DeepFilter(getReturnType : ReturnTypeFunc) : PropertyDecorator
{
    return (prototype, field : string | symbol) => {
        const metadataStorage = getMetadataStorage();

        metadataStorage.filtersChilds.push({
            target: prototype.constructor,
            field,
            getReturnType
        });
    };
}
