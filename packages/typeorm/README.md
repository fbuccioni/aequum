aequum TypeORM tools 
=====================

A collection of tools which includes: 

- Extensible repositories, one with pagination support
- Pagination via [`typeorm-paginate`](https://www.npmjs.com/package/typeorm-paginate)
- CRUD/CRUDL services via [`@aequum/crudl`](https://www.npmjs.com/package/@aequum/crudl)
- Duplicate exception handling via [`@aequum/exceptions`](https://www.npmjs.com/package/@aequum/exceptions)


Components
----------

### Repositories

**NOTE: For use in NestJS** applications see the [Repositories on NestJS applications](#repositories-on-nestjs-applications) section.

- [`TypeORMRepository`](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/repositories/typeorm.repository.ts): For now just extends the built-in repository from TypeORM, but anyway is recommended to use it for future extensions.
- [`TypeORMPaginatedRepository`](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/repositories/paginated/typeorm-paginated.repository.ts): Extends from `TypeORMRepository` to provide pagination with `paginatedFindBy` and `paginateQueryBuilder` methods.


### Services:

- [`BaseCRUDLTypeORMService`](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/services/base-crudl-typeorm.service.ts): Base CRUDL service implementation for TypeORM (*).
- [`BaseCRUDLTypeORMPaginatedService`](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/services/paginated/base-crudl-typeorm-paginated.service.ts): Extends from `BaseCRUDLTypeORMService` to provide pagination support (*).


### Utils:

- [`duplicateEntryExceptionOrError`](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/utils/exception.util.ts): Check if the provided error is a duplicate entry error and return a `DuplicateEntryException` (**) or returns the original error.
- [`isDuplicateError`](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/utils/exception.util.ts): Check if the provided error is a TypeORM duplicate entry error.
- [`URIToDataSourceOptions`](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/utils/typeorm.util.ts): Converts an URI, `{engine}://{host}:{port}/{database}/{schema)?option=value&option2=value` string to `DataSourceOptions` object.


(*) See [`@aequum/crudl`](https://www.npmjs.com/package/@aequum/crudl) for more information about CRUDL services.
(**): See [`@aequum/exceptions`](https://www.npmjs.com/package/@aequum/exceptions) for more information about exceptions.


Indications
------------


### Repositories on NestJS applications

Repositories must be used in a different way in NestJS applications.

For the repository you must use `InjectDataSource()` decorator to inject the TypeORM `DataSource` instance.

```typescript
@Injectable()
export class UserRepository extends TypeORMPaginatedRepository<User> {
    constructor(@InjectDataSource() dataSource: DataSource) {
        super(User, dataSource)
    }
}
```

And in the module you must provide the repository as a provider:

```typescript
@Module({
    imports: [ TypeOrmModule.forFeature([ User,  UserRefreshToken ]) ],
    providers: [ UsersService, UserRepository ],
    controllers: [ UsersController ],
    exports: [ UsersService ],
})
export class UsersModule {}
```
