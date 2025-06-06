import { AnyKeys, HydratedDocument, Model as MongooseModel, RootFilterQuery, UpdateQuery } from 'mongoose';
import { NotFoundException }from '@aequum/exceptions/data';


type AnyObject = { [ key: string ]: any };

export class MongooseRepository<SchemaModel> {
    protected model: MongooseModel<SchemaModel>;

    /**
     * The mongoose schema model
     * @protected
     */
    get schema() {
        return this.model.schema;
    }

    async delete(filter: RootFilterQuery<SchemaModel>) {
        await this.model.deleteOne(filter).exec();
    }

    async deleteMany(filter: RootFilterQuery<SchemaModel>) {
        await this.model.deleteMany(filter).exec();
    }

    async find(filter: RootFilterQuery<SchemaModel>): Promise<SchemaModel[]> {
        return this.model.find(filter).exec();
    }

    async getOne(filter: RootFilterQuery<SchemaModel>): Promise<SchemaModel> {
        const doc = await this.model.findOne(filter).exec();
        if (!doc) throw new NotFoundException(`${this.model.modelName} not found`);
        return doc;
    }

    async getOneById(id: any): Promise<SchemaModel> {
        const doc = await this.model.findById(id).exec();
        if (!doc) throw new NotFoundException(`${this.model.modelName} not found`);
        return doc;
    }

    async put(data: SchemaModel | AnyObject): Promise<SchemaModel>  {
        const document: HydratedDocument<SchemaModel> = new this.model(data);
        await document.save();

        return document.toJSON() as SchemaModel;
    }

    async putMany(data: any[]) {
        return Promise.all(data.map((item) => this.put(item)));
    }

    async update(filter: RootFilterQuery<SchemaModel>, data: AnyKeys<SchemaModel> & AnyObject) {
        return this.model.updateOne(filter, { $set: data }).exec();
    }

    async pushOnArrayProperty(filter: RootFilterQuery<SchemaModel>, property: string, data: any) {
        return this.model.updateOne(
            filter, { $push: { [property]: data } } as UpdateQuery<any>
        ).exec();
    }

    async pullFromArrayProperty(filter: RootFilterQuery<SchemaModel>, property: string, data: any) {
        return this.model.updateOne(
            filter, { $pull: { [property]: data } } as UpdateQuery<any>
        )
    }

    async updateQuery(filter: RootFilterQuery<SchemaModel>, query: UpdateQuery<SchemaModel>) {
        return this.model.updateMany(filter, query).exec();
    }
}
