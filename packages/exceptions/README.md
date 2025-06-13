aequum common exceptions collection
===================================

This package provides a set of rich, descriptive and detailed
exceptions interfaces, classes and types to have an standard 
way to handle show errors and providing the right information 
to the user or developer when an error occurs in the application.

Design
------

Each exception class must have:

- A text `code` for error, we use `ERR_` prefix and uppercase letters.
- An **HTTP status code** for the error is available but isn't mandatory
by default it uses a 500 error code.
- A human readable `message` that describes the error.
- At least an `input` field to provide the input that caused the 
error, on some complex cases it have an structured object with more 
details, as in case of `ValidationException`.
- Also one of the base constructor arguments are the `cause` of the error
if it derives from another exception, this is useful to  trace the error 
back to its origin.


Classes
-------

#### Base:
- [`BaseException`](https://github.com/fbuccioni/aequum/blob/main/packages/exceptions/base/base.exception.ts): The base class for all exceptions.
#### Authorization:
- [`Unauthorized`](https://github.com/fbuccioni/aequum/blob/main/packages/exceptions/auth/unauthorized.exception.ts): Exception for unauthorized access.
#### Data:
- [`DuplicateEntryException'](https://github.com/fbuccioni/aequum/blob/main/packages/exceptions/auth/unauthorized.exception.ts): Exception for duplicate entries.
- [`NotFoundException`](https://github.com/fbuccioni/aequum/blob/main/packages/exceptions/auth/not-found.exception.ts): Exception for not found resources.
#### Validation:
- [`ValidationException`](https://github.com/fbuccioni/aequum/blob/main/packages/exceptions/validation/validation.exception.ts: Validation exception, for input objects, this exception have an strucured output for `input` property, representing the input property validated and it's corresponding error messages.

Interfaces
----------

- [`ValidationableException`](https://github.com/fbuccioni/aequum/blob/main/packages/exceptions/interfaces/validationable-exception.interface.ts): Interface with `asValidationException` method to convert an error/exception/validation object into a validation exception.




