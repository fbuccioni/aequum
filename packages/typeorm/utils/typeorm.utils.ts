/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DataSourceOptions, TypeORMError } from 'typeorm';
import { DuplicateEntryException } from '@aequum/exceptions/data';


export function URIToDataSourceOptions(uri: string):  DataSourceOptions {
    let parsedURI: URL;

    try {
        parsedURI = new URL(uri);
    } catch (err) {
        // @ts-ignore
        if (err instanceof TypeError && err.code === 'ERR_INVALID_URL') {
            err.message = `Invalid database URI '${uri}'`;
            // @ts-ignore
            err.code = 'ERR_INVALID_DATABASE_URI';
        }

        throw err;
    }

    const [ database, schema ] = parsedURI.pathname.split('/').slice(1);

    const additionalConfig = {};
    if (parsedURI.search)
        Object.assign(additionalConfig, Object.fromEntries(new URLSearchParams(parsedURI.search)));

    return {
        // @ts-ignore
        type: parsedURI.protocol.substring(0, parsedURI.protocol.length - 1),
        host: parsedURI.hostname,
        username: parsedURI.username,
        password: parsedURI.password,
        database,
        schema,
        port: (+parsedURI.port) || undefined,
        ... additionalConfig
    };
}

export function isDuplicateError(err: any) {
    return (
        err instanceof TypeORMError
        && err.message.match(/(duplicate|unique (key|constraint)|primary key|E11000)/i)
    )
}

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
