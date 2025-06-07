import { BaseCRUDLService } from '@aequum/crudl';

import { InMemoryRepository } from '../repositories/in-memory.repository';


export class BaseCRUDLInMemoryService<
    Model extends { [key: string]: any },
    ModelDto,
    ModelCreateDto,
    ModelUpdateDto,
    ModelFilterType = any,
    PK extends string = 'id',
> extends BaseCRUDLService {
    protected primaryKeyField: PK = 'id' as PK;

    constructor(protected repository: InMemoryRepository<Model, PK>) {
        super();
    }

    async create(data: ModelCreateDto): Promise<ModelDto> {
        return this.repository.put(data as any) as ModelDto;
    }

    async retrieve(id: Model[PK]): Promise<ModelDto> {
        return this.repository.getOneById(id) as ModelDto;
    }

    async retrieveBy(filter: ModelFilterType): Promise<ModelDto> {
        return this.repository.getOne(filter as any) as ModelDto;
    }

    async update(id: Model[PK], data: ModelUpdateDto): Promise<ModelDto> {
        await this.repository.update({ [this.primaryKeyField]: id } as any, data as any);
        return this.repository.getOneById(id) as ModelDto;
    }

    async updateBy(filter: ModelFilterType, data: ModelUpdateDto): Promise<ModelDto | ModelDto[]> {
        const updated = this.repository.update(filter as any, data as any);

        if (Array.isArray(updated))
            return updated as ModelDto[];
        return updated as ModelDto;
    }

    async delete(id: Model[PK]): Promise<void> {
        await this.repository.delete({ [ this.primaryKeyField ]: id } as any);
    }

    async deleteBy(filter: ModelFilterType): Promise<void> {
        await this.repository.delete(filter as any);
    }

    async list(filter?: ModelFilterType): Promise<Model[]> {
        return this.repository.find(filter ?? {});
    }
}