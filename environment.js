class Character {
    constructor(name, sprite, x, y) {
        this.name = name;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 120;
        this.speed = 2;
        this.direction = 1; // 1 for right, -1 for left
        this.isMoving = false;
        this.targetX = x;
        this.frame = 0;
        this.frameCount = 4;
        this.frameDelay = 5;
        this.frameCounter = 0;
        this.speechBubble = {
            text: '',
            visible: true,
            width: 200,
            padding: 10,
            tailHeight: 10
        };
        this.thoughtBubble = {
            text: '',
            visible: false,
            width: 200,
            padding: 10
        };
        this.mood = "neutral"; // can be happy, sad, angry, excited, neutral
    }

    update() {
        if (this.isMoving) {
            if (Math.abs(this.x - this.targetX) > this.speed) {
                this.x += this.speed * this.direction;
                this.frameCounter++;
                if (this.frameCounter >= this.frameDelay) {
                    this.frame = (this.frame + 1) % this.frameCount;
                    this.frameCounter = 0;
                }
            } else {
                this.isMoving = false;
                this.frame = 0;
            }
        }
    }

    setProblem(problem) {
        this.speechBubble.text = problem;
    }

    setResponse(response) {
        this.thoughtBubble.text = response;
        this.thoughtBubble.visible = true;
    }

    hideResponse() {
        this.thoughtBubble.visible = false;
    }

    setMood(mood) {
        this.mood = mood;
    }

    draw(ctx) {
        // Draw speech bubble if text exists
        if (this.speechBubble.text && this.speechBubble.visible) {
            this.drawSpeechBubble(ctx);
        }

        // Draw thought bubble if visible
        if (this.thoughtBubble.text && this.thoughtBubble.visible) {
            this.drawThoughtBubble(ctx);
        }

        ctx.save();
        if (this.direction === -1) {
            ctx.scale(-1, 1);
            ctx.translate(-this.x - this.width, this.y);
        } else {
            ctx.translate(this.x, this.y);
        }
        
        // Draw character body with more detail
        this.drawBody(ctx);
        
        ctx.restore();
    }

    drawBody(ctx) {
        // Determine character type from sprite if available
        const characterType = this.sprite.characterType || "default";
        
        // Body
        ctx.fillStyle = this.sprite.color;
        
        // Legs
        ctx.fillRect(10, 70, 12, 50); // Left leg
        ctx.fillRect(38, 70, 12, 50); // Right leg
        
        // Arms based on movement
        if (this.isMoving) {
            // Moving arms
            const armOffset = Math.sin(this.frame * Math.PI/2) * 10;
            ctx.fillRect(0, 35 + armOffset, 10, 30); // Left arm
            ctx.fillRect(50, 35 - armOffset, 10, 30); // Right arm
        } else {
            // Standing arms
            ctx.fillRect(0, 35, 10, 30); // Left arm
            ctx.fillRect(50, 35, 10, 30); // Right arm
        }
        
        // Torso
        ctx.fillRect(10, 30, 40, 40);
        
        // Head
        ctx.fillStyle = '#FFD0B0'; // Skin tone
        ctx.beginPath();
        ctx.arc(30, 15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Character-specific features
        this.drawCharacterFeatures(ctx, characterType);
        
        // Expression based on mood
        this.drawExpression(ctx);
    }
    
    drawCharacterFeatures(ctx, characterType) {
        switch(characterType) {
            case "fitness":
                // Headband and muscular details
                ctx.fillStyle = "#e74c3c";
                ctx.fillRect(15, 5, 30, 3); // Headband
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(15, 40);
                ctx.lineTo(25, 45);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(45, 40);
                ctx.lineTo(35, 45);
                ctx.stroke();
                break;
                
            case "lazy":
                // Messy hair, sleepy eyes
                ctx.fillStyle = "#5f3dc4";
                ctx.fillRect(15, 0, 5, 7);
                ctx.fillRect(25, 0, 7, 4);
                ctx.fillRect(35, 0, 8, 6);
                break;
                
            case "office":
                // Professional tie and glasses
                ctx.fillStyle = "#fa5252";
                ctx.fillRect(28, 35, 4, 15); // Tie
                ctx.fillRect(24, 45, 12, 5); // Tie end
                ctx.strokeStyle = "#343a40";
                ctx.lineWidth = 1;
                ctx.strokeRect(22, 10, 6, 4); // Left lens
                ctx.strokeRect(32, 10, 6, 4); // Right lens
                ctx.beginPath();
                ctx.moveTo(28, 12);
                ctx.lineTo(32, 12);
                ctx.stroke();
                break;
                
            case "skeptical":
                // Raised eyebrow, critical expression
                ctx.fillStyle = "#343a40";
                ctx.beginPath();
                ctx.arc(30, 7, 7, 0, Math.PI, true);
                ctx.stroke();
                break;
                
            case "artistic":
                // Beret and paint splatter
                ctx.fillStyle = "#e74c3c";
                ctx.beginPath();
                ctx.ellipse(30, 1, 15, 7, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#4dabf7";
                ctx.beginPath();
                ctx.arc(38, 5, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case "musical":
                // Headphones and musical notes
                ctx.strokeStyle = "#343a40";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(15, 10, 5, 0.5 * Math.PI, 1.5 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(45, 10, 5, 1.5 * Math.PI, 0.5 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(15, 5);
                ctx.lineTo(45, 5);
                ctx.stroke();
                break;
                
            case "comedy":
                // Bowtie and funny glasses
                ctx.fillStyle = "#fd7e14";
                ctx.fillRect(25, 35, 10, 5); // Bowtie
                ctx.beginPath();
                ctx.moveTo(30, 35);
                ctx.lineTo(20, 30);
                ctx.lineTo(40, 30);
                ctx.closePath();
                ctx.fill();
                break;
                
            case "grumpy":
                // Frown lines and furrowed brow
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(20, 7);
                ctx.lineTo(25, 5);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(40, 7);
                ctx.lineTo(35, 5);
                ctx.stroke();
                break;
                
            case "mediator":
                // Calm expression, suit detail
                ctx.fillStyle = "#1864ab";
                ctx.fillRect(10, 30, 40, 5); // Suit collar
                break;
                
            case "peacemaker":
                // Flower accessory, gentle features
                ctx.fillStyle = "#ff6b6b";
                ctx.beginPath();
                ctx.arc(15, 5, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#ffc078";
                ctx.beginPath();
                ctx.arc(15, 5, 2, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            default:
                // Default features - nothing special
                break;
        }
    }
    
    drawExpression(ctx) {
        // Eyes
        ctx.fillStyle = '#000';
        
        // Default eyes
        ctx.beginPath();
        ctx.arc(25, 12, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(35, 12, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth varies based on mood
        switch(this.mood) {
            case "happy":
                ctx.beginPath();
                ctx.arc(30, 20, 6, 0, Math.PI);
                ctx.stroke();
                break;
                
            case "sad":
                ctx.beginPath();
                ctx.arc(30, 25, 6, Math.PI, Math.PI * 2);
                ctx.stroke();
                break;
                
            case "angry":
                // Angry eyebrows
                ctx.beginPath();
                ctx.moveTo(22, 9);
                ctx.lineTo(28, 7);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(38, 9);
                ctx.lineTo(32, 7);
                ctx.stroke();
                
                // Angry mouth
                ctx.beginPath();
                ctx.moveTo(25, 25);
                ctx.lineTo(35, 25);
                ctx.stroke();
                break;
                
            case "excited":
                // Wide open eyes
                ctx.beginPath();
                ctx.arc(25, 12, 3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(35, 12, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Excited mouth
                ctx.beginPath();
                ctx.arc(30, 22, 5, 0, Math.PI);
                ctx.stroke();
                break;
                
            case "neutral":
            default:
                // Neutral expression
                if (this.isMoving) {
                    ctx.beginPath();
                    ctx.arc(30, 20, 5, 0, Math.PI);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(25, 20);
                    ctx.lineTo(35, 20);
                    ctx.stroke();
                }
                break;
        }
    }

    drawSpeechBubble(ctx) {
        const bubble = this.speechBubble;
        const x = this.x + (this.direction === 1 ? this.width + 10 : -bubble.width - 10);
        const y = this.y - 80;
        
        // Calculate text height
        ctx.font = '14px Comic Sans MS';
        const words = bubble.text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < bubble.width - bubble.padding * 2) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        const textHeight = lines.length * 20;
        const bubbleHeight = textHeight + bubble.padding * 2;
        
        // Draw bubble
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        
        // Bubble body
        ctx.beginPath();
        ctx.roundRect(x, y, bubble.width, bubbleHeight, 10);
        ctx.fill();
        ctx.stroke();
        
        // Bubble tail
        ctx.beginPath();
        if (this.direction === 1) {
            ctx.moveTo(x, y + bubbleHeight/2);
            ctx.lineTo(x - 10, y + bubbleHeight/2 + 5);
            ctx.lineTo(x, y + bubbleHeight/2 + 10);
        } else {
            ctx.moveTo(x + bubble.width, y + bubbleHeight/2);
            ctx.lineTo(x + bubble.width + 10, y + bubbleHeight/2 + 5);
            ctx.lineTo(x + bubble.width, y + bubbleHeight/2 + 10);
        }
        ctx.fill();
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        lines.forEach((line, i) => {
            ctx.fillText(line, x + bubble.padding, y + bubble.padding + 15 + i * 20);
        });
    }

    drawThoughtBubble(ctx) {
        const bubble = this.thoughtBubble;
        const x = this.x + (this.direction === 1 ? -bubble.width - 20 : this.width + 20);
        const y = this.y - 120;
        
        // Calculate text height
        ctx.font = '14px Comic Sans MS';
        const words = bubble.text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < bubble.width - bubble.padding * 2) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        const textHeight = lines.length * 20;
        const bubbleHeight = textHeight + bubble.padding * 2;
        
        // Draw thought bubble (cloud-like)
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#777';
        ctx.lineWidth = 2;
        
        // Main cloud
        ctx.beginPath();
        ctx.ellipse(x + bubble.width/2, y + bubbleHeight/2, bubble.width/2, bubbleHeight/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Small bubbles trailing to character
        const bubbleX = this.direction === 1 ? x + bubble.width/2 + bubble.width/2 - 5 : x - 25;
        const bubbleY = y + bubbleHeight;
        
        const bubbleSizes = [15, 10, 5];
        let offsetX = 0;
        let offsetY = 0;
        
        bubbleSizes.forEach(size => {
            offsetX += (this.direction === 1 ? 15 : -15);
            offsetY += 15;
            
            ctx.beginPath();
            ctx.arc(bubbleX + offsetX, bubbleY + offsetY, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
        
        // Draw text
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        lines.forEach((line, i) => {
            ctx.fillText(line, x + bubble.width/2, y + bubble.padding + 15 + i * 20);
        });
    }

    moveTo(x) {
        this.targetX = x;
        this.direction = x > this.x ? 1 : -1;
        this.isMoving = true;
    }
}

class Environment {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.characters = new Map();
        this.timeOfDay = "afternoon";
        this.background = {
            ground: { color: '#8BC34A', height: 20 },
            sky: this.getSkyColor("afternoon"),
            sun: { x: 150, y: 80, size: 40, color: '#FFEB3B' },
            moon: { x: 650, y: 80, size: 30, color: '#F5F5F5' },
            clouds: {
                color: 'rgba(255, 255, 255, 0.8)', 
                positions: [
                    { x: 50, y: 50, size: 30 },
                    { x: 100, y: 60, size: 25 },
                    { x: 150, y: 55, size: 35 },
                    { x: 500, y: 80, size: 40 },
                    { x: 600, y: 50, size: 30 }
                ]
            },
            stars: []
        };
        
        // Generate stars for night sky
        for (let i = 0; i < 50; i++) {
            this.background.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 200,
                size: Math.random() * 2 + 1
            });
        }
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.draw();
    }

    setTimeOfDay(time) {
        this.timeOfDay = time;
        this.background.sky = this.getSkyColor(time);
        this.draw();
    }
    
    getSkyColor(time) {
        switch(time) {
            case "morning":
                return { color: '#87CEFA', gradient: ['#FF9E80', '#87CEFA'] };
            case "afternoon":
                return { color: '#87CEEB', gradient: null };
            case "evening":
                return { color: '#FF9E80', gradient: ['#FF9E80', '#4A148C'] };
            case "night":
                return { color: '#0D47A1', gradient: ['#0D47A1', '#000000'] };
            default:
                return { color: '#87CEEB', gradient: null };
        }
    }

    addCharacter(name, sprite) {
        return this.addCharacterAt(name, sprite, this.canvas.width / 2 - 30);
    }
    
    addCharacterAt(name, sprite, x) {
        // Calculate positions to avoid overlap
        const existingPositions = Array.from(this.characters.values()).map(char => char.x);
        
        // If there are already characters, check for overlap
        if (existingPositions.length > 0) {
            // Find a position that's at least 100px away from any existing character
            const minDistance = 100;
            let attempt = 0;
            let newX = x;
            
            while (attempt < 5 && existingPositions.some(pos => Math.abs(pos - newX) < minDistance)) {
                // Try to adjust position
                newX = x + (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 50);
                attempt++;
            }
            
            x = newX;
        }
        
        const character = new Character(
            name,
            sprite,
            x,
            this.canvas.height - 140 // Position above the ground
        );
        
        // Determine initial direction based on position
        character.direction = (x > this.canvas.width / 2) ? -1 : 1;
        
        this.characters.set(name, character);
        this.draw();
        return character;
    }

    removeCharacter(name) {
        this.characters.delete(name);
        this.draw();
    }

    getCharacter(name) {
        return this.characters.get(name);
    }

    update() {
        this.characters.forEach(character => character.update());
        this.draw();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.background.sky.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sky gradient if applicable
        if (this.background.sky.gradient) {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, this.background.sky.gradient[0]);
            gradient.addColorStop(1, this.background.sky.gradient[1]);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Draw stars if night
        if (this.timeOfDay === "night") {
            this.drawStars();
        }
        
        // Draw sun or moon
        if (this.timeOfDay === "night") {
            this.drawMoon();
        } else {
            this.drawSun();
        }
        
        // Draw clouds
        this.drawClouds();
        
        // Draw ground
        this.ctx.fillStyle = this.background.ground.color;
        this.ctx.fillRect(0, this.canvas.height - this.background.ground.height, 
                         this.canvas.width, this.background.ground.height);

        // Draw characters
        this.characters.forEach(character => character.draw(this.ctx));
    }
    
    drawSun() {
        const sun = this.background.sun;
        let y = sun.y;
        
        // Adjust sun position based on time of day
        if (this.timeOfDay === "morning") {
            y = sun.y + 20;
        } else if (this.timeOfDay === "evening") {
            y = this.canvas.height - 150;
        }
        
        // Draw sun
        this.ctx.fillStyle = sun.color;
        this.ctx.beginPath();
        this.ctx.arc(sun.x, y, sun.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw sun rays
        this.ctx.strokeStyle = sun.color;
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const length = sun.size * 0.5;
            const start = sun.size + 5;
            const end = start + length;
            
            this.ctx.beginPath();
            this.ctx.moveTo(
                sun.x + Math.cos(angle) * start,
                y + Math.sin(angle) * start
            );
            this.ctx.lineTo(
                sun.x + Math.cos(angle) * end,
                y + Math.sin(angle) * end
            );
            this.ctx.stroke();
        }
    }
    
    drawMoon() {
        const moon = this.background.moon;
        
        // Draw moon
        this.ctx.fillStyle = moon.color;
        this.ctx.beginPath();
        this.ctx.arc(moon.x, moon.y, moon.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw moon craters
        this.ctx.fillStyle = '#E0E0E0';
        this.ctx.beginPath();
        this.ctx.arc(moon.x - 10, moon.y - 5, moon.size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(moon.x + 7, moon.y + 10, moon.size * 0.15, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(moon.x + 5, moon.y - 7, moon.size * 0.1, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawStars() {
        this.ctx.fillStyle = '#FFFFFF';
        this.background.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawClouds() {
        const clouds = this.background.clouds;
        this.ctx.fillStyle = clouds.color;
        
        clouds.positions.forEach(cloud => {
            // Draw cloud as a group of circles
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
            this.ctx.arc(cloud.x - cloud.size, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size/2, cloud.y - cloud.size/2, cloud.size * 0.6, 0, Math.PI * 2);
            this.ctx.arc(cloud.x - cloud.size/2, cloud.y - cloud.size/2, cloud.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize environment when the page loads
let environment;
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('characterCanvas');
    environment = new Environment(canvas);
    environment.animate();
}); 