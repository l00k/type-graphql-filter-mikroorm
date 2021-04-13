# type-graphql-filter-mikroorm
Filter decorator for [type-graphql](https://typegraphql.com/) and [MikroORM](https://mikro-orm.io/).

Based on [type-graphql-filter](https://github.com/kontist/type-graphql-filter).

It will allow you to generate standardized filterable queries simply by decorating the fields that should be filterable with `@Filter`, and decorating the relevant query with an extra `@Arg` decorator.

The input types for your schema will be generated automatically based on the name of your type-graphql `ObjectType`.

It is useful if you have several type of filterable entities in your schema and you want to provide a unified interface to filter them without having to maintain and duplicate the logic and the InputTypes manually.

## Usage

Just add the `@Filter` decorator to the fields that should be filterable.

```typescript
import * as GraphQL from "type-graphql";
import * as GraphQLFilter from '@100k/type-graphql-filter-mikroorm';

@ObjectType("Category")
export class Category {

    @GraphQL.Field()
    @GraphQLFilter.Filter(['eq', 'ne', 'in', 'nin'])
    @ORM.PrimaryKey()
    id: number;

    @GraphQL.Field()
    @GraphQLFilter.Filter(['eq', 'ne', 'like'])
    title: string;
    
}

@ObjectType("Article")
export class Article {

    @GraphQL.Field()
    @GraphQLFilter.Filter(['eq', 'ne', 'like', 'in'])
    @ORM.PrimaryKey()
    id: number;

    @GraphQL.Field(type => CategoryModel)
    @GraphQLFilter.DeepFilter()
    @ORM.ManyToOne(() => CategoryModel, { eager: true })
    category: CategoryModel;
    
    @GraphQL.Field()
    @GraphQLFilter.Filter(['like'])
    title: string;

    @GraphQL.Field(type => GraphQLISODateTime)
    @GraphQLFilter.Filter(['gt', 'gte', 'lt', 'lte'], type => GraphQL.GraphQLISODateTime)
    dateField: Date;
    
}
```


Then add the filter as an argument to your resolver.
```typescript
import { GraphQLResolveInfo } from 'graphql';
import * as GraphQL from 'type-graphql';
import * as GraphQLFilter from '@100k/type-graphql-filter-mikroorm';
import * as ORM from '@mikro-orm/core';
import { ExampleModel } from './models';

@GraphQL.Resolver(of => Article)
export class ArticleResolver {
    @GraphQL.FieldResolver(type => [Article])
    articles(
        // add the filter here as parameter
        @GraphQL.Arg('filters', GraphQLFilter.generateFilterType(Article))
        filters: ORM.FilterQuery<Article>,
        
        // add the pagination here as parameter
        @GraphQL.Arg('pagination', GraphQLFilter.generatPaginationType(Article, [ 10, 25, 50 ]))
        pagination: GraphQLFilter.Pagination,
        
        @GraphQL.Ctx() { entityManager } : Context,
        @GraphQL.Info() info : GraphQLResolveInfo,
    ): Article[]
    {
        // process filters (map operators to $-prefiexed)
        filters = GraphQLFilter.parseMikroOrmFilters(filters);
        
        const offset = (pagination.page - 1) * pagination.itemsPerPage;
        
        return entityManager
            .getRepository(Article)
            .find(
                filters,
                [ 'subObject' ],
                { id: ORM.QueryOrder.ASC },
                pagination.itemsPerPage,
                offset
            );
    }
}
```

This will automatically generate the `InputType`:

```graphql
input ArticlePagination {
  page: Float!
  itemsPerPage: Float!
}

input ArticleFilter {
  rank: Holding_rank_Condition
  token: Holding_token_Condition
  balance: Holding_balance_Condition
  share: Holding_share_Condition
  account: AccountFilter
  and: [HoldingFilter!]
  or: [HoldingFilter!]
  not: HoldingFilter
}

input Holding_rank_Condition {
  eq: Int
  lt: Int
  lte: Int
  gt: Int
  gte: Int
}

input Holding_token_Condition {
  eq: Int
}

input Holding_balance_Condition {
  eq: Int
  lt: Int
  lte: Int
  gt: Int
  gte: Int
}

input Holding_share_Condition {
  eq: Float
  lt: Float
  lte: Float
  gt: Float
  gte: Float
}

input AccountFilter {
  address: Account_address_Condition
  and: [AccountFilter!]
  or: [AccountFilter!]
  not: AccountFilter
}
```
