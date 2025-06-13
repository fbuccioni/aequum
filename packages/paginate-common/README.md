aequum pagination common components
===================================

A collection of common shared components for pagination
to be used in @aequum packages.

Components
----------

### Interfaces:

- [`PaginateResult<Model, Paginator = PaginateResultPaginator>`](https://github.com/fbuccioni/aequum/blob/main/packages/paginate-common/interfaces/paginate-result.interface.ts): Interface which represents the result of a pagination operation, includes the `data` and `paginator` properties.
- [`PaginateResultPaginator`](https://github.com/fbuccioni/aequum/blob/main/packages/paginate-common/interfaces/paginate-result.interface.ts): Interface which represents the paginator for a pagination operation, includes `page`, `size`, `pages`, `next`, `prev`, and `total` properties.


### Types:

- [`PaginateSortBy`](https://github.com/fbuccioni/aequum/blob/main/packages/paginate-common/types/paginate-sort-by.type.ts)
: Type for sort fields, based on MongoDB `sort()`, just an object with the field name as key and the sort direction as value this can be `"asc"` or `1` and `"desc"` or `-1`.

### Utils:
- [`sortStringToPaginateSortBy`](https://github.com/fbuccioni/aequum/blob/main/packages/paginate-common/utils/sort-string-to-paginate-sort-by.type.ts): Converts a sort string `"field1 -field2"` to a `PaginateSortBy` type like `{ field1: "asc", field2: "desc" }`.