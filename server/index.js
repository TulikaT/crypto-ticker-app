const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Ticker = require('./models/Ticker');
const cors = require('cors');
const cron = require('node-cron');

dotenv.config();

const app = express();

app.use(cors());

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
    });
}

cron.schedule('*/10 * * * *', async () => {
    console.log('Fetching and storing data...');
    await fetchAndStoreData();
});
 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const fetchAndStoreData = async () => {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const tickers = response.data;

        // Get top 10 tickers
        const topTickers = Object.values(tickers).slice(0, 11);

        // Clear existing data
        await Ticker.deleteMany({});

        // Store new data
        topTickers.forEach(async (tickerData) => {
            const ticker = new Ticker({
                name: tickerData.name,
                last: parseFloat(tickerData.last),
                buy: parseFloat(tickerData.buy),
                sell: parseFloat(tickerData.sell),
                volume: parseFloat(tickerData.volume),
                base_unit: tickerData.base_unit,
            });
            await ticker.save();
        });

        console.log('Data fetched and stored successfully');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

fetchAndStoreData();

app.get('/api/tickers', async (req, res) => {
    try {
        const tickers = await Ticker.find({});
        res.json(tickers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
