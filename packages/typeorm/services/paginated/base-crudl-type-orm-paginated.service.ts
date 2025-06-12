import {
    PaginateResultPaginator,
    PaginateSortBy,
    sortStringToPaginateSortBy
} from '@aequum/paginate-common';
import { IPaginationOptions } from 'typeorm-paginate';

import { TypeORMPaginatedRepository } from '../../repositories/paginated';
import { BaseCRUDLTypeORMService } from '..';



/**
 * Base CRUD/CRUDL TypeORM Service for a TypeORM entity model, with
 * paginated list output, by default assumes that the primary key
 * field as `id`
 *
 * @typeParam EntityModel TypeORM entity model
 * @typeParam EntityModelDto DTO of the TypeORM entity model
 * @typeParam EntityModelCreateDto DTO to create a new TypeORM entity model
 * @typeParam EntityModelUpdateDto DTO to update a TypeORM entity model
 * @typeParam PaginatedEntityModelDto Paginated DTO of the TypeORM entity model
 * @typeParam CustomFilterType Custom filter type to filter the query
 * @typeParam PrimaryKeyField Primary key field of the TypeORM Schema
 * Model by default is `id` (Virtual ID)
 */
export class BaseCRUDLTypeORMPaginatedService<
    EntityModel extends { [key in PrimaryKeyField]: any },
    EntityModelDto,
    EntityModelCreateDto,
    EntityModelUpdateDto,
    PaginatedEntityModelDto,
    QueryFilter = any,
    PrimaryKeyField extends string = 'id'
> extends BaseCRUDLTypeORMService<
    EntityModel,
    EntityModelDto,
    EntityModelCreateDto,
    EntityModelUpdateDto,
    QueryFilter,
    PrimaryKeyField
> {
    /** @inheritDoc */
    declare protected readonly repository: TypeORMPaginatedRepository<EntityModel>

    /**
     * List all data entries paginated
     *
     * @param filter - Filter to apply to the query
     * @param page - Page number
     * @param size - Page size
     * @param sort - Sort options
     * @param options - `typeorm-paginate` options
     * @returns Paginated result
     *
     * @see [IPaginationOptions on GitHub](https://github.com/nestjsx/nestjs-typeorm-paginate/blob/master/src/interfaces/index.ts#L6-L12)
     */
    async paginatedList<Paginator = PaginateResultPaginator>(
        filter: QueryFilter,
        page: number,
        size: number,
        sort?: string | PaginateSortBy,
        options?: IPaginationOptions<Paginator>
    ): Promise<PaginatedEntityModelDto> {
        if (typeof sort === 'string')
            sort = sortStringToPaginateSortBy(sort);

        return this.repository.paginatedFindBy(
            this.queryFilterToTypeORMFilter(filter),
            page,
            size,
            sort,
            options
        ) as unknown as Promise<PaginatedEntityModelDto>;
    }
}
