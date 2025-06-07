import { PaginateSortBy } from '@aequum/paginate-common';
import { BaseCRUDLPaginatedService } from '@aequum/crudl';

import { BaseCRUDLInMemoryService } from './base-crudl-in-memory.service';
// ...existing code...

export class BaseCRUDLInMemoryPaginatedService<
    Model extends { [key: string]: any },
    ModelDto,
    ModelCreateDto,
    ModelUpdateDto,
    PaginatedModelDto,
    ModelFilterType = any,
    PK extends string = 'id',
> extends BaseCRUDLInMemoryService<
    Model,
    ModelDto,
    ModelCreateDto,
    ModelUpdateDto,
    ModelFilterType,
    PK
> implements BaseCRUDLPaginatedService {

    async paginatedList(
        filter: ModelFilterType,
        page: number,
        size: number,
        sort?: string | PaginateSortBy, // Ignored
        ...args: any[]
    ): Promise<PaginatedModelDto> {
        if (page < 1)
            page = 1;

        const all = await this.repository.find(filter ?? {});
        const start = (page - 1) * size;
        const end = start + size;
        const data = all.slice(start, end) as unknown as ModelDto[];
        const pages = Math.ceil(all.length / size);

        return {
            data,
            paginator: {
                page,
                size,
                pages,
                next: page < pages ? page + 1 : null,
                prev: page > 1 ? page - 1 : null,
                total: all.length
            }
        } as PaginatedModelDto;
    }
}