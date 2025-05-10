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
        
        // Eyes
        ctx.fillStyle = '#000';
        
        if (this.direction === 1) {
            ctx.beginPath();
            ctx.arc(25, 12, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(35, 12, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Eyes adjusted for flipped direction
            ctx.beginPath();
            ctx.arc(25, 12, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(35, 12, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Mouth - changes with animation
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
        
        // Character-specific details
        if (this.name === "Dramatic Dave") {
            // Drama mask symbol or hat
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(20, 0, 20, 5); // Small hat or hair
        } else if (this.name === "Tech Tim") {
            // Glasses
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.strokeRect(22, 10, 6, 4); // Left lens
            ctx.strokeRect(32, 10, 6, 4); // Right lens
            ctx.beginPath();
            ctx.moveTo(28, 12);
            ctx.lineTo(32, 12);
            ctx.stroke();
        } else if (this.name === "Fitness Fiona") {
            // Headband
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(15, 5, 30, 3);
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
        this.background = {
            color: '#e9ecef',
            elements: [
                { type: 'ground', color: '#8BC34A', x: 0, y: 380, width: 800, height: 20 },
                { type: 'clouds', color: 'rgba(255, 255, 255, 0.8)', positions: [
                    { x: 50, y: 50, size: 30 },
                    { x: 100, y: 60, size: 25 },
                    { x: 150, y: 55, size: 35 },
                    { x: 500, y: 80, size: 40 },
                    { x: 600, y: 50, size: 30 }
                ]}
            ]
        };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.draw();
    }

    addCharacter(name, sprite) {
        // Calculate positions to avoid overlap
        const existingPositions = Array.from(this.characters.values()).map(char => char.x);
        let x = this.canvas.width / 2 - 30;
        
        // If there are already characters, position the new one with spacing
        if (existingPositions.length > 0) {
            // Find a position that's at least 150px away from any existing character
            const minDistance = 150;
            const step = 50;
            
            for (let i = 0; i < 10; i++) { // Try 10 positions at most
                const leftPos = (this.canvas.width / 2) - (i * step) - 30;
                const rightPos = (this.canvas.width / 2) + (i * step) - 30;
                
                const leftClear = existingPositions.every(pos => Math.abs(pos - leftPos) >= minDistance);
                if (leftClear && leftPos > 50) {
                    x = leftPos;
                    break;
                }
                
                const rightClear = existingPositions.every(pos => Math.abs(pos - rightPos) >= minDistance);
                if (rightClear && rightPos < this.canvas.width - 100) {
                    x = rightPos;
                    break;
                }
            }
        }
        
        const character = new Character(
            name,
            sprite,
            x,
            this.canvas.height - 140 // Position above the ground
        );
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
        this.ctx.fillStyle = '#87CEEB'; // Sky blue
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw clouds
        this.drawClouds();
        
        // Draw ground
        this.ctx.fillStyle = '#8BC34A';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);

        // Draw characters
        this.characters.forEach(character => character.draw(this.ctx));
    }
    
    drawClouds() {
        const clouds = this.background.elements[1];
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