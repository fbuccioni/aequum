/**
 * Exceptions with with code, HTTP code if needed,
 * flexible to use and serializable.
 */
export class BaseException extends Error {
    /** Exception code this will pass to the
     * instance */
    static code: string | null = null;
    /** HTTP status code when needed */
    static HTTPStatusCode?: number = undefined;

    /** Exception code in instance if
     * none, it takes from static `code` */
    readonly code: string | null = null;

    /**
     * @param message Message to show
     * @param options Pass directly to Error constructor,
     * known propety of options are `cause`
     * @param stack Stack to pass, can be taken from
     * an original error
     */
    constructor(message: string, options?: Record<string, any>, stack?: string) {
        super(message, options);

        const self = this.constructor as typeof BaseException;

        this.name = self.name;
        if (self.code) this.code = self.code;
        if (stack) this.stack = stack;

        const enumPropDesc = (e: boolean) => ({
            enumerable: e,
            writable: true,
            configurable: false,
        });

        Object.defineProperty(this, 'name', enumPropDesc(false));
        Object.defineProperty(this, 'message', enumPropDesc(true));
    }
}

Object.defineProperty(BaseException.prototype, 'code', {
    enumerable: false,
    writable: true,
    configurable: true,
});
