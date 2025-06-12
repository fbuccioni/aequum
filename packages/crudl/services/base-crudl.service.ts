
/**
 * Base CRUD/CRUDL service to use as a base for
 * services that implement CRUDL operations
 * (Create, Retrieve, Update, Delete, List)
 */
export abstract class BaseCRUDLService {
    /**
     * The primary key field
     */
    protected primaryKeyField: any = 'id';

    /**
     * Create a new data entry
     *
     * @param data
     */
    abstract create(data: any): any;

    /**
     * Retrieve a data entry by id
     *
     * @param id - ID value
     */
    abstract retrieve(id: any): any;


    /**
     * Retrieve a data entry by filter
     *
     * @param filter Filter to be applied to match the
     * entry.
     */
    abstract retrieveBy(filter: any): any;

    /**
     * Update a data entry by id
     *
     * @param id - ID value
     * @param data
     */
    abstract update(id: any, data: any): any;


    /**
     * Update a data entry by filter
     *
     * @param filter - Filter to be applied to match the
     * entry or entries.
     * @param data
     */
    abstract updateBy(filter: any, data: any): any;

    /**
     * Delete a data entry by id
     * @param id - ID value
     */
    abstract delete(id: any): any;

    /**
    * Delete a data entry by filter
     *
    * @param filter - Filter to be applied to match the
    * entry or entries.
    */
    abstract deleteBy(filter: any): any;

    /**
     * List all data entries
     *
     * @param filter - Filter to be applied to match the
     * entries.
     * @returns list of data entries
     */
    abstract list(filter?: any): any;
}
