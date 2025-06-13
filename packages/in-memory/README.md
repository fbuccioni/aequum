aequum in-memory stuff
======================

This package was designed to provide repositories, services and future stuff to work with in-memory data storage,

Components
-----------

### Repositories:
- [`InMemoryRepository`](https://github.com/fbuccioni/aequum/blob/main/packages/in-memory/repositories/in-memory.repository.ts): A base repository for in-memory data storage, providing basic CRUDL operations.

### Services:
- [`InMemoryCRUDLService`](https://github.com/fbuccioni/aequum/blob/main/packages/in-memory/services/base-crudl-in-memory.service.ts)
: A base service for in-memory data storage, providing basic CRUDL operations. (*)
- [`BaseCRUDLInMemoryPaginatedService`](https://github.com/fbuccioni/aequum/blob/main/packages/in-memory/services/base-crudl-in-memory-paginated.service.ts): Extends from `InMemoryCRUDLService` to provide pagination support. (*)

(*): See [`@aequum/crudl`](https://www.npmjs.com/package/@aequum/crudl) for more information about CRUDL services.
