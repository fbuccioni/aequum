/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DataSourceOptions } from 'typeorm';


/**
 * SchemedDataSources are the data sources that support schemas
 * and will be parsed as `database/schema` in `URIToDataSourceOptions`
 * if there are a custom DataSource driver and schema need to be parsed
 * in the URI, add the DataSource name to this array.
 *
 * @see {@link URIToDataSourceOptions}
 */
export const SchemedDataSources = [ 'postgres', 'mssql', 'cockroachdb' ];

/**
 * Translate a database URI to TypeORM DataSourceOptions, protocol must be
 * the TypeORM DataSource type (e.g. 'mysql', 'postgres', 'sqlite', etc.),
 * the host, port, username, password, database and schema (If applies)
 * will be extracted from the URI and all the query string parameters will
 * be added to the options.
 *
 * @see [TypeORM Docs: DataSource API](https://orkhan.gitbook.io/typeorm/docs/data-source-api)
 * @see [TypeORM Docs: Data source options](https://orkhan.gitbook.io/typeorm/docs/data-source-options)
 * @see {@link SchemedDataSources}
 * @param uri DataSource URI
 * @returns TypeORM DataSourceOptions
 */
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

    const dataSourceType = parsedURI.protocol.substring(0, parsedURI.protocol.length - 1);
    const [ database, schema ] = (
        (SchemedDataSources.includes(dataSourceType))
            ? parsedURI.pathname.split('/').slice(1)
            : [ parsedURI.pathname.slice(1), undefined ]
    )

    const additionalConfig = {};

    if (parsedURI.search)
        Object.assign(additionalConfig, Object.fromEntries(new URLSearchParams(parsedURI.search)));

    return {
        type: dataSourceType as any,
        host: parsedURI.hostname,
        username: parsedURI.username,
        password: parsedURI.password,
        database,
        schema,
        port: (+parsedURI.port) || undefined,
        ... additionalConfig
    };
}
