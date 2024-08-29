const mongoose = require('mongoose');

const TickerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    last: {
        type: Number,
        required: true,
    },
    buy: {
        type: Number,
        required: true,
    },
    sell: {
        type: Number,
        required: true,
    },
    volume: {
        type: Number,
        required: true,
    },
    base_unit: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Ticker', TickerSchema);
