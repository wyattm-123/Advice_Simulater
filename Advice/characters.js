const characters = {
    "Dramatic Dave": {
        description: "A high school drama student who takes everything way too seriously. Always in the middle of some theatrical crisis.",
        personality: "dramatic",
        emoji: "🎭",
        currentProblem: "My best friend borrowed my favorite prop sword and won't give it back! The school play is tomorrow!",
        responsePatterns: {
            positive: [
                "Oh my stars! That's absolutely brilliant advice! *dramatic swoon*",
                "I shall take this wisdom to heart and perform it with the utmost passion!",
                "This is the most profound solution I've ever heard! *wipes away a single tear*"
            ],
            negative: [
                "But... but... that's not dramatic enough! *collapses onto fainting couch*",
                "I need something more... theatrical! *gestures wildly*",
                "Surely there must be a more dramatic solution? *strikes a pose*"
            ]
        }
    },
    "Tech Tim": {
        description: "A socially awkward tech genius who sees everything as a programming problem.",
        personality: "logical",
        emoji: "💻",
        currentProblem: "My robot vacuum keeps trying to clean my cat, and now my cat is plotting revenge!",
        responsePatterns: {
            positive: [
                "Interesting solution. Let me optimize that algorithm...",
                "That's a valid approach. I'll implement it in the next iteration.",
                "Efficient solution. Adding to my knowledge base."
            ],
            negative: [
                "Error 404: Solution not found. Please try again.",
                "That solution doesn't follow proper programming protocols.",
                "Invalid input. Requires more logical parameters."
            ]
        }
    },
    "Fitness Fiona": {
        description: "An overly enthusiastic fitness instructor who turns everything into a workout opportunity.",
        personality: "energetic",
        emoji: "💪",
        currentProblem: "My yoga mat keeps running away from me during class!",
        responsePatterns: {
            positive: [
                "YES! Let's turn this into a core workout! *flexes muscles*",
                "That's the spirit! Time to get those gains!",
                "Perfect solution! Now let's do 20 reps of it!"
            ],
            negative: [
                "But where's the cardio in that solution?",
                "We need more energy! More power! More reps!",
                "That's not going to help with our fitness goals!"
            ]
        }
    }
};

// Function to get a random response based on character personality and advice sentiment
function getCharacterResponse(character, advice) {
    const characterData = characters[character];
    // Simple sentiment analysis (you can make this more sophisticated)
    const isPositiveAdvice = advice.toLowerCase().includes('try') || 
                            advice.toLowerCase().includes('help') || 
                            advice.toLowerCase().includes('suggest');
    
    const responses = isPositiveAdvice ? 
        characterData.responsePatterns.positive : 
        characterData.responsePatterns.negative;
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Function to get character's current problem
function getCharacterProblem(character) {
    return characters[character].currentProblem;
}

// Function to get all character names
function getCharacterNames() {
    return Object.keys(characters);
}

// Function to get character details
function getCharacterDetails(character) {
    return characters[character];
} 