import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String,required: true,unique: true},
    password: { type: String, required: true },
    home: { type: String },
    work: { type: String },
    savedRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Route" }]
},{timestamps:true});

export default mongoose.model("User", userSchema);