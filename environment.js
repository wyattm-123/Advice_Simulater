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
            tailHeight: 10,
            lastPosition: { x: 0, y: 0 } // Track last position to avoid flicker
        };
        this.thoughtBubble = {
            text: '',
            visible: false,
            width: 200,
            padding: 10,
            lastPosition: { x: 0, y: 0 } // Track last position to avoid flicker
        };
        this.mood = "neutral"; // can be happy, sad, angry, excited, neutral
        this.shadow = {
            visible: true,
            offset: 5
        };
        this.animation = {
            bounce: 0,
            breathe: 0
        };
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

        // Update animation values for breathing and subtle bounce
        this.animation.bounce = Math.sin(Date.now() / 500) * 2;
        this.animation.breathe = Math.sin(Date.now() / 1000) * 0.05;
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
        
        // Calculate bubble dimensions
        ctx.font = '14px Comic Sans MS';
        const words = bubble.text.split(' ');
        const lines = [];
        let currentLine = words[0] || "";
        
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
        
        // Calculate initial bubble position
        let x = this.x + (this.direction === 1 ? this.width + 10 : -bubble.width - 10);
        let y = this.y - 80;
        
        // Ensure bubble stays within canvas bounds
        const canvas = ctx.canvas;
        if (x < 10) x = 10;
        if (x + bubble.width > canvas.width - 10) x = canvas.width - bubble.width - 10;
        if (y < 10) y = 10;
        if (y + bubbleHeight > this.y - 10) y = this.y - bubbleHeight - 10;
        
        // Adjust bubble position to avoid overlapping with other characters
        // This is handled by positioning characters with addCharacterAt in the Environment class
        
        // Draw bubble
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        
        // Bubble body
        ctx.beginPath();
        ctx.roundRect(x, y, bubble.width, bubbleHeight, 10);
        ctx.fill();
        ctx.stroke();
        
        // Bubble tail - connect to character based on relative positions
        ctx.beginPath();
        
        // Calculate tail position
        const tailBase = {
            x: this.direction === 1 ? 
                Math.max(x, this.x + this.width/2) : 
                Math.min(x + bubble.width, this.x + this.width/2),
            y: y + bubbleHeight
        };
        
        const characterTop = {
            x: this.x + this.width/2,
            y: this.y
        };
        
        // Draw tail pointing to character head
        if (tailBase.y < characterTop.y) {
            // Bubble is above character
            ctx.moveTo(tailBase.x, tailBase.y);
            ctx.lineTo(characterTop.x, characterTop.y - 15);
            ctx.lineTo(tailBase.x + (this.direction === 1 ? 15 : -15), tailBase.y);
        } else {
            // Bubble is beside character
            const sideTail = this.direction === 1 ? 
                { x: x, y: y + bubbleHeight/2 } : 
                { x: x + bubble.width, y: y + bubbleHeight/2 };
            
            ctx.moveTo(sideTail.x, sideTail.y);
            ctx.lineTo(this.x + (this.direction === 1 ? this.width : 0), this.y + 20);
            ctx.lineTo(sideTail.x, sideTail.y + 10);
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
        
        // Calculate text dimensions
        ctx.font = '14px Comic Sans MS';
        const words = bubble.text.split(' ');
        const lines = [];
        let currentLine = words[0] || "";
        
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
        
        // Calculate initial position (on opposite side of speech bubble)
        let x = this.x + (this.direction === 1 ? -bubble.width - 20 : this.width + 20);
        let y = this.y - 120;
        
        // Ensure bubble stays within canvas bounds
        const canvas = ctx.canvas;
        if (x < 10) x = 10;
        if (x + bubble.width > canvas.width - 10) x = canvas.width - bubble.width - 10;
        if (y < 10) y = 10;
        if (y + bubbleHeight > this.y - 10) y = this.y - bubbleHeight - 10;
        
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
        const bubbleX = this.direction === 1 ? x + bubble.width : x;
        const bubbleY = y + bubbleHeight;
        
        const bubbleSizes = [15, 10, 5];
        let offsetX = 0;
        let offsetY = 0;
        
        bubbleSizes.forEach(size => {
            offsetX += (this.direction === 1 ? 15 : -15);
            offsetY += 15;
            
            // Make sure trailing bubbles don't go off-screen
            const circleX = bubbleX + offsetX;
            const circleY = bubbleY + offsetY;
            
            if (circleX > 5 && circleX < canvas.width - 5 && 
                circleY > 5 && circleY < canvas.height - 5) {
                ctx.beginPath();
                ctx.arc(circleX, circleY, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
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
            ground: { 
                color: '#8BC34A',
                height: 20,
                grassDetails: true
            },
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
            stars: [],
            buildings: [
                { x: 50, width: 100, height: 120, color: '#E57373', windows: 6 },
                { x: 200, width: 120, height: 160, color: '#81C784', windows: 8 },
                { x: 360, width: 80, height: 100, color: '#64B5F6', windows: 4 },
                { x: 480, width: 140, height: 180, color: '#FFB74D', windows: 10 },
                { x: 660, width: 110, height: 130, color: '#BA68C8', windows: 7 }
            ],
            trees: [
                { x: 150, size: 35 },
                { x: 320, size: 40 },
                { x: 430, size: 30 },
                { x: 600, size: 45 }
            ],
            birds: []
        };
        
        // Generate stars for night sky
        for (let i = 0; i < 50; i++) {
            this.background.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 200,
                size: Math.random() * 2 + 1,
                twinkle: Math.random() > 0.7
            });
        }
        
        // Generate birds
        for (let i = 0; i < 5; i++) {
            this.background.birds.push({
                x: Math.random() * this.canvas.width,
                y: 50 + Math.random() * 100,
                size: 5 + Math.random() * 5,
                speed: 1 + Math.random() * 2,
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Track occupied positions for character placement
        this.occupiedPositions = [];
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
                return { 
                    color: '#87CEFA', 
                    gradient: ['#FF9E80', '#87CEFA'],
                    atmosphere: {
                        hazeColor: 'rgba(255, 228, 181, 0.3)',
                        hasHaze: true
                    }
                };
            case "afternoon":
                return { 
                    color: '#87CEEB', 
                    gradient: null,
                    atmosphere: {
                        hazeColor: null,
                        hasHaze: false
                    }
                };
            case "evening":
                return { 
                    color: '#FF9E80', 
                    gradient: ['#FF9E80', '#4A148C'],
                    atmosphere: {
                        hazeColor: 'rgba(255, 111, 0, 0.2)',
                        hasHaze: true
                    }
                };
            case "night":
                return { 
                    color: '#0D47A1', 
                    gradient: ['#0D47A1', '#000000'],
                    atmosphere: {
                        hazeColor: 'rgba(13, 71, 161, 0.5)',
                        hasHaze: true
                    }
                };
            default:
                return { 
                    color: '#87CEEB', 
                    gradient: null,
                    atmosphere: {
                        hazeColor: null,
                        hasHaze: false
                    }
                };
        }
    }

    addCharacter(name, sprite) {
        return this.addCharacterAt(name, sprite, this.canvas.width / 2 - 30);
    }
    
    addCharacterAt(name, sprite, x) {
        // Calculate positions to avoid overlap and ensure bubbles don't overlap
        this.updateOccupiedPositions();
        
        // Calculate optimal position
        const characterWidth = 60;
        const bubbleWidth = 200;
        const minDistance = bubbleWidth + 30; // Ensure enough space for bubbles
        
        // Try to find an unoccupied position
        let newX = x;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            // Check if this position would cause overlap
            let overlaps = false;
            
            for (const pos of this.occupiedPositions) {
                if (Math.abs(newX - pos) < minDistance) {
                    overlaps = true;
                    break;
                }
            }
            
            // Also check if the bubbles would go off-screen
            const leftEdgeWithBubble = newX - bubbleWidth;
            const rightEdgeWithBubble = newX + characterWidth + bubbleWidth;
            
            if (leftEdgeWithBubble < 10 || rightEdgeWithBubble > this.canvas.width - 10) {
                overlaps = true;
            }
            
            if (!overlaps) {
                break;
            }
            
            // Try a new position - alternate left and right of original
            const offset = (attempts % 2 === 0 ? 1 : -1) * ((Math.floor(attempts / 2) + 1) * minDistance);
            newX = x + offset;
            
            attempts++;
        }
        
        // If we couldn't find a good position, just use the best approximation
        if (attempts === maxAttempts) {
            newX = Math.max(bubbleWidth + 10, Math.min(this.canvas.width - bubbleWidth - characterWidth - 10, x));
        }
        
        // Create the character at the calculated position
        const character = new Character(
            name,
            sprite,
            newX,
            this.canvas.height - 140 // Position above the ground
        );
        
        // Determine initial direction based on position
        character.direction = (newX > this.canvas.width / 2) ? -1 : 1;
        
        // Add to the list of characters
        this.characters.set(name, character);
        
        // Update occupied positions
        this.updateOccupiedPositions();
        
        this.draw();
        return character;
    }
    
    updateOccupiedPositions() {
        this.occupiedPositions = Array.from(this.characters.values()).map(char => char.x);
    }

    removeCharacter(name) {
        this.characters.delete(name);
        this.updateOccupiedPositions();
        this.draw();
    }

    getCharacter(name) {
        return this.characters.get(name);
    }

    update() {
        // Update birds
        this.updateBirds();
        
        // Update characters
        this.characters.forEach(character => character.update());
        
        this.draw();
    }
    
    updateBirds() {
        this.background.birds.forEach(bird => {
            // Move birds
            bird.x += bird.speed * bird.direction;
            
            // Wrap around when they leave the screen
            if (bird.x > this.canvas.width + 20) {
                bird.x = -20;
            } else if (bird.x < -20) {
                bird.x = this.canvas.width + 20;
            }
        });
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
        
        // Draw buildings (skyline)
        this.drawBuildings();
        
        // Draw clouds
        this.drawClouds();
        
        // Draw trees
        this.drawTrees();
        
        // Draw birds if not night
        if (this.timeOfDay !== "night") {
            this.drawBirds();
        }
        
        // Draw ground
        this.drawGround();
        
        // Draw atmosphere haze if needed
        if (this.background.sky.atmosphere && this.background.sky.atmosphere.hasHaze) {
            this.drawAtmosphericHaze();
        }

        // Draw characters
        this.characters.forEach(character => character.draw(this.ctx));
    }
    
    drawAtmosphericHaze() {
        const haze = this.background.sky.atmosphere;
        this.ctx.fillStyle = haze.hazeColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawBuildings() {
        const buildings = this.background.buildings;
        
        buildings.forEach(building => {
            // Draw building
            this.ctx.fillStyle = this.adjustColorForTimeOfDay(building.color);
            this.ctx.fillRect(
                building.x, 
                this.canvas.height - building.height - this.background.ground.height, 
                building.width, 
                building.height
            );
            
            // Draw windows
            const windowWidth = 10;
            const windowHeight = 15;
            const windowsPerRow = Math.floor(building.width / (windowWidth + 5));
            const rows = Math.floor(building.height / (windowHeight + 10));
            
            this.ctx.fillStyle = this.timeOfDay === "night" ? 
                'rgba(255, 255, 155, 0.8)' : 'rgba(225, 225, 225, 0.8)';
            
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < windowsPerRow; col++) {
                    // Random chance of window being lit at night
                    if (this.timeOfDay === "night" && Math.random() > 0.4) {
                        this.ctx.fillRect(
                            building.x + 5 + col * (windowWidth + 5),
                            this.canvas.height - building.height - this.background.ground.height + 10 + row * (windowHeight + 10),
                            windowWidth,
                            windowHeight
                        );
                    } else if (this.timeOfDay !== "night") {
                        this.ctx.fillRect(
                            building.x + 5 + col * (windowWidth + 5),
                            this.canvas.height - building.height - this.background.ground.height + 10 + row * (windowHeight + 10),
                            windowWidth,
                            windowHeight
                        );
                    }
                }
            }
        });
    }
    
    adjustColorForTimeOfDay(color) {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        if (this.timeOfDay === "night") {
            // Darken colors at night
            return `rgb(${Math.floor(r*0.4)}, ${Math.floor(g*0.4)}, ${Math.floor(b*0.5)})`;
        } else if (this.timeOfDay === "evening") {
            // Orange tint in evening
            return `rgb(${Math.min(255, Math.floor(r*1.1))}, ${Math.floor(g*0.9)}, ${Math.floor(b*0.8)})`;
        } else if (this.timeOfDay === "morning") {
            // Slight pink tint in morning
            return `rgb(${Math.min(255, Math.floor(r*1.05))}, ${Math.floor(g*0.95)}, ${Math.floor(b*1.0)})`;
        }
        
        return color;
    }
    
    drawTrees() {
        const trees = this.background.trees;
        
        trees.forEach(tree => {
            // Draw trunk
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(
                tree.x - 5,
                this.canvas.height - this.background.ground.height - tree.size * 2,
                10,
                tree.size * 2
            );
            
            // Draw foliage
            this.ctx.fillStyle = this.adjustColorForTimeOfDay('#2E7D32');
            this.ctx.beginPath();
            this.ctx.moveTo(tree.x, this.canvas.height - this.background.ground.height - tree.size * 2 - tree.size);
            this.ctx.lineTo(tree.x - tree.size, this.canvas.height - this.background.ground.height - tree.size * 1.5);
            this.ctx.lineTo(tree.x + tree.size, this.canvas.height - this.background.ground.height - tree.size * 1.5);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.moveTo(tree.x, this.canvas.height - this.background.ground.height - tree.size * 3);
            this.ctx.lineTo(tree.x - tree.size * 0.8, this.canvas.height - this.background.ground.height - tree.size * 1.8);
            this.ctx.lineTo(tree.x + tree.size * 0.8, this.canvas.height - this.background.ground.height - tree.size * 1.8);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.moveTo(tree.x, this.canvas.height - this.background.ground.height - tree.size * 4);
            this.ctx.lineTo(tree.x - tree.size * 0.6, this.canvas.height - this.background.ground.height - tree.size * 2.5);
            this.ctx.lineTo(tree.x + tree.size * 0.6, this.canvas.height - this.background.ground.height - tree.size * 2.5);
            this.ctx.closePath();
            this.ctx.fill();
        });
    }
    
    drawBirds() {
        this.ctx.fillStyle = '#333';
        
        this.background.birds.forEach(bird => {
            // Simple bird drawing - two curved lines
            this.ctx.beginPath();
            this.ctx.moveTo(bird.x, bird.y);
            this.ctx.quadraticCurveTo(
                bird.x + bird.size * (bird.direction), 
                bird.y - bird.size,
                bird.x + bird.size * 2 * (bird.direction),
                bird.y
            );
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(bird.x, bird.y);
            this.ctx.quadraticCurveTo(
                bird.x - bird.size * (bird.direction), 
                bird.y - bird.size,
                bird.x - bird.size * 2 * (bird.direction),
                bird.y
            );
            this.ctx.stroke();
        });
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
        
        // Draw sun glow
        const gradient = this.ctx.createRadialGradient(
            sun.x, y, sun.size/2,
            sun.x, y, sun.size*2
        );
        gradient.addColorStop(0, this.timeOfDay === "evening" ? 'rgba(255,140,0,0.8)' : 'rgba(255,236,59,0.8)');
        gradient.addColorStop(1, 'rgba(255,236,59,0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(sun.x, y, sun.size*2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw sun
        this.ctx.fillStyle = this.timeOfDay === "evening" ? '#FF8C00' : sun.color;
        this.ctx.beginPath();
        this.ctx.arc(sun.x, y, sun.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw sun rays
        this.ctx.strokeStyle = this.timeOfDay === "evening" ? '#FF8C00' : sun.color;
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
        
        // Draw moon glow
        const gradient = this.ctx.createRadialGradient(
            moon.x, moon.y, moon.size/2,
            moon.x, moon.y, moon.size*2
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(moon.x, moon.y, moon.size*2, 0, Math.PI * 2);
        this.ctx.fill();
        
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
        this.background.stars.forEach(star => {
            // Some stars twinkle
            const size = star.twinkle ? 
                star.size * (0.8 + Math.sin(Date.now() / 500) * 0.2) : 
                star.size;
            
            // Draw star glow
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, size/2,
                star.x, star.y, size*2
            );
            gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, size*2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw star
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawClouds() {
        const clouds = this.background.clouds;
        this.ctx.fillStyle = clouds.color;
        
        clouds.positions.forEach(cloud => {
            // Draw cloud as a group of circles with more details
            this.ctx.beginPath();
            
            // Main cloud part
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
            this.ctx.arc(cloud.x - cloud.size, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size/2, cloud.y - cloud.size/2, cloud.size * 0.6, 0, Math.PI * 2);
            this.ctx.arc(cloud.x - cloud.size/2, cloud.y - cloud.size/2, cloud.size * 0.5, 0, Math.PI * 2);
            
            // Additional details for fuller clouds
            this.ctx.arc(cloud.x + cloud.size*1.5, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
            this.ctx.arc(cloud.x - cloud.size*1.2, cloud.y + cloud.size*0.2, cloud.size * 0.5, 0, Math.PI * 2);
            
            this.ctx.fill();
            
            // Add subtle shadow to bottom
            this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
            this.ctx.beginPath();
            this.ctx.ellipse(
                cloud.x, 
                cloud.y + cloud.size*0.4, 
                cloud.size*2.5, 
                cloud.size*0.3, 
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
            
            // Reset color for next cloud
            this.ctx.fillStyle = clouds.color;
        });
    }
    
    drawGround() {
        // Draw main ground
        this.ctx.fillStyle = this.adjustColorForTimeOfDay(this.background.ground.color);
        this.ctx.fillRect(
            0, 
            this.canvas.height - this.background.ground.height, 
            this.canvas.width, 
            this.background.ground.height
        );
        
        // Draw grass details if enabled
        if (this.background.ground.grassDetails) {
            this.ctx.fillStyle = this.adjustColorForTimeOfDay('#4CAF50');
            
            // Draw individual grass blades
            for (let x = 0; x < this.canvas.width; x += 5) {
                const height = 3 + Math.random() * 5;
                this.ctx.fillRect(
                    x, 
                    this.canvas.height - this.background.ground.height - height,
                    2,
                    height
                );
            }
            
            // Draw path in the middle
            this.ctx.fillStyle = this.adjustColorForTimeOfDay('#D7CCC8');
            this.ctx.fillRect(
                this.canvas.width/2 - 50,
                this.canvas.height - this.background.ground.height,
                100,
                this.background.ground.height
            );
            
            // Draw path border
            this.ctx.strokeStyle = this.adjustColorForTimeOfDay('#A1887F');
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width/2 - 50, this.canvas.height - this.background.ground.height);
            this.ctx.lineTo(this.canvas.width/2 - 50, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width/2 + 50, this.canvas.height - this.background.ground.height);
            this.ctx.lineTo(this.canvas.width/2 + 50, this.canvas.height);
            this.ctx.stroke();
        }
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