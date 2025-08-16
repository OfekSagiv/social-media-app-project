require('dotenv').config();
const connectDB = require('./db');
const app = require('./app');


const port = process.env.PORT || 3001;

(async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Listening: http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
})();
