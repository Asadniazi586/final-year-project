import mongoose from "mongoose";

const connectDb = async ()=>{
    mongoose.connection.on('connected',()=>{
        console.log('connected to db');
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/alfazal`)
}

export default connectDb