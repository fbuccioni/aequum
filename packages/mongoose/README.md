aequum Mongoose tools 
=====================

A collection of tools which includes: 

- Repositories
- Pagination via [`mongoose-paginate-v2`](https://www.npmjs.com/package/mongoose-paginate-v2)
- CRUD/CRUDL services via [`@aequum/crudl`](https://www.npmjs.com/package/@aequum/crudl)
- Schemas with virtual ID `id` field instead `_id`
- Duplicate exception handling via [`@aequum/exceptions`](https://www.npmjs.com/package/@aequum/exceptions)


Components
----------

### Repositories

- [`MongooseRepository`](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/repositories/mongoose.repository.ts): Repository base class for Mongoose, providing basic CRUDL operations.
- [`MongoosePaginatedRepository`](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/repositories/paginated/mongoose-paginated.repository.ts) Extends from `MongooseRepository` to provide pagination support.


### Services:

- [`BaseCRUDLMongooseService`](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/services/base-crudl-mongoose.service.ts): Base CRUDL service implementation for Mongoose (*).
- [`BaseCRUDLMongoosePaginatedService`](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/services/paginated/base-crudl-mongoose-paginated.service.ts): Extends from `BaseCRUDLMongooseService` to provide pagination support (*).


### Utils:

- [`duplicateEntryExceptionOrError`](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/utils/exception.util.ts): Check if the provided error is a duplicate entry error and return a `DuplicateEntryException` (**) or returns the original error.
- [`isDuplicateError`](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/utils/exception.util.ts): Check if the provided error is a Mongoose duplicate entry error.
- [`schemaTransformsForVirtualID`](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/utils/schema.util.ts): Apply transforms to input and ouput the virtual `id`
from MongoDB `_id` field.
- [`SchemaWithVirtualID`](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/utils/schema.util.ts): A Class that extends Mongoose `Schema` to include a virtual `id` field instead of normal `_id` field.


(*) See [`@aequum/crudl`](https://www.npmjs.com/package/@aequum/crudl) for more information about CRUDL services.
(**): See [`@aequum/exceptions`](https://www.npmjs.com/package/@aequum/exceptions) for more information about exceptions.