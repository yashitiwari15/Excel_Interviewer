require('dotenv').config();
const { OpenAI } = require('openai');

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const SYSTEM_PROMPT = `You are ExcelBot, an expert Excel interviewer conducting a skills assessment.

// PERSONALITY: Professional, encouraging, conversational like ChatGPT
// GOAL: Assess Excel skills through natural conversation

// CONVERSATION RULES:
// 1. Start with warm introduction and explain the process
// 2. Ask ONE question at a time
// 3. Adapt difficulty based on responses
// 4. Ask intelligent follow-ups: "Why that approach?" "What if data was larger?"
// 5. Keep responses under 100 words
// 6. End each response with a clear question

// SKILL AREAS TO COVER:
// - Basic formulas (SUM, AVERAGE, COUNT)
// - Advanced functions (VLOOKUP, INDEX-MATCH, PIVOT tables)
// - Data analysis and visualization
// - Best practices and optimization

// EVALUATION: Continuously assess technical accuracy, reasoning, and communication.

// Remember: Be conversational, encouraging, and adaptive!`;

// class OpenAIService {
//     constructor() {
//         this.conversations = new Map();
//     }

//     async generateResponse(sessionId, userMessage) {
//         if (!this.conversations.has(sessionId)) {
//             this.conversations.set(sessionId, [
//                 { role: "system", content: SYSTEM_PROMPT }
//             ]);
//         }

//         const conversation = this.conversations.get(sessionId);
//         conversation.push({ role: "user", content: userMessage });

//         try {
//             const response = await openai.chat.completions.create({
//                 model: "gpt-4",
//                 messages: conversation,
//                 temperature: 0.7,
//                 max_tokens: 150
//             });

//             // FIX: Check if response and choices exist
//             if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
//                 throw new Error('Invalid OpenAI response structure');
//             }

//             const botMessage = response.choices[0].message.content;
            
//             // FIX: Check if botMessage exists
//             if (!botMessage) {
//                 throw new Error('No content in OpenAI response');
//             }

//             conversation.push({ role: "assistant", content: botMessage });

//             return {
//                 message: botMessage,
//                 evaluation: await this.evaluateResponse(userMessage, botMessage)
//             };
//         } catch (error) {
//             console.error('OpenAI Error:', error);
            
//             // Better error handling with specific responses
//             let errorMessage = "I'm having trouble processing that. Could you try again?";
            
//             if (error.message.includes('API key')) {
//                 errorMessage = "There seems to be an issue with my configuration. Let me try to help you anyway - could you rephrase your answer?";
//             }
            
//             return {
//                 message: errorMessage,
//                 evaluation: { score: 0, feedback: "Technical error" }
//             };
//         }
//     }

//     async evaluateResponse(userMessage, context) {
//         try {
//             const evalResponse = await openai.chat.completions.create({
//                 model: "gpt-4",
//                 messages: [{
//                     role: "system",
//                     content: `Evaluate this Excel response on 1-10 scale:
//                     Response: "${userMessage}"
//                     Context: "${context}"
                    
//                     Return JSON: {"score": number, "skillLevel": "beginner/intermediate/advanced", "strengths": [], "improvements": []}`
//                 }],
//                 temperature: 0.3,
//                 max_tokens: 100
//             });

//             // FIX: Check response structure here too
//             if (evalResponse && evalResponse.choices && evalResponse.choices[0] && evalResponse.choices[0].message) {
//                 return JSON.parse(evalResponse.choices[0].message.content);
//             } else {
//                 throw new Error('Invalid evaluation response');
//             }
//         } catch (error) {
//             console.error('Evaluation Error:', error);
//             return { 
//                 score: 5, 
//                 skillLevel: "intermediate", 
//                 strengths: ["Participated in conversation"], 
//                 improvements: ["Continue practicing"] 
//             };
//         }
//     }

//     getConversationHistory(sessionId) {
//         return this.conversations.get(sessionId) || [];
//     }

//     generateFinalReport(sessionId) {
//         const conversation = this.conversations.get(sessionId);
//         if (!conversation) return null;

//         return {
//             overallScore: 7,
//             skillLevel: "intermediate",
//             strengths: ["Good engagement", "Clear communication", "Excel formula knowledge"],
//             improvements: ["Practice advanced functions", "Learn pivot tables", "Explore data analysis"],
//             conversationLength: conversation.length
//         };
//     }
// }

