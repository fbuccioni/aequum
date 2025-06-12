import * as mongoose from 'mongoose';
import 'mongoose-paginate-v2';
import { PaginateSortBy }from '@aequum/paginate-common';

import { MongooseRepository } from '..';
import { paginate }from '../../utils/paginate.util';


export class MongoosePaginatedRepository<SchemaModel>
extends MongooseRepository<SchemaModel> {
    declare protected model: mongoose.PaginateModel<SchemaModel>;

    async paginatedFind(
        filter: mongoose.RootFilterQuery<SchemaModel>,
        page: number,
        size: number,
        sort?: PaginateSortBy,
        projection?: mongoose.ProjectionType<SchemaModel>,
        options?: mongoose.PaginateOptions
    ) {
        return paginate(
            this.model,
            filter,
            page,
            size,
            sort,
            projection,
            options
        )
    }
}
