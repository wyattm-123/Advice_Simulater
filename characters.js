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

class Character {
    constructor(name, type, color, x, y) {
        this.name = name;
        this.type = type;
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 120;
        this.speed = 2;
        this.direction = 1; // 1 for right, -1 for left
        this.isMoving = false;
        this.frame = 0;
        this.frameCount = 4;
        this.frameDelay = 5;
        this.frameCounter = 0;
        
        // Speech and thought bubbles
        this.speechBubble = {
            text: '',
            visible: false,
            width: 200,
            padding: 10
        };
        
        this.thoughtBubble = {
            text: '',
            visible: false,
            width: 200,
            padding: 10
        };
        
        // Animation state
        this.animation = {
            bounce: 0,
            breathe: 0,
            squash: 0,
            stretch: 0
        };
        
        // Interaction state
        this.interaction = {
            isBeingDragged: false,
            isDraggable: true,
            dragOffsetX: 0,
            dragOffsetY: 0
        };
        
        // Visual details
        this.details = {
            skinColor: this.generateSkinTone(),
            hairColor: this.generateHairColor(),
            clothesColor: color,
            eyeColor: this.generateEyeColor()
        };
    }
    
    generateSkinTone() {
        const skinTones = [
            '#FFE0BD', // Light
            '#F1C27D', // Medium
            '#C68642', // Dark
        ];
        return skinTones[Math.floor(Math.random() * skinTones.length)];
    }
    
    generateHairColor() {
        const hairColors = [
            '#090806', // Black
            '#A56B46', // Brown
            '#D8C078', // Blonde
            '#B55239'  // Red/Auburn
        ];
        return hairColors[Math.floor(Math.random() * hairColors.length)];
    }
    
    generateEyeColor() {
        const eyeColors = [
            '#634e34', // Brown
            '#2e536f', // Blue
            '#3d671d'  // Green
        ];
        return eyeColors[Math.floor(Math.random() * eyeColors.length)];
    }
    
