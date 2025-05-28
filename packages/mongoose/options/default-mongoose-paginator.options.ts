import mongoose from 'mongoose';
import 'mongoose-paginate-v2';


/**
 * Default options passsed to `mongoose-paginate-v2`
 * paginated queries.
 *
 * By default we just change the labels of a
 * standard paginated query to match. Notice the
 * `hasNextPage`, `hasPrevPage` and
 * `pagingCounter` properties are mapped to `_`
 * property this means will be ignored.
 */
export const defaultMongoosePaginateOptions: mongoose.PaginateOptions = {
    customLabels: {
        totalDocs: 'total',
        docs: 'data',
        limit: 'size',
        page: 'page',
        nextPage: 'next',
        prevPage: 'prev',
        hasNextPage: '_',
        hasPrevPage: '_',
        totalPages: 'pages',
        pagingCounter: '_',
        meta: 'paginator',
    }
}
