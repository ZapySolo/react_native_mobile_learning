import PouchDB from 'pouchdb-react-native';
import PouchFind from 'pouchdb-find';
import uuid from 'react-native-uuid';
import {get, set, pick, unset } from 'lodash';
import {ToastAndroid} from 'react-native';
import PouchAuth from 'pouchdb-authentication';

PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchAuth);

class Options {

    constructor(obj, filter = {}) {
        if (Array.isArray(get(obj, 'sort')))
            this.sort = get(obj, 'sort');
        if (Array.isArray(get(obj, 'fields')))
            this.fields = get(obj, 'fields');
        if (!isNaN(parseInt(get(obj, 'limit'))))
            this.limit = get(obj, 'limit');
        if (!isNaN(parseInt(get(obj, 'skip'))))
            this.skip = get(obj, 'skip');
        if (Array.isArray(get(obj, 'contains')))
            obj.contains.forEach((e) => {
                if (get(filter, e)) set(filter, e, { $regex: new RegExp(get(filter, e), 'i') });
            });
        // Keep `or` option last
        if (Array.isArray(get(obj, 'or'))) {
            set(filter, '$or', []);
            obj.or.forEach((e) => {
                if (get(filter, e)) {
                    filter.$or.push(pick(filter, e));
                    unset(filter, e);
                }
            });
        }
    }
}

