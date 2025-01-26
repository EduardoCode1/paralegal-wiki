const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://Eduardo:Gatosbellos0@paralegal-a.nfevj.mongodb.net/', {
      dbName: 'paralegal',
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected: ' + conn.connection.host);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('Database ping successful');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Log more details about the error
    if (error.name === 'MongoServerError') {
      console.error('MongoDB Server Error Code:', error.code);
      console.error('MongoDB Server Error Message:', error.errmsg);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
