import { DuplicateEntryException } from '@aequum/exceptions/data';


type PossiblyMongoServerError = Error & { code: number }

/**
 * Check whether if the error is a duplicate entry error from
 * MongoDB.
 *
 * @param err - Error to check
 * @returns
 */
export function isDuplicateError(err: PossiblyMongoServerError) {
    return (
        err.name === 'MongoServerError' && err.code === 11000
        && err.message.match(/(duplicate|unique (key|constraint)|primary key|E11000)/i)
    )
}

/**
 * Check if the error is a duplicate entry error, if it
 * is, returns a `new DuplicateEntryException` with
 * passed arguments, otherwise returns the orignal error.
 *
 * @param err Error to check
 * @param message Message to be used in the exception
 * @param data Data to be shown in the exception
 * @param duplicatedProperties Duplicated properties
 * to be shown in the exeption
 *
 * @returns DuplicateEntryException|Error
 */
export function duplicateEntryExceptionOrError<ErrorInstance extends Error>(
    err: ErrorInstance, message?: any,
    data?: any, duplicatedProperties?: string[]
): ErrorInstance | DuplicateEntryException {
    if (isDuplicateError(err as unknown as PossiblyMongoServerError))
        return new DuplicateEntryException(
            message,
            data,
            duplicatedProperties,
            err
        );

    return err;
}
