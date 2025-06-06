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
    protected primaryKeyField = 'id' as PrimaryKeyField;

    static uniqueFields: string[];
    static duplicatedEntryMessage?: string;

    static duplicateEntryExceptionMessage() {
        const self = this;

        if (self.duplicatedEntryMessage)
            return self.duplicatedEntryMessage;

        if (this.uniqueFields && this.uniqueFields?.length)
            return `\`${ self.uniqueFields.join('` or ') }\` already exists`;

        return 'Duplicated entry';
    }

    protected readonly repository: TypeORMRepository<EntityModel>

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

    async retrieve(id: EntityModel[PrimaryKeyField]): Promise<EntityModelDto> {
        return this.retrieveBy({ [ this.primaryKeyField ]: id } as QueryFilter)
    }

    async retrieveBy(filter: QueryFilter): Promise<EntityModelDto> {
        return this.repository.findOneBy(
            filter as FindOptionsWhere<EntityModel>
        ) as unknown as Promise<EntityModelDto>;
    }

    async update(id: EntityModel[PrimaryKeyField], data: EntityModelUpdateDto): Promise<EntityModelDto> {
        return this.updateBy(
            { [ this.primaryKeyField ]: id } as QueryFilter,
            data
        );
    }

    async updateBy(filter: QueryFilter, data: EntityModelUpdateDto): Promise<EntityModelDto> {
        const self = this.constructor as typeof BaseCRUDLTypeORMService;

        try {
            await this.repository.update(filter as FindOptionsWhere<EntityModel>, data as any);
            return this.retrieveBy(filter);
        } catch (err) {
            throw duplicateEntryExceptionOrError(
                err, self.duplicateEntryExceptionMessage(), data, self.uniqueFields || []
            );
        }
    }

    async delete(id: EntityModel[PrimaryKeyField]): Promise<void> {
        await this.deleteBy(
            { [ this.primaryKeyField ]: id } as QueryFilter
        )
    }

    async deleteBy(filter: QueryFilter): Promise<void> {
        await this.repository.delete(filter as FindOptionsWhere<EntityModel>);
    }

    async list(filter?: any): Promise<EntityModelDto[]> {
        return this.repository.find(filter) as unknown as Promise<EntityModelDto[]>;
    }
}
