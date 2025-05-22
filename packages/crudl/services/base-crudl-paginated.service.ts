import { PaginateSortBy }from '@aequum/paginate-common';

import { BaseCRUDLService }from './base-crudl.service';


export abstract class BaseCRUDLPaginatedService extends BaseCRUDLService {
    /**
     * Get a paginated list of items
     *
     * @param filter Filter to apply
     * @param page Page number
     * @param size Page size
     * @param sort Sort by
     * @param args Rest of args for different implementations
     */
    abstract paginatedList(
        filter: any,
        page: number,
        size: number,
        sort: PaginateSortBy | string,
        ...args: any[]
    ): any;
}
