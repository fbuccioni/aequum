import {
    DataSource,
    EntityTarget,
    FindManyOptions,
    FindOptionsWhere,
    ObjectLiteral,
    Repository,
    SelectQueryBuilder
} from 'typeorm';
import { IPaginationOptions } from 'typeorm-paginate';
import {
    PaginateResult,
    PaginateResultPaginator,
    PaginateSortBy
} from "@aequum/paginate-common";
import { data as dataUtil } from '@aequum/utils';

import { paginate } from '../../utils/paginate.utils';


/**
 * TypeORMRepository is a wrapper around TypeORM's Repository class
 * that allows for easier use of TypeORM with Aequum, also created
 * for future compatibility or extensibility.
 */
export abstract class TypeORMPaginatedRepository<EntityModel extends ObjectLiteral> extends Repository<EntityModel> {
    constructor(target: EntityTarget<EntityModel>, dataSource: DataSource) {
        super(target, dataSource.createEntityManager());
    }

    async paginatedFindBy<Paginator = PaginateResultPaginator>(
        where?: FindOptionsWhere<EntityModel>,
        page: number = 1,
        size: number = 10,
        sort?: PaginateSortBy,
        options?: IPaginationOptions<Paginator>,
        findOptions?: FindManyOptions<EntityModel>
    ): Promise<PaginateResult<EntityModel, Paginator>> {

        for( const key in sort) {
            if( sort[key] === 1)
                sort[key] = 'asc';
            else if( sort[key] === -1)
                sort[key] = 'desc';
        }

        return paginate<EntityModel, Paginator>(
            this,
            page,
            size,
            options || {} as any,
            dataUtil.mergeDeep(
                {},
                findOptions,
                {
                    where: where as FindOptionsWhere<EntityModel> | FindManyOptions<EntityModel>,
                    order: sort ? sort : undefined
                }
            )
        );
    }

    async paginateQueryBuilder<
        QueryResultModel extends ObjectLiteral = EntityModel,
        Paginator = PaginateResultPaginator
    >(
        queryBuilder: SelectQueryBuilder<EntityModel>,
        page: number = 1,
        size: number = 10,
        options: IPaginationOptions<Paginator> = {} as any
    ): Promise<PaginateResult<QueryResultModel, Paginator>> {
        return paginate<EntityModel, QueryResultModel, Paginator>(
            queryBuilder,
            page,
            size,
            options
        );
    }
}