import mongoose, { Error } from 'mongoose';

const connectToMongoDB= async ()  =>{
  try{
    await mongoose.connect(process.env.MONGO_DB_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    console.log("connected to MongoDB");
  }catch(error){
    console.error("error connecting to mongoDB",error.message);
  } 
};
export default connectToMongoDB;