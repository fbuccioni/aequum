import type { FindOptionsWhere } from 'typeorm';
import { BaseCRUDLService }from '@aequum/crudl';

import { TypeORMRepository } from '../repositories';
import { duplicateEntryExceptionOrError } from '../utils/typeorm.utils';

/**
 * Base CRUD/CRUDL TypeORM Service for a TypeORM Entity Model.
 *
 * **NOTE**: If you want to present different primary key
 * field you must pass the `PrimaryKeyField` type parameter.
 * and set the `primaryKeyField` property to the name of
 * the field.
 */
export abstract class BaseCRUDLTypeORMService<
    EntityModel extends { [ key in PrimaryKeyField ]: any },
    EntityModelDto,
    EntityModelCreateDto,
    EntityModelUpdateDto,
    QueryFilter = any,
    PrimaryKeyField extends string = 'id'
> extends BaseCRUDLService implements BaseCRUDLService {
    /** The primary key field */
    protected primaryKeyField = 'id' as PrimaryKeyField;

    /** Unique fields to show when a dulplicate error is found */
    static uniqueFields: string[];
    /** Custom duplicated entry exception message */
    static duplicatedEntryMessage?: string;

    /** Default TypeORM filter to apply to all queries */
    protected defaultTypeORMFilter: FindOptionsWhere<EntityModel> = {};

    /**
     * Method to get the default TypeORM filter to apply to all
     * queries when an instance member is needed to create the
     * default filter, by default returns the
     * `defaultTypeORMFilter` property.
     *
     * If you don't need a local instance member to create the
     * default filter, you just need to change the
     * `defaultTypeORMFilter` property.
     *
     * @protected
     */
    protected getDefaultTypeORMFilter(): FindOptionsWhere<EntityModel> {
        return this.defaultTypeORMFilter;
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
     * Convert a custom query filter to a TypeORM filter
     *
     * @param filter Custom query filter, the fifth type argument
     * @returns TypeORM filter
     */
    queryFilterToTypeORMFilter(filter: QueryFilter): FindOptionsWhere<EntityModel> {
        const typeOrmFilter = Object.assign(
            {}, filter, this.getDefaultTypeORMFilter()
        );

        return typeOrmFilter as unknown as FindOptionsWhere<EntityModel>;
    }

    /** TypeORM Repository to interact with the Mongoose Model */
    protected readonly repository: TypeORMRepository<EntityModel>

    /** @inheritdoc */
    async create(data: EntityModelCreateDto): Promise<EntityModelDto> {
        const self = this.constructor as typeof BaseCRUDLTypeORMService;

        try {
            const ormModel = this.repository.create(data as any);
            return this.repository.save(ormModel) as unknown as Promise<EntityModelDto>;
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            )
        }
    }

    /** @inheritdoc */
    async retrieve(id: EntityModel[PrimaryKeyField]): Promise<EntityModelDto> {
        return this.retrieveBy({ [ this.primaryKeyField ]: id } as QueryFilter)
    }

    /** @inheritdoc */
    async retrieveBy(filter: QueryFilter): Promise<EntityModelDto> {
        return this.repository.findOneBy(
            this.queryFilterToTypeORMFilter(filter)
        ) as unknown as Promise<EntityModelDto>;
    }

    /** @inheritdoc */
    async update(id: EntityModel[PrimaryKeyField], data: EntityModelUpdateDto): Promise<EntityModelDto> {
        return this.updateBy(
            { [ this.primaryKeyField ]: id } as QueryFilter,
            data
        );
    }

    async updateBy(filter: QueryFilter, data: EntityModelUpdateDto): Promise<EntityModelDto> {
        const self = this.constructor as typeof BaseCRUDLTypeORMService;

        try {
            const typeORMfilter = this.queryFilterToTypeORMFilter(filter);
            await this.repository.update(typeORMfilter, data as any);
            return this.repository.findOneBy(typeORMfilter) as unknown as Promise<EntityModelDto>;
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            );
        }
    }

    /** @inheritdoc */
    async delete(id: EntityModel[PrimaryKeyField]): Promise<void> {
        await this.deleteBy(
            { [ this.primaryKeyField ]: id } as QueryFilter
        )
    }

    /** @inheritdoc */
    async deleteBy(filter: QueryFilter): Promise<void> {
        await this.repository.delete(this.queryFilterToTypeORMFilter(filter));
    }

    /** @inheritdoc */
    async list(filter?: any): Promise<EntityModelDto[]> {
        return this.repository.find(this.queryFilterToTypeORMFilter(filter || {})) as unknown as Promise<EntityModelDto[]>;
    }
}
