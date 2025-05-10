class Character {
    constructor(name, sprite, x, y) {
        this.name = name;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 80;
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

    draw(ctx) {
        // Draw speech bubble if text exists
        if (this.speechBubble.text && this.speechBubble.visible) {
            this.drawSpeechBubble(ctx);
        }

        ctx.save();
        if (this.direction === -1) {
            ctx.scale(-1, 1);
            ctx.translate(-this.x - this.width, this.y);
        } else {
            ctx.translate(this.x, this.y);
        }
        
        // Draw character body
        ctx.fillStyle = this.sprite.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw character face
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.width/2, 20, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw character expression based on frame
        ctx.fillStyle = '#fff';
        if (this.isMoving) {
            // Draw walking animation
            ctx.fillRect(15, 15, 5, 5);
            ctx.fillRect(30, 15, 5, 5);
        } else {
            // Draw standing expression
            ctx.fillRect(15, 15, 20, 5);
        }
        
        ctx.restore();
    }

    drawSpeechBubble(ctx) {
        const bubble = this.speechBubble;
        const x = this.x + (this.direction === 1 ? this.width + 10 : -bubble.width - 10);
        const y = this.y - 100;
        
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
        ctx.moveTo(x + bubble.width/2, y + bubbleHeight);
        ctx.lineTo(x + bubble.width/2 + 10, y + bubbleHeight + bubble.tailHeight);
        ctx.lineTo(x + bubble.width/2 + 20, y + bubbleHeight);
        ctx.fill();
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        lines.forEach((line, i) => {
            ctx.fillText(line, x + bubble.padding, y + bubble.padding + 15 + i * 20);
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
            elements: []
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
        const character = new Character(
            name,
            sprite,
            this.canvas.width / 2 - 25,
            this.canvas.height - 100
        );
        this.characters.set(name, character);
        this.draw();
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
        this.ctx.fillStyle = this.background.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background elements
        this.background.elements.forEach(element => {
            this.ctx.fillStyle = element.color;
            this.ctx.fillRect(element.x, element.y, element.width, element.height);
        });

        // Draw characters
        this.characters.forEach(character => character.draw(this.ctx));
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