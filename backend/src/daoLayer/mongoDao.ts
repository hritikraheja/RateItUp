import * as mongoose from "mongoose"

export class MongoDao<T extends mongoose.Document>{
    private model : mongoose.Model<T>

    constructor(model : mongoose.Model<T>){
        this.model = model
    }

    getModel() : mongoose.Model<T>{
        return this.model;
    }

    async findAll(selectionCriteria : Object | {},projectionObject : Object | {}){
        let data = await this.model.find(selectionCriteria, projectionObject);
        return data;
    }

    async findOne(id: any) {
        let data = await this.model.findById(id);
        return data
    }

    async findOneByFields(fields : Object){
        let data = await this.model.find(fields)
        return data
    }

    async create(entity: T) {
        await this.model.create(entity);
    }

    async update(selectionCriteria : Object, updates : Object) {
        await this.model.findOneAndUpdate(selectionCriteria, updates)
    }

    async incrementField(selectionCriteria : Object, field : string, amount : Number){
        var incObj : any = {}
        incObj[field] = amount
        await this.model.findOneAndUpdate(selectionCriteria, {$inc : incObj})
    }

    async decrementField(selectionCriteria : Object, field : string, amount : number){
        var decObj : any = {}
        decObj[field] = -1 * amount
        await this.model.findOneAndUpdate(selectionCriteria, {$inc : decObj})
    }

    async delete(selectionCriteria : Object) {
        return await this.model.findOneAndDelete(selectionCriteria)
    }
}