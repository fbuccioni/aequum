import { RootFilterQuery } from 'mongoose';
import { BaseCRUDLService } from '@aequum/crudl';

import { MongooseRepository } from '../repositories';
import { duplicateEntryExceptionOrError } from '../utils/exception.util';


/**
 * Base CRUDL Mongoose Service for a Mongoose Schema Model, by default
 * assumes that the primary key field as `id` provided by Virtual ID
 *
 * @typeParam SchemaModel Mongoose Schema Model
 * @typeParam SchemaModelDto DTO of the Mongoose Schema Model
 * @typeParam SchemaModelCreateDto DTO to create a new Mongoose Schema Model
 * @typeParam SchemaModelUpdateDto DTO to update a Mongoose Schema Model
 * @typeParam CustomFilterType Custom filter type to filter the query
 * @typeParam PrimaryKeyField Primary key field of the Mongoose Schema
 * Model by default is `id` (Virtual ID)
 */
export abstract class BaseCRUDLMongooseService<
    SchemaModel extends { [key in PrimaryKeyField]: any },
    SchemaModelDto,
    SchemaModelCreateDto,
    SchemaModelUpdateDto,
    CustomFilterType = any,
    PrimaryKeyField extends string = 'id',
> extends BaseCRUDLService implements BaseCRUDLService {
    /** The primary key field, default is `_id` even if Virtual ID */
    protected primaryKeyField: string = '_id';

    /** Unique fields to check for duplicated entries */
    static uniqueFields: string[];
    /** Custom duplicated entry exception message */
    static duplicatedEntryMessage?: string;

    /** Default MongoDB filter to apply to all queries */
    protected defaultMongoDBFilter: RootFilterQuery<SchemaModel> = {};

    /**
     * Method to get the default MongoDB filter to apply to all
     * queries when an instance member is needed to create the
     * default filter, by default returns the
     * `defaultMongoDBFilter` property.
     *
     * If you don't need a local instance member to create the
     * default filter, you just need to change the
     * `defaultMongoDBFilter` property.
     *
     * @protected
     */
    protected getDefaultMongoDBFilter(): RootFilterQuery<SchemaModel> {
        return this.defaultMongoDBFilter;
    }

    /** @ignore */
    static duplicateEntryExceptionMessage() {
        const self = this;

        if (self.duplicatedEntryMessage)
            return self.duplicatedEntryMessage;

        if (this.uniqueFields && this.uniqueFields?.length)
            return `\`${ self.uniqueFields.join('` or ') }\` already exists`;

        return 'Duplicated entry';
    }

    /**
     * Convert a custom query filter to a MongoDB filter, the
     * default convert transform the `id` (Virtual ID) field to the
     * MongoDB `_id` field. using `virtualIDFilterTransform` method.
     *
     * @param filter Custom query filter, the fifth type argument
     * @returns MongoDB filter
     */
    queryFilterToMongoDBFilter(filter: CustomFilterType): RootFilterQuery<SchemaModel> {
        const mongoFilter = Object.assign(
            {}, filter, this.getDefaultMongoDBFilter()
        );
        this.virtualIDFilterTransform(mongoFilter);
        return mongoFilter as unknown as RootFilterQuery<SchemaModel>;
    }

    /**
     * Checks if model have virtual ID field and if it has
     * transforms the `id` field to `_id` field.
     *
     * @param filter
     */
    virtualIDFilterTransform(filter: any) {
        if (!(this.repository.schema as any).__hasVirtualID__) return;

        if (filter?.id) {
            filter._id = filter.id;
            delete filter.id;
        }
    }

    /** Mongoose Repository to interact with the Mongoose Model */
    protected readonly repository: MongooseRepository<SchemaModel>

    /** @inheritdoc */
    async create(data: SchemaModelCreateDto): Promise<SchemaModelDto> {
        const self = this.constructor as typeof BaseCRUDLMongooseService;

        try {
            return this.repository.put(
                data as unknown as SchemaModel
            ) as unknown as Promise<SchemaModelDto>;
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            )
        }
    }

    /** @inheritdoc */
    async retrieve(id: SchemaModel[PrimaryKeyField]): Promise<SchemaModelDto> {
        return this.repository.getOneById(id) as unknown as Promise<SchemaModelDto>;
    }

    /** @inheritdoc */
    async retrieveBy(filter: CustomFilterType): Promise<SchemaModelDto> {
        return this.repository.getOne(
            this.queryFilterToMongoDBFilter(filter)
        ) as unknown as Promise<SchemaModelDto>;
    }

    /** @inheritdoc */
    async update(id: SchemaModel[PrimaryKeyField], data: SchemaModelUpdateDto): Promise<SchemaModelDto> {
        return this.updateBy(
            { [ this.primaryKeyField ]: id } as CustomFilterType,
            data
        );
    }

    /** @inheritdoc */
    async updateBy(filter: CustomFilterType, data: SchemaModelUpdateDto): Promise<SchemaModelDto> {
        const self = this.constructor as typeof BaseCRUDLMongooseService;

        try {
            await this.repository.update(this.queryFilterToMongoDBFilter(filter), data as any);
            return this.retrieveBy(filter) as unknown as Promise<SchemaModelDto>;
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            );
        }
    }

    /** @inheritdoc */
    async delete(id: SchemaModel[PrimaryKeyField]): Promise<void> {
        return this.deleteBy({ [ this.primaryKeyField ]: id } as CustomFilterType);
    }

    /** @inheritdoc */
    async deleteBy(filter: CustomFilterType): Promise<void> {
        return this.repository.delete(this.queryFilterToMongoDBFilter(filter));
    }

    /** @inheritdoc */
    async list(filter?: any): Promise<SchemaModelDto[]> {
        return this.repository.find(
            this.queryFilterToMongoDBFilter(filter)
        ) as unknown as Promise<SchemaModelDto[]>;
    }
}
