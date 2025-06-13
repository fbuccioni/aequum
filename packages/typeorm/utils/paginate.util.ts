import { PaginateResult, PaginateResultPaginator } from "@aequum/paginate-common";
import {
    Repository,
    SelectQueryBuilder,
    ObjectLiteral,
    FindOptionsWhere,
    FindManyOptions
} from "typeorm";
import {
    IPaginationOptions,
    paginate as typeormPaginate
} from "typeorm-paginate";

import {
    DefaultTypeORMPaginatorOptions
} from "../options/default-type-orm-paginator.options";


export async function paginate<
    EntityModel extends ObjectLiteral,
    Paginator = PaginateResultPaginator
>(
    repository: Repository<EntityModel>,
    page: number,
    size: number,
    options: IPaginationOptions<Paginator>,
    searchOptions?: FindOptionsWhere<EntityModel> | FindManyOptions<EntityModel>
): Promise<PaginateResult<EntityModel, Paginator>>;

export async function paginate<
    EntityModel extends ObjectLiteral,
    QueryResultModel extends ObjectLiteral = EntityModel,
    Paginator = PaginateResultPaginator
>(
    queryBuilder: SelectQueryBuilder<EntityModel>,
    page: number,
    size: number,
    options: IPaginationOptions<Paginator>
): Promise<PaginateResult<QueryResultModel, Paginator>>;

export async function paginate<
    EntityModel extends ObjectLiteral,
    Paginator = PaginateResultPaginator
>(
    repositoryOrQueryBuilder: Repository<EntityModel> | SelectQueryBuilder<EntityModel>,
    page: number,
    size: number,
    options: IPaginationOptions<Paginator>,
    searchOptions?: FindOptionsWhere<EntityModel> | FindManyOptions<EntityModel>,
) {
    if (page < 1) page = 1;
    if (size < 1) size = 10;

    options = Object.assign(
        {},
        DefaultTypeORMPaginatorOptions,
        options || {},
        {
            page,
            limit: size
        }
    ) as IPaginationOptions<Paginator>;

    const data = await typeormPaginate<EntityModel, Paginator>(
        repositoryOrQueryBuilder as any,
        options,
        searchOptions
    ) as any;

    if (options.route)
        data.links = data.route;

    data.paginator = data.meta;
    data.data = data.items;
    data.paginator.page = options.page;

    delete data.route;
    delete data.meta;
    delete data.items;

    return data as PaginateResult<EntityModel, Paginator>;
}