// module.exports = new OpenAIService();
const SYSTEM_PROMPT = `You are ExcelBot, an expert Excel interviewer conducting a skills assessment.

PERSONALITY: Professional, encouraging, conversational like ChatGPT
GOAL: Assess Excel skills through natural conversation

CONVERSATION RULES:
1. Ask ONE question at a time
2. Adapt difficulty based on responses
3. Ask intelligent follow-ups based on their answers
4. Keep responses under 100 words
5. Give constructive feedback on incorrect answers

SKILL AREAS TO COVER:
- Basic formulas (SUM, AVERAGE, COUNT)
- Advanced functions (VLOOKUP, INDEX-MATCH, PIVOT tables)
- Data analysis and best practices

EVALUATION: Continuously assess technical accuracy, reasoning, and communication.

Remember: Be conversational, encouraging, and adaptive!`;

class OpenAIService {
    constructor() {
        this.conversations = new Map();
        this.evaluations = new Map(); // Store evaluations per session
    }

    async generateResponse(sessionId, userMessage) {
        if (!this.conversations.has(sessionId)) {
            this.conversations.set(sessionId, [
                { role: "system", content: SYSTEM_PROMPT }
            ]);
            this.evaluations.set(sessionId, []); // Initialize evaluations array
        }

        const conversation = this.conversations.get(sessionId);
        const evaluations = this.evaluations.get(sessionId);
        
        conversation.push({ role: "user", content: userMessage });

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: conversation,
                temperature: 0.7,
                max_tokens: 150
            });

            if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
                throw new Error('Invalid OpenAI response structure');
            }

            const botMessage = response.choices[0].message.content;
            
            if (!botMessage) {
                throw new Error('No content in OpenAI response');
            }

            conversation.push({ role: "assistant", content: botMessage });

            // Get detailed evaluation for this response
            const evaluation = await this.evaluateResponse(userMessage, botMessage, conversation);
            evaluations.push(evaluation); // Store the evaluation

            return {
                message: botMessage,
                evaluation: evaluation
            };
        } catch (error) {
            console.error('OpenAI Error:', error);
            
            const errorEval = { 
                score: 0, 
                skillLevel: "unknown", 
                strengths: [], 
                improvements: ["Technical error occurred"] 
            };
            
            evaluations.push(errorEval);
            
            return {
                message: "I'm having trouble processing that. Could you try again?",
                evaluation: errorEval
            };
        }
    }

    async evaluateResponse(userMessage, botResponse, fullConversation) {
        try {
            const contextMessages = fullConversation.slice(-6); // Last 3 exchanges for context
            
            const evalResponse = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: `You are an Excel skills evaluator. Analyze this response in context:

USER RESPONSE: "${userMessage}"
BOT'S NEXT QUESTION/FEEDBACK: "${botResponse}"
CONVERSATION CONTEXT: ${JSON.stringify(contextMessages)}

Evaluate the user's Excel knowledge based on:
1. Technical accuracy of formulas/concepts
2. Depth of understanding
3. Ability to explain reasoning
4. Problem-solving approach

Score 1-10 where:
- 1-3: Incorrect/no understanding
- 4-6: Partial understanding/basic knowledge
- 7-8: Good understanding with minor gaps
- 9-10: Excellent understanding/advanced knowledge

Return JSON only:
{
  "score": number,
  "skillLevel": "beginner|intermediate|advanced", 
  "technicalAccuracy": number,
  "understanding": number,
  "communication": number,
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "reasoning": "Brief explanation of the score"
}`
                }],
                temperature: 0.2,
                max_tokens: 200
            });

            if (evalResponse && evalResponse.choices && evalResponse.choices[0] && evalResponse.choices[0].message) {
                const evaluation = JSON.parse(evalResponse.choices[0].message.content);
                
                // Ensure all required fields exist
                return {
                    score: evaluation.score || 5,
                    skillLevel: evaluation.skillLevel || "intermediate",
                    technicalAccuracy: evaluation.technicalAccuracy || evaluation.score || 5,
                    understanding: evaluation.understanding || evaluation.score || 5,
                    communication: evaluation.communication || evaluation.score || 5,
                    strengths: evaluation.strengths || ["Participated in conversation"],
                    improvements: evaluation.improvements || ["Continue practicing"],
                    reasoning: evaluation.reasoning || "Standard evaluation"
                };
            } else {
                throw new Error('Invalid evaluation response');
            }
        } catch (error) {
            console.error('Evaluation Error:', error);
            
            // Fallback: Basic scoring based on keywords
            const hasFormula = /[=@]/.test(userMessage);
            const hasExcelTerms = /sum|average|vlookup|pivot|formula|cell|range/i.test(userMessage);
            const isLongResponse = userMessage.length > 20;
            
            let score = 3; // Base score
            if (hasFormula) score += 3;
            if (hasExcelTerms) score += 2;
            if (isLongResponse) score += 1;
            
            const skillLevel = score >= 7 ? "advanced" : score >= 5 ? "intermediate" : "beginner";
            
            return {
                score: Math.min(score, 10),
                skillLevel: skillLevel,
                technicalAccuracy: score,
                understanding: score,
                communication: Math.min(score + 1, 10),
                strengths: hasFormula ? ["Shows formula knowledge"] : ["Honest about limitations"],
                improvements: hasFormula ? ["Expand Excel function knowledge"] : ["Learn basic Excel formulas"],
                reasoning: "Fallback evaluation based on response analysis"
            };
        }
    }

    getConversationHistory(sessionId) {
        return this.conversations.get(sessionId) || [];
    }

    generateFinalReport(sessionId) {
    const evaluations = this.evaluations.get(sessionId);
    if (!evaluations || evaluations.length === 0) {
        return {
            overallScore: 5,
            skillLevel: "intermediate",
            strengths: ["Participated in interview"],
            improvements: ["Continue learning Excel"],
            conversationLength: 0,
            detailedBreakdown: {}
        };
    }

    // Calculate weighted averages - FIXED: renamed 'eval' to 'evaluation'
    const totalResponses = evaluations.length;
    
    const avgScore = evaluations.reduce((sum, evaluation) => sum + (evaluation.score || 5), 0) / totalResponses;
    const avgTechnical = evaluations.reduce((sum, evaluation) => sum + (evaluation.technicalAccuracy || evaluation.score || 5), 0) / totalResponses;
    const avgUnderstanding = evaluations.reduce((sum, evaluation) => sum + (evaluation.understanding || evaluation.score || 5), 0) / totalResponses;
    const avgCommunication = evaluations.reduce((sum, evaluation) => sum + (evaluation.communication || evaluation.score || 5), 0) / totalResponses;

    // Determine overall skill level
    let overallSkillLevel = "beginner";
    if (avgScore >= 7) overallSkillLevel = "advanced";
    else if (avgScore >= 5) overallSkillLevel = "intermediate";

    // Aggregate strengths and improvements - FIXED: renamed 'eval' to 'evaluation'
    const allStrengths = evaluations.flatMap(evaluation => evaluation.strengths || []);
    const allImprovements = evaluations.flatMap(evaluation => evaluation.improvements || []);
    
    // Remove duplicates and take top items
    const uniqueStrengths = [...new Set(allStrengths)].slice(0, 4);
    const uniqueImprovements = [...new Set(allImprovements)].slice(0, 4);

    return {
        overallScore: Math.round(avgScore * 10) / 10,
        skillLevel: overallSkillLevel,
        strengths: uniqueStrengths.length > 0 ? uniqueStrengths : ["Completed the interview"],
        improvements: uniqueImprovements.length > 0 ? uniqueImprovements : ["Continue practicing Excel"],
        conversationLength: totalResponses,
        detailedBreakdown: {
            technicalAccuracy: Math.round(avgTechnical * 10) / 10,
            understanding: Math.round(avgUnderstanding * 10) / 10,
            communication: Math.round(avgCommunication * 10) / 10,
            totalResponses: totalResponses,
            scoreDistribution: evaluations.map(evaluation => evaluation.score || 5)
        }
    };
}


    // Clear session data
    clearSession(sessionId) {
        this.conversations.delete(sessionId);
        this.evaluations.delete(sessionId);
    }
}

module.exports = new OpenAIService();
