import mongoose, { Error } from 'mongoose';

const connectToMongoDB= async ()  =>{
  try{
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("connected to MongoDB");
  }catch(error){
    console.error("error connecting to mongoDB",error.message);
  } 
};
export default connectToMongoDB;