const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://qa-gb.api.dynamatix.com:3100';

async function fetchApplicationData(id = '67339ae56d5231c1a2c63639') {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/applications/getApplicationById/${id}`);
        
        if (!response.data) {
            throw new Error('No data received from API');
        }

        return response.data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw new Error(`Failed to fetch application data: ${error.message}`);
    }
}

module.exports = { fetchApplicationData };
