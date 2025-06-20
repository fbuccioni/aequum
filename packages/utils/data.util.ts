/**
 * Hide passwords from data object by replacing all the properties
 * that end with 'password' with '********'
 *
 * @param data - Data object
 */
export function hidePasswords(data: any) {
    for (const key in data) {
        if (typeof data[key] === 'object')
            data[key] = hidePasswords(data[key]);
        else if (key.toLowerCase().endsWith('password'))
            data[key] = '********';
    }

    return data;
}

/**
 * Set a value in an object using dot notation
 *
 * @param dotNotation - Dot notation path
 * @param obj - Object to set the value, when
 * `null` or `undefined`it creates a new object
 * @param value - Value to set
 * @returns - Object with the value set
 */
export function updateObjectByDotNotation(
    dotNotation: string, obj?: any, value?: any
) {
    if (obj === null || obj === undefined) obj = {};

    const parts = dotNotation.split('.');
    const last = parts.pop() as string;

    parts.reduce((acc, part) => acc[part] = acc[part] || {}, obj)[last] = value;

    return obj;
}

/**
* Deep merge objects, with some added things
* from https://stackoverflow.com/a/48218209/742249
*
* @param objects - Objects to merge
* @returns - New object with merged key/values
*/
export function mergeDeep(...objects: any[]): any {
    const isObject = obj => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        if (obj === undefined || obj === null)
            return prev;

        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal))
                prev[key] = pVal.concat(...oVal);
            else if (isObject(pVal) && isObject(oVal))
                prev[key] = mergeDeep(pVal, oVal);
            else
                prev[key] = oVal;
        });

        return prev;
    }, {});
}

/**
 * Check if the given object is a class.
 *
 * @param obj - Object to check
 */
export function isClass(obj: object | Function): boolean {
    return (
        typeof obj === 'function'
        && Object.getOwnPropertyDescriptor(obj, 'prototype')?.writable === false
    )
}

const ObjectConstructor = {}.constructor;

/**
 * Check if the given object is an instance of a class.
 *
 * @param obj - Object to check
 */
export function isClassInstance(obj: object): boolean {
    return (
        typeof obj === 'object'
        && obj.constructor !== ObjectConstructor
    )
}

