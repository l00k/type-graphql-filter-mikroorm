import { generateFilterType } from '../helpers';
import { getMetadataStorage } from '../metadata';


export function FilterChilds() : PropertyDecorator
{
    return (prototype, field : string | symbol) => {
        const metadataStorage = getMetadataStorage();

        const type = Reflect.getMetadata('design:type', prototype, field);

        metadataStorage.filtersChilds.push({
            target: prototype.constructor,
            field,
            getReturnType: generateFilterType(type)
        });
    };
}
