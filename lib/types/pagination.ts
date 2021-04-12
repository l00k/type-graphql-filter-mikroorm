import * as GraphQL from 'type-graphql';
import * as Validate from 'class-validator';

@GraphQL.InputType()
export class Pagination
{

    @GraphQL.Field(type => GraphQL.Int)
    @Validate.Min(1)
    public page : number = 1;

    @GraphQL.Field(type => GraphQL.Int)
    @Validate.IsIn([ 25, 50, 100 ])
    public itemsPerPage : number = 25;

}
