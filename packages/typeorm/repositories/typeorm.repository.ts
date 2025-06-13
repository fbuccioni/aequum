import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';

/**
 * TypeORMRepository is a wrapper around TypeORM's Repository class
 * that allows for easier use of TypeORM with Aequum, also created
 * for future compatibility or extensibility.
 */
export abstract class TypeORMRepository<Model extends ObjectLiteral> extends Repository<Model> {
    constructor(target: EntityTarget<Model>, dataSource: DataSource) {
        super(target, dataSource.createEntityManager());
    }
}
