import { NotFoundException } from '@aequum/exceptions/data';
import { ValidationException } from '@aequum/exceptions/validation';
import { data as dataUtil } from '@aequum/utils'
import { randomUUID } from 'node:crypto';


/**
 * In memory (**volatile**) repository, implements basic
 * input/output operations.
 *
 * **NOTE**: If you want to change the primary key field
 * you must set the `primaryKeyField` property and pass the
 * `PrimeryKeyField` type parameter.
 *
 * @typeParam Model - The model type, must extend `AnyObject`
 * @typeParam PrimeryKeyField - The primary key field name, defaults to 'id'
 * if this changes you must set the `primaryKeyField` property
 */
export class InMemoryRepository<
    Model extends { [ key in PrimeryKeyField ]: any },
    PrimeryKeyField extends string = 'id'
> {
    protected data: Model[] = [];
    protected primaryKeyField = 'id' as PrimeryKeyField

    /**
     * Primary Key generator, by default uses `randomUUID()`
     * to generate a unique identifier.
     */
    public genPrimaryKey(): Model[PrimeryKeyField] {
        return randomUUID() as Model[PrimeryKeyField];
    }

    /**
     * Check if an item matches the filter.
     *
     * @param item Repository item
     * @param filter Custom filter to match against the item
     */
    protected matchesFilter(item: Model, filter: Partial<Model>): boolean {
        return Object.keys(filter).every((key) => {
            if (Array.isArray(item[key])) {
                if (!Array.isArray(filter[key]))
                    return item[key].some(i => filter[key].includes(i));
                return item[key].includes(filter[key]);
            }

            return item[key] === filter[key]
        });
    }

    /**
     * Find indexes of items that match the filter.
     *
     * @param filter Filter to match against the items
     */
    protected matchIndexes(filter: Partial<Model>): number[] {
        return this.data
            .map((item, idx) => this.matchesFilter(item, filter) ? idx : -1)
            .filter(idx => idx !== -1);
    }

    /**
     * Dot notation find, allows to find nested properties
     * in the item.
     */
    protected dotNotationFind(item: Model, property: string): any {
        return property.split('.').reduce((acc, key) => {
            if (acc && typeof acc === 'object' && key in acc) {
                return acc[key];
            }
            return undefined;
        }, item);
    }

    /**
     * Delete an item from the repository.
     *
     * @param filter
     */
    async delete(filter: Partial<Model>) {
        for( const idx of this.matchIndexes(filter) )
            this.data.splice(Number(idx), 1);
    }

    /**
     * Delete all items that match the filter.
     *
     * @param filter
     */
    async deleteMany(filter: Partial<Model>) {
        await this.delete(filter);
    }

    /**
     * Find items in the repository that match the filter.
     *
     * @param filter
     */
    async find(filter: Partial<Model>): Promise<Model[]> {
        return this.data.filter(item => this.matchesFilter(item, filter));
    }

    /**
     * Get an item from the repository that matches the filter.
     *
     * @param filter
     */
    async getOne(filter: Partial<Model>): Promise<Model> {
        const item = this.data.find(item => this.matchesFilter(item, filter));
        if (!item) throw new NotFoundException(`Item not found`);
        return item;
    }

    /**
     * Get an item by its primary key.
     *
     * @param id
     */
    async getOneById(id: any): Promise<Model> {
        const item = this.data.find(item => item[this.primaryKeyField] === id);
        if (!item) throw new NotFoundException(`Item not found`);
        return item;
    }

    /**
     * Put an item into the repository.
     */
    async put(data: Model & { [ key in PrimeryKeyField ]?: Model[PrimeryKeyField] }): Promise<Model> {
        const hasPrimaryKey = this.primaryKeyField in data;
        const existingIndex = (
            hasPrimaryKey
            ? this.data.findIndex(
                item => item[this.primaryKeyField] === data[this.primaryKeyField]
            )
            : -1
        );

        if (!hasPrimaryKey)
            data = {
                [this.primaryKeyField]: this.genPrimaryKey(),
                ...data
            };

        if (existingIndex !== -1)
            this.data[existingIndex] = data;
        else
            this.data.push(data);

        return data;
    }

    /**
     * Put many items into the repository.
     */
    async putMany(data: Model[]): Promise<Model[]> {
        return Promise.all(data.map(item => this.put(item)));
    }

    /**
     * Update one or more items in the repository that match the filter.
     *
     * @param filter Filter to match
     * @param data Data to update the items with
     */
    async update(filter: Partial<Model>, data: Partial<Model>) {
        const idxs = this.matchIndexes(filter);
        if (idxs.length === 0) {
            throw new NotFoundException(`No items found`);
        }

        for (const idx of idxs)
            this.data[idx] = dataUtil.mergeDeep(this.data[idx], data);

        if (idxs.length === 1)
            return this.data[idxs[0]];

        return this.data.filter((_, idx) => idxs.includes(idx));
    }

    /**
     * Push a value into an array property of items that match the filter.
     *
     * @param filter Filter to match the items
     * @param property The property to push the value into, can be a dot notation
     *                 string to access nested properties.
     *                 For example: 'nested.property.array'
     * @param value The value to push into the array property
     * @throws NotFoundException if no items match the filter
     * @throws ValidationException if the property is not a valid string
     * @throws NotFoundException if the property is not found in the item
     */
    async pushOnArrayProperty(
        filter: Partial<Model>,
        property: string,
        value: any
    ) {
        const idxs = this.matchIndexes(filter);

        if (idxs.length === 0)
            throw new NotFoundException(`No items found`);

        if (!property || typeof property !== 'string')
            throw new ValidationException({
                property: [[
                    'ERR_INVALID_PROPERTY',
                    `Property \`${property}\` is not a valid string`,
                    [ property ],
                ]]
            });

        for (const idx of idxs) {
            const item = this.data[idx];
            const dotNotationChunks = property.split('.');
            const lastProperty = dotNotationChunks.pop() as string;
            const dotNotationParent = dotNotationChunks.join('.');
            const parentObject = (
                dotNotationChunks.length > 0
                    ? this.dotNotationFind(item, dotNotationParent)
                    : item
            );

            if( !parentObject )
                throw new NotFoundException(`Property \`${dotNotationParent}\` not found in item`);

            if ( parentObject[lastProperty] == undefined )
                parentObject[lastProperty] = [];

            parentObject[lastProperty].push(value);
        }

        if (idxs.length === 1)
            return this.data[idxs[0]];

        return this.data.filter((_, idx) => idxs.includes(idx));
    }

    /**
     * Pull a value from an array property of items that match the filter.
     *
     * @param filter Filter to match the items
     * @param property The property
     *                 string to access nested properties.
     *                 For example: 'nested.property.array'
     * @param value The value to push into the array property
     */
    async pullFromArrayProperty(filter: Partial<Model>, property: string, value: any) {
        const idxs = this.matchIndexes(filter);

        if (idxs.length === 0)
            throw new NotFoundException(`No items found`);

        if (!property || typeof property !== 'string')
            throw new ValidationException({
                property: [[
                    'ERR_INVALID_PROPERTY',
                    `Property \`${property}\` is not a valid string`,
                    [ property ],
                ]]
            });

        for (const idx of idxs) {
            const item = this.data[idx];
            const dotNotationChunks = property.split('.');
            const lastProperty = dotNotationChunks.pop() as string;
            const dotNotationParent = dotNotationChunks.join('.');
            const parentObject = (
                dotNotationChunks.length > 0
                    ? this.dotNotationFind(item, dotNotationParent)
                    : item
            );

            if ((!parentObject) || parentObject[lastProperty] == undefined)
                throw new NotFoundException(`Property \`${property}\` not found in item`);

            if (!Array.isArray(parentObject[lastProperty]))
                throw new ValidationException({
                    property: [[
                        'ERR_INVALID_PROPERTY',
                        `Property \`${property}\` is not an array`,
                        [ property ],
                    ]]
                });

            const valueIndex = parentObject[lastProperty].indexOf(value);
            parentObject[lastProperty].splice(valueIndex, 1);
        }

        if (idxs.length === 1)
            return this.data[idxs[0]];

        return this.data.filter((_, idx) => idxs.includes(idx));
    }
}