    update() {
        // Update animation values
        this.animation.bounce = Math.sin(Date.now() / 500) * 2;
        this.animation.breathe = Math.sin(Date.now() / 1000) * 0.05;
        
        // Update frame for walking animation
        if (this.isMoving) {
            this.frameCounter++;
            if (this.frameCounter >= this.frameDelay) {
                this.frame = (this.frame + 1) % this.frameCount;
                this.frameCounter = 0;
            }
        }
        
        // Decay squash and stretch
        if (this.animation.squash > 0) {
            this.animation.squash *= 0.9;
        }
        if (this.animation.stretch > 0) {
            this.animation.stretch *= 0.9;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Apply position and direction
        if (this.direction === -1) {
            ctx.scale(-1, 1);
            ctx.translate(-(this.x + this.width), this.y);
        } else {
            ctx.translate(this.x, this.y);
        }
        
        // Apply squash and stretch
        if (this.animation.squash > 0 || this.animation.stretch > 0) {
            ctx.translate(this.width/2, this.height/2);
            ctx.scale(1 - this.animation.squash, 1 + this.animation.stretch);
            ctx.translate(-this.width/2, -this.height/2);
        }
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
            this.width/2,
            this.height - 5 + this.animation.bounce,
            this.width/2,
            10,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Draw body
        this.drawBody(ctx);
        
        // Draw speech bubble if visible
        if (this.speechBubble.visible && this.speechBubble.text) {
            this.drawSpeechBubble(ctx);
        }
        
        // Draw thought bubble if visible
        if (this.thoughtBubble.visible && this.thoughtBubble.text) {
            this.drawThoughtBubble(ctx);
        }
        
        ctx.restore();
    }
    
    drawBody(ctx) {
        const breatheFactor = 1 + this.animation.breathe;
        
        // Draw legs
        ctx.fillStyle = this.details.clothesColor;
        ctx.fillRect(10, 70, 12, 50); // Left leg
        ctx.fillRect(38, 70, 12, 50); // Right leg
        
        // Draw arms
        ctx.fillStyle = this.details.skinColor;
        if (this.isMoving) {
            const armOffset = Math.sin(this.frame * Math.PI/2) * 10;
            ctx.fillRect(0, 35 + armOffset, 10, 30); // Left arm
            ctx.fillRect(50, 35 - armOffset, 10, 30); // Right arm
        } else {
            ctx.fillRect(0, 35, 10, 30); // Left arm
            ctx.fillRect(50, 35, 10, 30); // Right arm
        }
        
        // Draw torso
        ctx.fillStyle = this.details.clothesColor;
        ctx.fillRect(10, 30, 40, 40);
        
        // Draw head
        ctx.fillStyle = this.details.skinColor;
        ctx.beginPath();
        ctx.arc(30, 15, 15 * breatheFactor, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = this.details.eyeColor;
        ctx.beginPath();
        ctx.arc(25, 12, 2, 0, Math.PI * 2);
        ctx.arc(35, 12, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw mouth
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(30, 20, 5, 0, Math.PI);
        ctx.stroke();
    }
    
    drawSpeechBubble(ctx) {
        const padding = this.speechBubble.padding;
        const text = this.speechBubble.text;
        const maxWidth = this.speechBubble.width - padding * 2;
        
        ctx.font = '14px Arial';
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        // Word wrap
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        // Calculate bubble dimensions
        const lineHeight = 20;
        const bubbleHeight = lines.length * lineHeight + padding * 2;
        const bubbleWidth = this.speechBubble.width;
        
        // Draw bubble
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Draw bubble background
        ctx.beginPath();
        ctx.roundRect(
            -bubbleWidth/2,
            -bubbleHeight - 20,
            bubbleWidth,
            bubbleHeight,
            10
        );
        ctx.fill();
        ctx.stroke();
        
        // Draw tail
        ctx.beginPath();
        ctx.moveTo(-10, -20);
        ctx.lineTo(0, 0);
        ctx.lineTo(10, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        lines.forEach((line, i) => {
            ctx.fillText(
                line,
                0,
                -bubbleHeight + padding + i * lineHeight
            );
        });
    }
    
    drawThoughtBubble(ctx) {
        // Similar to speech bubble but with circular bubbles
        const text = this.thoughtBubble.text;
        const maxWidth = this.thoughtBubble.width - this.thoughtBubble.padding * 2;
        
        ctx.font = '14px Arial';
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        const lineHeight = 20;
        const bubbleHeight = lines.length * lineHeight + this.thoughtBubble.padding * 2;
        const bubbleWidth = this.thoughtBubble.width;
        
        // Draw main bubble
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.ellipse(
            -bubbleWidth/2 + bubbleWidth/2,
            -bubbleHeight - 30,
            bubbleWidth/2,
            bubbleHeight/2,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();
        
        // Draw trailing bubbles
        const bubbleSizes = [10, 7, 4];
        let offsetY = -15;
        bubbleSizes.forEach(size => {
            ctx.beginPath();
            ctx.arc(0, offsetY, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            offsetY += 10;
        });
        
        // Draw text
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        lines.forEach((line, i) => {
            ctx.fillText(
                line,
                0,
                -bubbleHeight - 30 + this.thoughtBubble.padding + i * lineHeight
            );
        });
    }
    
    containsPoint(x, y) {
        const localX = x - this.x;
        const localY = y - this.y;
        
        return (
            localX >= 0 &&
            localX <= this.width &&
            localY >= 0 &&
            localY <= this.height
        );
    }
    
    startDrag(mouseX, mouseY) {
        if (this.interaction.isDraggable) {
            this.interaction.isBeingDragged = true;
            this.interaction.dragOffsetX = this.x - mouseX;
            this.interaction.dragOffsetY = this.y - mouseY;
        }
    }
    
    drag(mouseX, mouseY) {
        if (this.interaction.isBeingDragged) {
            this.x = mouseX + this.interaction.dragOffsetX;
            this.y = mouseY + this.interaction.dragOffsetY;
        }
    }
    
    endDrag() {
        this.interaction.isBeingDragged = false;
    }
    
    speak(text) {
        this.speechBubble.text = text;
        this.speechBubble.visible = true;
        this.thoughtBubble.visible = false;
    }
    
    think(text) {
        this.thoughtBubble.text = text;
        this.thoughtBubble.visible = true;
        this.speechBubble.visible = false;
    }
    
    clearBubbles() {
        this.speechBubble.visible = false;
        this.thoughtBubble.visible = false;
    }
}

// Character definitions
const characterTypes = {
    fitness: {
        name: "Fitness Fiona",
        color: "#FF5252",
        description: "Always energetic and ready for a workout"
    },
    artist: {
        name: "Creative Carl",
        color: "#7C4DFF",
        description: "Sees beauty in everything"
    },
    chef: {
        name: "Chef Charlie",
        color: "#FF9800",
        description: "Makes the best neighborhood BBQ"
    },
    gardener: {
        name: "Garden Grace",
        color: "#4CAF50",
        description: "Has a green thumb and shares fresh vegetables"
    },
    musician: {
        name: "Musical Maya",
        color: "#2196F3",
        description: "Brings melody to the neighborhood"
    }
}; 