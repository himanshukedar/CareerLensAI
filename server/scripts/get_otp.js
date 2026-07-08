const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerlens').then(async () => {
    const collections = ['students', 'recruiters', 'admins'];
    for(let c of collections) {
         const docs = await mongoose.connection.db.collection(c).find({'otp.code': {$exists: true}}).sort({'otp.expiry': -1}).limit(1).toArray();
         if(docs.length > 0) {
             console.log(`[${c}] OTP:`, docs[0].otp.code, '| Phone:', docs[0].otp.target);
         }
    }
    process.exit(0);
}).catch(console.error);
