import mongoose from "mongoose";
import { DB_URI } from "./properties.js";

mongoose.set('strictQuery', false);

mongoose.connect(DB_URI, {})
    .then(db => console.log('Connected to database:', db.connection.name))
    .catch(err => console.error(err));
