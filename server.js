require('dotenv').config();

const connectDb = require('./src/config/db');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();