const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');
const { v4: uuidv4 } = require('uuid');

// Start new interview session
router.post('/start', (req, res) => {
    const sessionId = uuidv4();
    res.json({ 
        sessionId,
        message: "Hi! I'm ExcelBot, your Excel skills interviewer. I'm here to assess your Excel knowledge through a friendly conversation. Ready to begin? Let's start with something simple - how would you calculate the sum of cells A1 to A10?"
    });
});

// Send message and get response
router.post('/message', async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        
        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Session ID and message required' });
        }

        const response = await openaiService.generateResponse(sessionId, message);
        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get final report
router.get('/report/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const report = openaiService.generateFinalReport(sessionId);
    
    if (!report) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(report);
});

module.exports = router;