class Repository {
    //'https://nikhil:password@127.0.0.1:5984/test2'
    constructor(dbName ='mobile_learning', remoteUrl = 'https://nikhil:password@127.0.0.1:5984/test2', options = {}, pouchPlugin) {
        this.dbName = dbName;
        if (pouchPlugin) PouchDB.plugin(pouchPlugin);

        this.db = new PouchDB('mobile_learning');
  
        this.createIndex = (fields) => {
            return new Promise((resolve, reject) => {
                this.db.createIndex({ index: { fields } })
                    .then((result) => resolve())
                    .catch((error) => reject({
                        error: `Could not create index with "${fields}"`,
                        dbError: error
                    }));
            });
        }

        this.insert = (data, partition) => {
            return new Promise((resolve, reject) => {
                if (typeof get(data, '_id') !== 'string')
                    set(data, '_id', uuid.v4());
                if (typeof partition === 'string')
                    set(data, '_id', `${partition}:${data._id}`);
                this.db.post(data)
                    .then((result) => resolve({
                        _id: typeof partition === 'string' ? result.id.split(':')[1] : result.id,
                        _rev: result.rev
                    }))
                    .catch((error) => reject({
                        error: `Could not insert document with _id "${get(data, '_id')}"`,
                        dbError: error
                    }))
            });
        }

        this.upsert = (data, partition) => {
            if (typeof get(data, '_id') !== 'string')
                set(data, '_id', uuid.v4());
            if (typeof partition === 'string')
                set(data, '_id', `${partition}:${data._id}`);

            return new Promise((resolve, reject) => {
                this.db.put(data)
                    .then((result) => resolve({
                        _id: typeof partition === 'string' ? result.id.split(':')[1] : result.id,
                        _rev: result.rev
                    }))
                    .then((result)=>{
                        ToastAndroid.showWithGravityAndOffset(
                            `${result.id.split(':')[0]} updated`,
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                            25, 50
                        );
                    })
                    .catch((error) => reject({
                        error: `Could not upsert document with _id "${get(data, '_id')}"`,
                        dbError: error
                    }))
            });
        }

        this.upsertMany = (docs, partition) => {
            docs.forEach((e) => {
                if (typeof get(e, '_id') !== 'string')
                    set(e, '_id', uuid.v4());
                if (typeof partition === 'string')
                    set(e, '_id', `${partition}:${e._id}`);
            });
            return new Promise((resolve, reject) => {
                this.db.bulkDocs(docs)
                    .then((result) => {
                        const accepted = [],
                            rejected = [];
                        result.forEach((e) => {
                            if (e.error) {
                                if (typeof partition === 'string') {
                                    set(e, '_id', e.id.split(':')[1]);
                                    unset(e, 'id');
                                }
                                rejected.push(e);
                            } else accepted.push({
                                _id: typeof partition === 'string' ? e.id.split(':')[1] : e.id,
                                _rev: e.rev
                            });
                        })
                        resolve({ accepted, rejected });
                    })
                    .catch((error) => reject({
                        error: `Could not upsert documents`,
                        dbError: error
                    }));
            });
        }

        this.findMany = (filter = {}, opts = {}, partition) => {
            return new Promise((resolve, reject) => {
                opts = new Options(opts, filter);
                this.db.find({
                        selector: filter,
                        ...opts
                    })
                    .then((result) => {
                        if (
                            (typeof partition === 'string' &&
                                Array.isArray(opts.fields) &&
                                opts.fields.indexOf('_id') > -1) ||
                            (typeof partition === 'string' &&
                                !Array.isArray(opts.fields))
                        ) {
                            result.docs.forEach((e) => {
                                set(e, '_id', e._id.split(':')[1]);
                            })
                        }
                        resolve(result.docs);
                    })
                    .catch((error) => reject({
                        error: `Could not find documents with filter ${JSON.stringify(filter)}, options ${JSON.stringify(opts)}`,
                        dbError: error
                    }));
            });
        }

        this.findByID = (id, partition) => {
            if (typeof partition == 'string')
                id = `${partition}:${id}`
            return new Promise((resolve, reject) => {
                this.db.get(id)
                    .then((doc) => {
                        if (typeof partition === 'string')
                            set(doc, '_id', id.split(':')[1]);
                        resolve(doc);
                    })
                    .catch((error) => {
                        if (get(error, 'status') === 404) {
                            resolve(null);
                        } else {
                            reject({
                                error: `Could not find documents with _id ${id}`,
                                dbError: error
                            })
                        }
                    })
            });
        }

        this.query = (mapFunc, pouchOpts) => {
            return new Promise((resolve, reject) => {
                this.db.query(mapFunc, pouchOpts)
                    .then((result) => resolve(result.rows))
                    .catch((error) => reject({
                        error: `Could not query documents`,
                        dbError: error
                    }))
            });
        }

        this.delete = (id, partition) => {
            if (typeof partition === 'string')
                id = `${partition}:${id}`;
            return new Promise((resolve, reject) => {
                this.db.get(id)
                    .then((doc) => {
                        if (doc._id && doc._rev)
                            this.db.remove(doc)
                            .then((result) => {
                                resolve({
                                    _id: typeof partition === 'string' ? result.id.split(':')[1] : result.id,
                                    _rev: result.rev
                                })
                            })
                            .catch((error) => { throw error; });
                        else
                            throw 'No such document'
                    })
                    .catch((error) => reject({
                        error: `Could not delete document with _id ${id}`,
                        dbError: error
                    }));
            });
        }
        
        this.sync = () => {
            // return new Promise((resolve, reject) => {
            //     this.remoteDb = new PouchDB('https://127.0.0.1:5984/test2', {skip_setup: true});
            //     this.remoteDb.logIn('nikhil', 'password').then(function (batman) {
            //         console.log("I'm Batman.", batman);
            //     });
            // });
        }

        this.close = () => {
            return new Promise((resolve, reject) => {
                this.db.close()
                    .then(() => resolve())
                    .catch((error) => reject({
                        error: `Could not close database`,
                        dbError: error
                    }));
            });
        }

        // this.promisesReplicateFrom = async () => {

        //     const loginRepo = new Repository("login");
        //     const loginPartition = "USERLOGIN";
        //     let userProfiles = await loginRepo.findMany({ groupType: "userLogin" }, {}, loginPartition);

        //     console.log("inside replicate");
        //         try{
        //             const start = performance.now();
        //             const data =  await this.db.replicate.from(remoteUrl,{

        //                query_params:{agroID: userProfiles[0].profile.clientData._id},
        //               filter: 'DESIGNDOCUMENT/myfilter',
        //               retry: true

      
        //             });
        //           const end = performance.now();
        //           console.log("total time in replication is,", end - start);
        //           return data;       

        //         }catch(err){
        //             console.log("got an error,",err);
        //         }          
        // }

        this.promisesReplicateFrom = async () => {
            return false;
            var remoteDB = new PouchDB('https://127.0.0.1:5984/mobile_learning', {skip_setup: true});
            remoteDB.logIn('nikhil', 'password')
                .then(() => {
                    console.log("Successfully Logged CouchDB");
                })
                .catch((err)=>{
                    console.log('Cannot log to remoteDB: ', err);
                });
            
            return new Promise((resolve, reject) => {
                this.db.replicate.from(remoteUrl)
                    .then((doc) => resolve(doc))
                    .catch((error) => reject({
                        error: `Could not Replicate from database`,
                        dbError: error
                    })
                );
            });
        }
        
        // this.replicateFrom = () => {
        //    return this.db.replicate.from(remoteUrl, { live: true, retry: true })
        // }

        this.destroy = async () => {
            return new Promise((resolve, reject) => {
                this.db.destroy()
                    .then(() => {
                        this.db = new PouchDB(dbName);
                        resolve()
                    })
                    .catch((error) => reject({
                        error: `Could not Destroy the database`,
                        dbError: error
                    }))
            })
        }

    }
}

export default Repository;
export { Options };