import mongoose from 'mongoose';
import Debug, { DebugMethod } from '../utils/debug';
import { Config } from '../utils/config';

export default class MongoServer {
    private url: string;
    private at: Date = new Date();

    constructor() {
        this.url = Config.mongoUrl;
    }

    async start() {
        await mongoose.connect(this.url).then(() => {
            Debug(DebugMethod.info, 'Connected to MongoDB in ' + (new Date().getTime() - this.at.getTime()) + 'ms');
        }).catch((err) => {
            Debug(DebugMethod.error, `Error connecting to MongoDB: ${err}`);
        });
    }
}