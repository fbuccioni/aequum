import { data as dataUtil } from '@aequum/utils';

import { BaseException } from '../base/base.exception';
import { ValidationException } from '../validation/validation.exception';
import { ValidationableException } from '../interfaces/validationable-exception.interface';


export class DuplicateEntryException extends BaseException implements ValidationableException {
    static code = 'ERR_DUPLICATE_ENTRY';
    static HTTPStatusCode = 409;

    /**
     * When data fail to be written due a duplicate entry
     *
     * @param message - The error message, if empty uses `Duplicate entry`
     * @param input - The input data
     * @param uniqueProperties - An array of duplicated properties names
     * @param cause - The original error
     */
    constructor(
        message?: string,
        public input?: any,
        public uniqueProperties?: string[],
        cause?: Error
    ) {
        super(message || 'Duplicate entry', { cause }, cause?.stack);
    }

    asValidationException() {
        let errors;

        if (Array.isArray(this.uniqueProperties) && this.uniqueProperties.length)
            errors = this.uniqueProperties.reduce(
                (acc, prop) => ({
                    ...acc,
                    ...dataUtil.updateObjectByDotNotation(prop, acc, [[ this.code, this.message ]]),
                }), {}
            );
        else
            errors = { '$input': [ this.code, this.message ] };

        return new ValidationException(errors);
    }
}
