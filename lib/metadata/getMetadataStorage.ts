import { MetadataStorage } from '../types';


const metadataStorage : MetadataStorage = {
    filters: [],
    filtersChilds: [],
};

export function getMetadataStorage() : MetadataStorage
{
    return metadataStorage;
}
