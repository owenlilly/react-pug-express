import mongoose from 'mongoose';
import Rx from 'rxjs/Rx';


export default class BaseRepository {
    constructor(model){
        this.model = model;
    }

    findById(id){
        id = this.asObjectId(id);

        return Rx.Observable.fromPromise(this.model.findById(id, '-__v'));
    }

    updateById(id, updates){
        const promise = this.model.findByIdAndUpdate(
            { _id: this.asObjectId(id) },
            updates,
            { new: true }
        );

        return Rx.Observable.fromPromise(promise);
    }

    remove(query){
        return Rx.Observable.fromPromise(this.model.remove(query));
    }

    removeAll(query){
        return Rx.Observable.fromPromise(this.model.remove(query, {justOne: false}));
    }

    where(criteria){
        return Rx.Observable.just(this.model.where(criteria).select('-__v'));
    }

    exists(criteria){
        const query = this.model.where(criteria).select('_id');

        return Rx.Observable.fromPromise(query.findOne()).map(result => {
            return !!result;
        });
    }

    findOne(query){
        const q = this.model.where(query).select('-__v');

        return Rx.Observable.fromPromise(q.findOne());
    }

    find(query){
        const q = this.model.where(query).select('-__v');

        return Rx.Observable.fromPromise(q.find());
    }

    save(obj){
      const model = this.model(obj);
      return Rx.Observable.fromPromise(model.save());
    }

    saveMany(objs){
      const models = objs.map(o => this.model(o)); 
      return Rx.Observable.fromPromise(this.model.insertMany(models));
    }

    asObjectId(id){
        // Force the Type to be type ObjectId
        if(typeof id === 'string' || id instanceof String){
            return mongoose.Types.ObjectId(id);
        } else if(!(id instanceof mongoose.Types.ObjectId)){
            throw new Error(`id must be of type 'string' or 'mongoose.Types.ObjectId', ${id} given`);
        }

        return id;
    }
}
