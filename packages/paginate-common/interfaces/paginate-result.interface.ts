/**
 * Common paginated result interface for all the
 * paginated queries
 *
 * @template Model - Model type to be paginated
 */
export interface PaginateResult<Model> {
    data: Model[];
    paginator: {
        page: number;
        size: number;
        pages: number;
        next: number | null;
        prev: number | null;
        total: number;
    }
}
