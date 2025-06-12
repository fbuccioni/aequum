import { PaginateResultPaginator } from "@aequum/paginate-common";
import { IPaginationMeta, IPaginationOptions } from "typeorm-paginate";


/**
 * Default options for TypeORM paginator, notice we only change the
 * `metaTransformer` to match the `PaginateResultPaginator`, also an
 * useless `limit` and `page` are set to 0, this is because are mandatory
 *
 */
export const DefaultTypeORMPaginatorOptions: IPaginationOptions<PaginateResultPaginator> = {
    metaTransformer: (meta: IPaginationMeta): PaginateResultPaginator => ({
        page: 0,
        size: meta.itemsPerPage || 0,
        pages: meta.totalPages || 0,
        next: null,
        prev: null,
        total: meta.totalItems || 0,
    }),
    limit: 0,
    page: 0,
};