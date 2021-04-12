export class Pagination
{

    public page : number = 1;

    public itemsPerPage : number = 25;

    public constructor(defaultItemsPerPage = 25)
    {
        this.itemsPerPage = defaultItemsPerPage;
    }

}
