// Character data with appearance and personality details
const characters = {
    "Fitness Fiona": {
        description: "An overly enthusiastic fitness instructor who turns everything into a workout opportunity.",
        personality: "energetic",
        sprite: {
            color: '#51cf66',
            width: 60,
            height: 120,
            characterType: "fitness"
        },
        traits: "Enthusiastic, Morning Person, Health Obsessed",
        catchphrase: "Feel the BURN of SUCCESS!",
        favoriteEmotes: ["💪", "🔥", "⚡", "💯", "🏋️‍♀️"]
    },
    "Lazy Larry": {
        description: "A perpetually sleepy neighbor who believes life is best enjoyed horizontally.",
        personality: "relaxed",
        sprite: {
            color: '#748ffc',
            width: 60,
            height: 120,
            characterType: "lazy"
        },
        traits: "Sleepy, Relaxed, Procrastinator",
        catchphrase: "That sounds like tomorrow's problem...",
        favoriteEmotes: ["😴", "💤", "🛌", "🥱", "☕"]
    },
    "Office Olivia": {
        description: "A busy professional who schedules every minute of her day and lives by her calendar app.",
        personality: "organized",
        sprite: {
            color: '#9775fa',
            width: 60,
            height: 120,
            characterType: "office"
        },
        traits: "Punctual, Practical, Overworked",
        catchphrase: "Let me check if I have time for this...",
        favoriteEmotes: ["📱", "⏰", "📊", "☕", "🤔"]
    },
    "Skeptical Sam": {
        description: "A cynical neighbor who questions everything and believes most neighborhood initiatives are doomed to fail.",
        personality: "cynical",
        sprite: {
            color: '#ffa94d',
            width: 60,
            height: 120,
            characterType: "skeptical"
        },
        traits: "Doubtful, Analytical, Sarcastic",
        catchphrase: "Yeah, we'll see how long THAT lasts.",
        favoriteEmotes: ["🤨", "🙄", "🧐", "👀", "😒"]
    },
    "Artistic Andy": {
        description: "A creative soul who sees the world as his canvas and finds inspiration in everything.",
        personality: "creative",
        sprite: {
            color: '#ff8787',
            width: 60,
            height: 120,
            characterType: "artistic"
        },
        traits: "Creative, Sensitive, Expressive",
        catchphrase: "Life is art, and we are all masterpieces!",
        favoriteEmotes: ["🎨", "🖌️", "✨", "🎭", "👨‍🎨"]
    },
    "Musical Maria": {
        description: "A talented musician who communicates better through melody than words.",
        personality: "harmonious",
        sprite: {
            color: '#da77f2',
            width: 60,
            height: 120,
            characterType: "musical"
        },
        traits: "Melodic, Passionate, Perfectionist",
        catchphrase: "Everything sounds better with the right soundtrack.",
        favoriteEmotes: ["🎻", "🎵", "🎶", "🎹", "🎼"]
    },
    "Comedy Carl": {
        description: "A would-be comedian who finds humor in everything and never misses a chance for a punchline.",
        personality: "humorous",
        sprite: {
            color: '#66d9e8',
            width: 60,
            height: 120,
            characterType: "comedy"
        },
        traits: "Funny, Quick-witted, Attention-seeking",
        catchphrase: "Life's too short not to laugh at it!",
        favoriteEmotes: ["😂", "🤣", "😏", "🎭", "🎪"]
    },
    "Grumpy Greg": {
        description: "A grouchy neighbor who values peace, quiet, and his perfectly manicured lawn.",
        personality: "cranky",
        sprite: {
            color: '#868e96',
            width: 60,
            height: 120,
            characterType: "grumpy"
        },
        traits: "Irritable, Private, Orderly",
        catchphrase: "Back in MY day, neighbors respected BOUNDARIES!",
        favoriteEmotes: ["😠", "🤦‍♂️", "☕", "📢", "⛔"]
    },
    "Mediator Mike": {
        description: "The neighborhood peacekeeper who's always trying to find the middle ground in any conflict.",
        personality: "diplomatic",
        sprite: {
            color: '#4dabf7',
            width: 60,
            height: 120,
            characterType: "mediator"
        },
        traits: "Calm, Reasonable, Diplomatic",
        catchphrase: "I think we can all find a solution that works for everyone.",
        favoriteEmotes: ["✋", "🧠", "🤝", "☮️", "⚖️"]
    },
    "Peacemaker Penny": {
        description: "A sweet and empathetic neighbor who just wants everyone to get along.",
        personality: "nurturing",
        sprite: {
            color: '#f783ac',
            width: 60,
            height: 120,
            characterType: "peacemaker"
        },
        traits: "Kind, Understanding, Supportive",
        catchphrase: "Let's take a deep breath and talk this through.",
        favoriteEmotes: ["😊", "💖", "🌸", "🍵", "🌈"]
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

function getRandomEmote(character) {
    const characterData = characters[character];
    const emotes = characterData.favoriteEmotes;
    return emotes[Math.floor(Math.random() * emotes.length)];
} 