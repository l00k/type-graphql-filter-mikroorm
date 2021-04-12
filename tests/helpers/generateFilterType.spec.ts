import expect from 'expect';

import { IntrospectionInputObjectType, graphql, getIntrospectionQuery, IntrospectionSchema, TypeKind } from 'graphql';
import { Field, Resolver, Query, buildSchema, ObjectType, Int, Arg } from 'type-graphql';
import { Filter, FilterChilds } from '../../lib/decorators';
import { generateFilterType } from '../../lib/helpers';


describe('generateFilterType', () => {
    let schemaIntrospection : IntrospectionSchema;

    before(async() => {
        @ObjectType('SubObjectName')
        class FilterableSubObjectType
        {
            @Field(type => Int)
            @Filter([ 'lt', 'gt' ], type => Int)
            amount : number;
        }


        @ObjectType('SomeName')
        class FilterableType
        {
            @Field(type => Int)
            @Filter([ 'lt', 'gt' ], type => Int)
            amount : number;

            @Field(type => FilterableSubObjectType)
            @FilterChilds()
            child : FilterableSubObjectType;

            @Field(type => String, { name: 'purpose' })
            @Filter([ 'eq', 'like' ])
            getPurpose() : string
            {
                return 'some purpose';
            }
        }


        @Resolver()
        class SampleResolver
        {
            @Query(() => FilterableType)
            filterableQuery(
                @Arg('filter', generateFilterType(FilterableType), { nullable: true })
                    filter : any
            ) : FilterableType
            {
                return new FilterableType();
            }
        }


        const schema = await buildSchema({
            resolvers: [ SampleResolver ]
        });
        const result = await graphql(schema, getIntrospectionQuery());
        schemaIntrospection = (result as any).data.__schema as IntrospectionSchema;
    });

    const assertFilterFields = (objectName : string, objectType : string) => {
        const amountConditionType = schemaIntrospection.types
            .find(type => type.name === `${ objectName }_amount_${ objectType }`) as IntrospectionInputObjectType;
        expect(amountConditionType.name).toEqual(`${ objectName }_amount_${ objectType }`);
        expect(amountConditionType.kind).toEqual(TypeKind.INPUT_OBJECT);

        const amountLtType = amountConditionType.inputFields.find(field => field.name === 'lt')?.type as IntrospectionInputObjectType;
        expect(amountLtType.name).toEqual('Int');
        expect(amountLtType.kind).toEqual(TypeKind.SCALAR);

        const amountGtType = amountConditionType.inputFields.find(field => field.name === 'gt')?.type as IntrospectionInputObjectType;
        expect(amountGtType.name).toEqual('Int');
        expect(amountGtType.kind).toEqual(TypeKind.SCALAR);

        const purposeConditionType = schemaIntrospection.types
            .find(type => type.name === `${ objectName }_purpose_${ objectType }`) as IntrospectionInputObjectType;
        expect(purposeConditionType.name).toEqual(`${ objectName }_purpose_${ objectType }`);
        expect(purposeConditionType.kind).toEqual(TypeKind.INPUT_OBJECT);

        const purposeLikeType = purposeConditionType.inputFields.find(field => field.name === 'like')?.type as IntrospectionInputObjectType;
        expect(purposeLikeType.name).toEqual('String');
        expect(purposeLikeType.kind).toEqual(TypeKind.SCALAR);

        const purposeEqType = purposeConditionType.inputFields.find(field => field.name === 'eq')?.type as IntrospectionInputObjectType;
        expect(purposeEqType.name).toEqual('String');
        expect(purposeEqType.kind).toEqual(TypeKind.SCALAR);
    };

    it('should generate a proper condition type', () => {
        const conditionType = schemaIntrospection.types.find(type => type.name === 'SomeName_Condition') as IntrospectionInputObjectType;
        expect(conditionType.inputFields.length).toEqual(6);

        assertFilterFields('SomeName', 'Condition');
    });

    it('should generate a proper filter type', () => {
        const filterType = schemaIntrospection.types.find(type => type.name === 'SomeName_Filter') as IntrospectionInputObjectType;

        expect(filterType.inputFields.length).toEqual(6);
    });
});
