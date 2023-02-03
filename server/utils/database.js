import mongoose from "mongoose";
import { print, printError } from "./functions.js";
import { DB_URI } from "./properties.js";

mongoose.set('strictQuery', false); 

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})  
    .then(db => print(`Connected to database: ${db.connection.name}`))
    .catch(err => printError(err));

