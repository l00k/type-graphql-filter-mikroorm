import expect from 'expect';
import { parseMikroOrmFilters } from '../../lib/helpers';


describe('parseMikroOrmFilters', () => {

    it('should successfully parse filters', () => {
        const parsed = parseMikroOrmFilters({
            id: {
                eq: 5,
                in: [ 1, 2 ]
            },
            name: { like: 'text' },
        });

        expect(parsed).toEqual({
            id: {
                '$eq': 5,
                '$in': [ 1, 2 ]
            },
            name: {
                '$like': 'text'
            }
        });
    });

    it('should successfully parse filters', () => {
        const parsed = parseMikroOrmFilters({
            and: [
                { level: { gte: 12 } },
                {
                    or: [
                        { level: { gte: 16 } },
                        { allowed: { eq: true } },
                    ]
                }
            ]
        });

        expect(parsed).toEqual({
            '$and': [
                { level: { '$gte': 12 } },
                {
                    '$or': [
                        { level: { '$gte': 16 } },
                        { allowed: { '$eq': true } }
                    ]
                }
            ]
        });
    });

    it('should successfully parse filters', () => {
        const parsed = parseMikroOrmFilters({
            not: {
                or: [
                    { level: { gte: 16 } },
                    { allowed: { eq: true } },
                ]
            }
        });

        expect(parsed).toEqual({
            '$not': {
                '$or': [
                    { level: { '$gte': 16 } },
                    { allowed: { '$eq': true } }
                ]
            }
        });
    });

});
