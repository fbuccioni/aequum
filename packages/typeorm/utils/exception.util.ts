import { TypeORMError } from "typeorm";
import { DuplicateEntryException } from '@aequum/exceptions/data';


/**
 * Check if the error is a TypeORMError and if it is a duplicate error
*/
export function isDuplicateError(err: any) {
    return (
        err instanceof TypeORMError
        && err.message.match(/(duplicate|unique (key|constraint)|primary key|E11000)/i)
    )
}

/**
 * Check if the error is a duplicate entry error, if it is,
 * returns a `new DuplicateEntryException` with passed
 * arguments, otherwise returns the orignal error.
 */
export function duplicateEntryExceptionOrError<T extends Error>(
    err: T, message?: any,
    data?: any, duplicatedProperties?: string[]
): T | DuplicateEntryException {
    if (isDuplicateError(err))
        return new DuplicateEntryException(
            message,
            data,
            duplicatedProperties,
            err
        );

    return err;
}