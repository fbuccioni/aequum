import { BaseCRUDLService } from '@aequum/crudl';

import { InMemoryRepository } from '../repositories/in-memory.repository';


export class BaseCRUDLInMemoryService<
    Model extends { [ key in PrimaryKeyField ]: any },
    ModelDto,
    ModelCreateDto,
    ModelUpdateDto,
    ModelFilterType = any,
    PrimaryKeyField extends string = 'id',
> extends BaseCRUDLService {
    protected primaryKeyField: PrimaryKeyField = 'id' as PrimaryKeyField;
    protected repository: InMemoryRepository<Model, PrimaryKeyField>

    async create(data: ModelCreateDto): Promise<ModelDto> {
        return this.repository.put(data as any) as ModelDto;
    }

    async retrieve(id: Model[PrimaryKeyField]): Promise<ModelDto> {
        return this.repository.getOneById(id) as ModelDto;
    }

    async retrieveBy(filter: ModelFilterType): Promise<ModelDto> {
        return this.repository.getOne(filter as any) as ModelDto;
    }

    async update(id: Model[PrimaryKeyField], data: ModelUpdateDto): Promise<ModelDto> {
        await this.repository.update({ [this.primaryKeyField]: id } as any, data as any);
        return this.repository.getOneById(id) as ModelDto;
    }

    async updateBy(filter: ModelFilterType, data: ModelUpdateDto): Promise<ModelDto | ModelDto[]> {
        const updated = this.repository.update(filter as any, data as any);

        if (Array.isArray(updated))
            return updated as ModelDto[];
        return updated as ModelDto;
    }

    async delete(id: Model[PrimaryKeyField]): Promise<void> {
        await this.repository.delete({ [ this.primaryKeyField ]: id } as any);
    }

    async deleteBy(filter: ModelFilterType): Promise<void> {
        await this.repository.delete(filter as any);
    }

    async list(filter?: ModelFilterType): Promise<Model[]> {
        return this.repository.find(filter ?? {});
    }
}