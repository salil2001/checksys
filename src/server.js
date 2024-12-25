const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { fetchApplicationData } = require('./dataService');
const { evaluateChecklist } = require('./checklistRules');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/api/checklist/:id', async (req, res) => {
    try {
        const applicationData = await fetchApplicationData(req.params.id);
        const checklistResults = evaluateChecklist(applicationData);
        res.json(checklistResults);
    } catch (error) {
        console.error('Error processing checklist:', error);
        res.status(500).json({ 
            error: 'Failed to process checklist',
            details: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});