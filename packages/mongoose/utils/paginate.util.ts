import mongoose from 'mongoose';
import 'mongoose-paginate-v2';
import { PaginateSortBy, PaginateResult, PaginateResultPaginator }from '@aequum/paginate-common';

import { defaultMongoosePaginateOptions }from '../options/default-mongoose-paginator.options';


/** @ignore */
export async function paginate<SchemaModel, Paginator = PaginateResultPaginator> (
    model: mongoose.PaginateModel<SchemaModel>,
    filter: mongoose.RootFilterQuery<SchemaModel>,
    page: number,
    size: number,
    sort?: PaginateSortBy,
    projection?: mongoose.ProjectionType<SchemaModel>,
    options?: mongoose.PaginateOptions,
): Promise<PaginateResult<SchemaModel, Paginator>> {
    options = Object.assign(
        {},
        defaultMongoosePaginateOptions,
        options
    );

    if (projection)
        options.projection = projection;

    if (sort)
        options.sort = sort;

    options.page = page;
    options.limit = size;

    return new Promise((resolve, reject) => {
        try {
            void model.paginate(
                filter,
                options,
                (err, result) => {
                    if (err) return reject(err);

                    // Delete properties marked with `_` in options
                    delete ( result.paginator as any )._;
                    resolve(result as unknown as PaginateResult<SchemaModel, Paginator>);
                }
            )
        } catch (err) {
            reject(err);
        }
    });
}
