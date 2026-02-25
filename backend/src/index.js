import dotenv from 'dotenv';
import connectDB from './db/db.js';
import app from './app.js';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
    await connectDB();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.PORT || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1); // Exit process with failure
    }
};

startServer();
