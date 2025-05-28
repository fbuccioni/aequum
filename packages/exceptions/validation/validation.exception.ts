import { data as dataUtil } from '@aequum/utils';

import { BaseException } from '../base/base.exception';


/**
 * Structure with the code of the error,
 * the original message and the constraints
 * which causes the error, this is useful
 * to find the error and to display in the UI.
 */
export type ValidationExceptionErrorDetail = [
    code: string,
    message: string,
    constraints?: any[],
];

export type ValidationExceptionErrorDetails = ValidationExceptionErrorDetail[];

/**
 * Structure indicating where in the object
 * is the error, the property name should be
 * the same input object property with the
 * error or a representation to find the error
 * according to the input object/data.
 */
export type ValidationExceptionErrorObject = {
    [key: string]: ValidationExceptionError
}

export type ValidationExceptionError = (
    ValidationExceptionErrorDetails
    | ValidationExceptionErrorObject
)


/**
 * An exception which have detailed information
 * about a validated input error, designed to
 * easily go to the error cause.
 */
export class ValidationException extends BaseException {
    static code = 'ERR_VALIDATION_ERROR';
    static HTTPStatusCode = 400;

    constructor(public errors: ValidationExceptionError) {
        super('The input object have validation errors');
        if (!errors)  this.errors = {};
    }

    append(errors: ValidationException): void;
    append(errors: ValidationExceptionError): void;
    append(errors: any): void {
        if (errors instanceof ValidationException)
            errors = errors.errors;

        this.errors = dataUtil.mergeDeep(this.errors, errors);
    }
}
