/**
 * Common paginated result interface for all the
 * paginated queries
 *
 * @typeParam Model - Model type to be paginated
 */
export interface PaginateResult<Model, Paginator = PaginateResultPaginator> {
    /** Paginated data requested */
    data: Model[];
    /** Paginator info */
    paginator: Paginator;
}

/**
 * Common paginated result paginator data
 * interface
 */
export interface PaginateResultPaginator {
    /** Current page */
    page: number;
    /** Per page Size */
    size: number;
    /** Total pages */
    pages: number;
    /** Next page */
    next: number | null;
    /** Prev page */
    prev: number | null;
    /** Total items */
    total: number;
}
