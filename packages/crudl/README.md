aequum CRUD/CRUDL operations common components
==============================================

A set of abstract class for application services having hexagonal 
architecture in mind to facilitate CRUD/CRUDL operations (**C**reate, **R**ead, **U**pdate, **D**elete, **L**ist).


Components
----------

## Services

- [`BaseCRUDLService`](https://github.com/fbuccioni/aequum/blob/main/packages/crudl/services/base-crudl.service.ts):
Abstract class/interface for CRUDL methods, return types and some more.
- [`BaseCRUDLPaginatedService`](https://github.com/fbuccioni/aequum/blob/main/packages/crudl/services/base-crudl-paginated.service.ts):
Abstract class/interface extended from `BaseCRUDLService` with a pagination method and return types.


Current implementations in the `@aequum` packages
-------------------------------------------------

2. [Mongoose abstract implementation of CRUDL with pagination service via `@aequum/mongoose` on GitHub](https://github.com/fbuccioni/aequum/blob/main/packages/mongoose/services/paginated/base-crudl-mongoose-paginated.service.ts)
3. [TypeORM abstract implementation of CRUDL service  via `@aequum/typeorm`on GitHub](https://github.com/fbuccioni/aequum/blob/main/packages/typeorm/services/base-crudl-typeorm.service.ts)
4. [Users NestJS Implementation in aequum boilerplate on GitHub](https://github.com/fbuccioni/aequum-nestjs-hexa/blob/base%2Bauth%2Bmongoose/src/application/services/users.service.ts)


Example
--------

Example for a simple CRUDL service:

```typescript
import { BaseCRUDLService } from '@aequum/crudl';

import { UserRepository } from 'src/infrastructure/database/repositories/user.repository';

class UserService extends BaseCRUDLService<User> {
  constructor(
    protected repository: UserRepository,
  ) { }
}

const usersService = new UserService(
  new UserRepository(),
);


await usersService.create({
    name: 'John Doe',
    email: 'john@doe.nothing',
    password: 'password',
});

await userService.list();

```