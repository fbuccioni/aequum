import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';


export class TypeORMRepository<Model extends ObjectLiteral> extends Repository<Model> {
    constructor(target: EntityTarget<Model>, dataSource: DataSource) {
        super(target, dataSource.createEntityManager());
    }
}
