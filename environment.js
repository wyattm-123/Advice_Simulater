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
            breathe: 0,
            attention: 0, // For "getting attention" animation
            attentionDuration: 0
        };
        this.interaction = {
            isBeingDragged: false,
            isDraggable: true,
            hasAttention: false,
            clickable: true,
            clickTime: 0,
            clickDuration: 1000,
            dragOffsetX: 0,
            dragOffsetY: 0
        };
        this.isHighlighted = false; // Add highlight state
        this.highlightAnimTime = 0; // For animating the highlight
        this.decorativeElements = {
            bugs: [],
            particles: [],
            lastUpdateTime: Date.now()
        };
        
        // Generate some decorative elements for the highlight
        this.generateDecorativeElements();
        
        // Character appearance details
        this.details = {
            skinColor: this.generateSkinTone(sprite),
            hairStyle: Math.floor(Math.random() * 5), // 0-4 different hairstyles
            hairColor: this.generateHairColor(sprite),
            clothesColor: sprite.color,
            hasGlasses: Math.random() > 0.7,
            hasBeard: Math.random() > 0.8 && this.sprite.characterType !== "fitness",
            accessoryColor: this.generateAccessoryColor(sprite),
            eyeColor: this.generateEyeColor(),
            bodyType: this.sprite.characterType || "default"
        };
    }

    // Generate random but appropriate skin tone
    generateSkinTone(sprite) {
        const skinTones = [
            '#FFF6E0', // Very Light
            '#FFE0BD', // Light
            '#F1C27D', // Medium
            '#C68642', // Dark
            '#8D5524'  // Very Dark
        ];
        return skinTones[Math.floor(Math.random() * skinTones.length)];
    }
    
    // Generate appropriate hair color
    generateHairColor(sprite) {
        const hairColors = [
            '#090806', // Black
            '#A56B46', // Brown
            '#D8C078', // Blonde
            '#B55239', // Red/Auburn
            '#A8A8A8', // Grey
            sprite.color  // Sometimes match character's theme color
        ];
        
        if (this.sprite.characterType === "grumpy") {
            // More likely to be grey for grumpy character
            return hairColors[4];
        }
        
        return hairColors[Math.floor(Math.random() * hairColors.length)];
    }
    
    // Generate eye color
    generateEyeColor() {
        const eyeColors = [
            '#634e34', // Brown
            '#2e536f', // Blue
            '#3d671d', // Green
            '#634e34', // Hazel (similar to brown)
            '#634e34'  // Dark Brown (making brown more common)
        ];
        return eyeColors[Math.floor(Math.random() * eyeColors.length)];
    }
    
    // Generate accessory color that complements the sprite color
    generateAccessoryColor(sprite) {
        // Convert the sprite color to HSL to manipulate it
        let color = sprite.color;
        // For simplicity, using a contrasting color
        const colors = [
            '#E57373', // Red
            '#81C784', // Green
            '#64B5F6', // Blue
            '#FFD54F', // Yellow
            '#7986CB', // Indigo
            '#4DD0E1'  // Cyan
        ];
        
        // Filter out colors too similar to sprite color
        const filteredColors = colors.filter(c => c !== color);
        return filteredColors[Math.floor(Math.random() * filteredColors.length)];
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
        
        // Update attention animation if active
        if (this.interaction.hasAttention) {
            const elapsed = Date.now() - this.interaction.clickTime;
            if (elapsed < this.interaction.clickDuration) {
                // Scaling factor from 0 to 1 to 0 (peak at 500ms)
                const progress = elapsed / this.interaction.clickDuration;
                const attentionScale = Math.sin(progress * Math.PI);
                this.animation.attention = attentionScale * 10; // Maximum jump height
            } else {
                this.interaction.hasAttention = false;
                this.animation.attention = 0;
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
    
    // Handle getting attention (clicking)
    getAttention() {
        if (this.interaction.clickable) {
            this.interaction.hasAttention = true;
            this.interaction.clickTime = Date.now();
            // Jump and make a happy expression briefly
            const oldMood = this.mood;
            this.mood = "excited";
            
            // Return to original mood after animation
            setTimeout(() => {
                this.mood = oldMood;
            }, this.interaction.clickDuration);
            
            // Show a short reaction in the speech bubble
            const oldText = this.speechBubble.text;
            const reactions = [
                "Hey there!",
                "What's up?",
                "Hi!",
                "Need something?",
                "Yes?",
                "*waves*"
            ];
            this.speechBubble.text = reactions[Math.floor(Math.random() * reactions.length)];
            
            // Return to original text after a delay
            setTimeout(() => {
                this.speechBubble.text = oldText;
            }, 2000);
        }
    }
    
    // Start dragging the character
    startDrag(mouseX, mouseY) {
        if (this.interaction.isDraggable) {
            this.interaction.isBeingDragged = true;
            // Calculate offset between mouse position and character position
            this.interaction.dragOffsetX = this.x - mouseX;
            this.interaction.dragOffsetY = this.y - mouseY;
            
            // Change expression while being dragged
            this.mood = "surprised";
            
            console.log(`Starting drag for ${this.name} at ${mouseX},${mouseY}`);
        }
    }
    
    // Update position while dragging
    drag(mouseX, mouseY) {
        if (this.interaction.isBeingDragged) {
            // Update position based on mouse and offset
            this.x = mouseX + this.interaction.dragOffsetX;
            this.y = mouseY + this.interaction.dragOffsetY;
            
            // Make sure character stays within canvas bounds
            if (this.x < 0) this.x = 0;
            if (this.y < 0) this.y = 0;
            
            // No need to force canvas right/bottom bounds as the canvas scrolls
            console.log(`Dragging ${this.name} to ${this.x},${this.y}`);
        }
    }
    
    // End dragging
    endDrag() {
        if (this.interaction.isBeingDragged) {
            this.interaction.isBeingDragged = false;
            // Return to neutral expression after brief delay
            setTimeout(() => {
                this.mood = "neutral";
            }, 500);
            
            console.log(`End drag for ${this.name}`);
        }
    }
    
    // Check if a point (mouse) is inside the character
    containsPoint(x, y) {
        // Expand the hitbox a bit for easier interaction
        const hitboxPadding = 15;
        
        console.log(`Checking if point (${x}, ${y}) is within character ${this.name} at (${this.x}, ${this.y}) with size ${this.width}x${this.height}`);
        
        const result = (
            x >= this.x - hitboxPadding && 
            x <= this.x + this.width + hitboxPadding && 
            y >= this.y - hitboxPadding && 
            y <= this.y + this.height + hitboxPadding
        );
        
        if (result) {
            console.log(`Point is inside ${this.name}'s hitbox!`);
        }
        
        return result;
    }

    draw(ctx) {
        // Draw shadow under character
        if (this.shadow.visible) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width/2,
                this.y + this.height - 5 + this.animation.bounce,
                this.width/2 + 5,
                10,
                0, 0, Math.PI * 2
            );
            ctx.fill();
        }
        
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
            ctx.translate(-(this.x + this.width), this.y - this.animation.attention);
        } else {
            ctx.translate(this.x, this.y - this.animation.attention);
        }
        
        // Draw highlight effect if character is being interacted with
        this.drawHighlight(ctx);
        
        // Draw attention effect if character has attention
        if (this.interaction.hasAttention) {
            const attentionRadius = 40 * (1 + Math.sin(Date.now() / 100) * 0.2);
            const gradient = ctx.createRadialGradient(
                this.width/2, this.height/2, 10,
                this.width/2, this.height/2, attentionRadius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 100, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.width/2, this.height/2, attentionRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw character body with more detail
        this.drawBody(ctx);
        
        ctx.restore();
    }

    drawBody(ctx) {
        // Determine character type from sprite if available
        const characterType = this.sprite.characterType || "default";
        
        // Factor in breathing animation
        const breatheFactor = 1 + this.animation.breathe;
        
        // Draw the body with much more detail
        
        // Legs
        ctx.fillStyle = this.details.clothesColor;
        ctx.fillRect(10, 70, 12, 50); // Left leg
        ctx.fillRect(38, 70, 12, 50); // Right leg
        
        // Feet
        ctx.fillStyle = '#333';
        ctx.fillRect(6, 117, 16, 5); // Left shoe
        ctx.fillRect(38, 117, 16, 5); // Right shoe
        
        // Arms based on movement
        ctx.fillStyle = this.details.skinColor;
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
        
        // Hands
        ctx.beginPath();
        ctx.arc(5, 65, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(55, 65, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Torso (clothes)
        ctx.fillStyle = this.details.clothesColor;
        ctx.fillRect(10, 30, 40, 40);
        
        // Clothing details vary by character type
        this.drawClothingDetails(ctx, characterType);
        
        // Head with skin tone
        ctx.fillStyle = this.details.skinColor;
        ctx.beginPath();
        ctx.arc(30, 15, 15 * breatheFactor, 0, Math.PI * 2);
        ctx.fill();
        
        // Character-specific features (hair, glasses, etc.)
        this.drawCharacterFeatures(ctx, characterType);
        
        // Expression based on mood
        this.drawExpression(ctx);
    }
    
    drawClothingDetails(ctx, characterType) {
        switch(characterType) {
            case "fitness":
                // Fitness clothing - tank top and athletic shorts
                ctx.fillStyle = '#fff';
                ctx.fillRect(22, 30, 16, 20); // Tank top front
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(10, 70, 12, 30); // Left short
                ctx.fillRect(38, 70, 12, 30); // Right short
                
                // Add fitness wristband
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(0, 35, 5, 8); // Left wristband
                ctx.fillRect(55, 35, 5, 8); // Right wristband
                
                // Add fitness headband
                ctx.fillRect(15, 5, 30, 3);
                
                // Add shoe details
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(6, 117, 3, 5); // Left shoe stripe
                ctx.fillRect(38, 117, 3, 5); // Right shoe stripe
                break;
                
            case "office":
                // Office clothing - suit/blazer with shirt
                ctx.fillStyle = '#fff';
                ctx.fillRect(20, 30, 20, 20); // Shirt
                
                // Add blazer
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(10, 30, 10, 40); // Left side
                ctx.fillRect(40, 30, 10, 40); // Right side
                
                // Add tie
                ctx.fillStyle = this.sprite.color;
                ctx.fillRect(28, 30, 4, 40); // Tie
                
                // Add collar
                ctx.fillStyle = '#fff';
                ctx.fillRect(24, 30, 3, 5); // Left collar
                ctx.fillRect(33, 30, 3, 5); // Right collar
                
                // Add pocket square
                ctx.fillStyle = '#fff';
                ctx.fillRect(42, 35, 5, 5);
                break;
                
            case "lazy":
                // Lazy clothing - t-shirt and sweatpants
                ctx.fillStyle = '#fff';
                ctx.fillRect(15, 30, 30, 40); // Loose t-shirt
                
                // Add shirt text
                ctx.fillStyle = this.details.accessoryColor;
                ctx.font = '8px Arial';
                ctx.fillText('zzz', 25, 45);
                
                // Add baggy pants
                ctx.fillStyle = '#6d6875';
                ctx.fillRect(10, 70, 15, 50); // Left leg
                ctx.fillRect(35, 70, 15, 50); // Right leg
                
                // Add slippers
                ctx.fillStyle = '#ffd166';
                ctx.fillRect(6, 117, 19, 5); // Left slipper
                ctx.fillRect(35, 117, 19, 5); // Right slipper
                break;
                
            case "artistic":
                // Artistic clothing - paint-splattered outfit
                ctx.fillStyle = '#fff';
                ctx.fillRect(15, 30, 30, 40); // Artist smock
                
                // Add paint splatters
                const paintColors = ['#e63946', '#2a9d8f', '#e9c46a', '#264653'];
                for (let i = 0; i < 8; i++) {
                    ctx.fillStyle = paintColors[i % paintColors.length];
                    const x = 15 + Math.random() * 30;
                    const y = 30 + Math.random() * 40;
                    const size = 1 + Math.random() * 3;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Add artist pants
                ctx.fillStyle = '#6d6875';
                ctx.fillRect(10, 70, 12, 50); // Left leg
                ctx.fillRect(38, 70, 12, 50); // Right leg
                
                // Add artist beret
                ctx.fillStyle = this.details.accessoryColor;
                ctx.beginPath();
                ctx.ellipse(35, 5, 15, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case "musical":
                // Musical clothing - stylish outfit with music notes
                ctx.fillStyle = '#fff';
                ctx.fillRect(20, 30, 20, 40); // Shirt
                
                // Add a jacket
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(10, 30, 10, 40); // Left side
                ctx.fillRect(40, 30, 10, 40); // Right side
                
                // Add music note decorations on shirt
                ctx.fillStyle = '#000';
                ctx.font = '10px Arial';
                ctx.fillText('♪', 22, 45);
                ctx.fillText('♫', 32, 55);
                
                // Fancy pants
                ctx.fillStyle = '#000';
                ctx.fillRect(10, 70, 12, 50); // Left leg
                ctx.fillRect(38, 70, 12, 50); // Right leg
                break;
                
            case "comedy":
                // Comedy clothing - bright, colorful outfit
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(15, 30, 30, 40); // Funny shirt
                
                // Add a bowtie
                ctx.fillStyle = '#e63946';
                ctx.fillRect(25, 32, 10, 5);
                ctx.beginPath();
                ctx.arc(25, 34, 5, 0, Math.PI * 2);
                ctx.arc(35, 34, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Add comedy suspenders
                ctx.fillStyle = '#e76f51';
                ctx.fillRect(15, 30, 3, 40); // Left suspender
                ctx.fillRect(42, 30, 3, 40); // Right suspender
                
                // Add colorful pants
                ctx.fillStyle = this.sprite.color;
                ctx.fillRect(10, 70, 12, 50); // Left leg
                ctx.fillRect(38, 70, 12, 50); // Right leg
                
                // Add funny big shoes
                ctx.fillStyle = '#ffba08';
                ctx.fillRect(3, 117, 22, 5); // Left shoe
                ctx.fillRect(35, 117, 22, 5); // Right shoe
                break;
                
            case "grumpy":
                // Grumpy clothing - old-fashioned outfit
                ctx.fillStyle = '#f8f9fa';
                ctx.fillRect(20, 30, 20, 40); // Shirt
                
                // Add a cardigan
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(15, 30, 30, 40); // Cardigan
                ctx.fillStyle = '#f8f9fa';
                ctx.fillRect(20, 30, 20, 40); // Shirt showing through
                
                // Add buttons
                ctx.fillStyle = '#495057';
                ctx.beginPath();
                ctx.arc(30, 40, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(30, 50, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(30, 60, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Add pants with high waist
                ctx.fillStyle = '#adb5bd';
                ctx.fillRect(10, 65, 12, 55); // Left leg (higher waist)
                ctx.fillRect(38, 65, 12, 55); // Right leg (higher waist)
                break;
                
            case "mediator":
                // Mediator clothing - professional but approachable
                ctx.fillStyle = '#fff';
                ctx.fillRect(15, 30, 30, 40); // Shirt
                
                // Add a vest
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(20, 30, 20, 35); // Vest
                
                // Add pants
                ctx.fillStyle = '#343a40';
                ctx.fillRect(10, 70, 12, 50); // Left leg
                ctx.fillRect(38, 70, 12, 50); // Right leg
                
                // Add tie
                ctx.fillStyle = this.sprite.color;
                ctx.fillRect(28, 30, 4, 30); // Tie
                break;
                
            case "skeptical":
                // Skeptical clothing - practical outfit
                ctx.fillStyle = '#ced4da';
                ctx.fillRect(15, 30, 30, 40); // Shirt
                
                // Add jacket
                ctx.fillStyle = this.details.accessoryColor;
                ctx.fillRect(10, 30, 10, 40); // Left side
                ctx.fillRect(40, 30, 10, 40); // Right side
                
                // Add practical pants
                ctx.fillStyle = '#495057';
                ctx.fillRect(10, 70, 12, 50); // Left leg
                ctx.fillRect(38, 70, 12, 50); // Right leg
                
                // Add pocket
                ctx.fillStyle = '#ced4da';
                ctx.fillRect(40, 40, 8, 10); // Side pocket
                break;
                
            case "peacemaker":
                // Peacemaker clothing - soft, calming outfit
                ctx.fillStyle = '#f8edeb';
                ctx.fillRect(15, 30, 30, 40); // Soft top
                
                // Add flowy design
                ctx.fillStyle = this.details.accessoryColor;
                ctx.beginPath();
                ctx.moveTo(15, 35);
                ctx.lineTo(20, 40);
                ctx.lineTo(15, 45);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(45, 35);
                ctx.lineTo(40, 40);
                ctx.lineTo(45, 45);
                ctx.fill();
                
                // Add flowing pants
                ctx.fillStyle = this.sprite.color;
                ctx.fillRect(10, 70, 15, 50); // Left leg - wider
                ctx.fillRect(35, 70, 15, 50); // Right leg - wider
                break;
                
            default:
                // Default clothing - simple tee and pants
                ctx.fillStyle = '#fff';
                ctx.fillRect(20, 30, 20, 30); // T-shirt
                
                // Add pants
                ctx.fillStyle = '#6c757d';
                ctx.fillRect(10, 70, 12, 50); // Left leg
                ctx.fillRect(38, 70, 12, 50); // Right leg
        }
    }
    
    drawCharacterFeatures(ctx, characterType) {
        // Draw hair based on hair style
        this.drawHair(ctx);
        
        // Draw facial features based on mood
        this.drawExpression(ctx);
        
        // Draw glasses if character has them
        if (this.details.hasGlasses) {
            this.drawGlasses(ctx);
        }
        
        // Draw beard if character has one
        if (this.details.hasBeard) {
            this.drawBeard(ctx);
        }
        
        // Character-specific details
        switch(characterType) {
            case "fitness":
                // Draw fitness watch
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 52, 8, 6); // Watch band
                ctx.fillStyle = '#00b4d8';
                ctx.fillRect(2, 53, 4, 4); // Watch face
                
                // Athletic stance - arms slightly out
                ctx.fillStyle = this.details.skinColor;
                if (!this.isMoving) {
                    // Redraw arms in athletic pose when not moving
                    ctx.fillRect(-3, 35, 10, 30); // Left arm more out
                    ctx.fillRect(53, 35, 10, 30); // Right arm more out
                }
                break;
                
            case "lazy":
                // Add sleep mask pushed up on forehead
                ctx.fillStyle = '#000';
                ctx.fillRect(15, 7, 30, 5);
                
                // Add slouched posture
                if (!this.isMoving) {
                    // No need to redraw, the breathing animation already gives slouched look
                }
                break;
                
            case "office":
                // Add watch
                ctx.fillStyle = '#343a40';
                ctx.fillRect(0, 52, 8, 6); // Watch band
                ctx.fillStyle = '#fff';
                ctx.fillRect(2, 53, 4, 4); // Watch face
                
                // Add phone or tablet
                if (!this.isMoving) {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(42, 50, 8, 12); // Phone
                    ctx.fillStyle = '#00b4d8';
                    ctx.fillRect(43, 52, 6, 8); // Screen
                }
                break;
                
            case "artistic":
                // Add paintbrush behind ear
                ctx.fillStyle = '#6d5c43';
                ctx.fillRect(45, 10, 1, 10); // Brush handle
                ctx.fillStyle = '#e63946';
                ctx.fillRect(45, 8, 1, 2); // Brush tip
                
                // Add palette in hand when not moving
                if (!this.isMoving) {
                    ctx.fillStyle = '#6d5c43';
                    ctx.beginPath();
                    ctx.ellipse(5, 55, 8, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Paint spots on palette
                    const paintColors = ['#e63946', '#2a9d8f', '#e9c46a', '#264653'];
                    for (let i = 0; i < 4; i++) {
                        ctx.fillStyle = paintColors[i];
                        ctx.beginPath();
                        ctx.arc(2 + i * 3, 54, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
                
            case "musical":
                // Add headphones
                ctx.fillStyle = '#000';
                ctx.fillRect(10, 10, 5, 3); // Left headphone
                ctx.fillRect(45, 10, 5, 3); // Right headphone
                ctx.fillRect(10, 10, 40, 1); // Headband
                
                // Add music note necklace
                ctx.fillStyle = this.details.accessoryColor;
                ctx.beginPath();
                ctx.arc(30, 40, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(33, 37, 1, 6); // Note stem
                
                // Position for holding instrument when not moving
                if (!this.isMoving) {
                    // No specific pose needed here
                }
                break;
                
            case "comedy":
                // Add novelty bowtie
                ctx.fillStyle = '#ffba08';
                ctx.beginPath();
                ctx.arc(30, 32, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Add comedy prop when not moving
                if (!this.isMoving) {
                    // Fake nose and glasses
                    ctx.fillStyle = '#e63946';
                    ctx.beginPath();
                    ctx.arc(30, 20, 4, 0, Math.PI * 2); // Clown nose
                    ctx.fill();
                }
                break;
                
            case "grumpy":
                // Add reading glasses perched lower on nose
                ctx.fillStyle = '#000';
                ctx.fillRect(20, 22, 20, 1); // Top rim
                ctx.fillRect(20, 22, 1, 5); // Left side
                ctx.fillRect(39, 22, 1, 5); // Right side
                ctx.fillStyle = '#a5d8ff';
                ctx.fillRect(21, 23, 9, 3); // Left lens
                ctx.fillRect(30, 23, 9, 3); // Right lens
                
                // Add cane when not moving
                if (!this.isMoving) {
                    ctx.fillStyle = '#6d5c43';
                    ctx.fillRect(55, 35, 3, 85); // Cane
                    ctx.fillStyle = '#6d5c43';
                    ctx.beginPath();
                    ctx.arc(56, 35, 5, 0, Math.PI, true);
                    ctx.fill();
                }
                break;
                
            case "mediator":
                // Add name badge
                ctx.fillStyle = '#fff';
                ctx.fillRect(35, 35, 10, 6);
                ctx.fillStyle = '#000';
                ctx.fillRect(36, 37, 8, 1);
                ctx.fillRect(36, 39, 4, 1);
                
                // Add clipboard when not moving
                if (!this.isMoving) {
                    ctx.fillStyle = '#e9ecef';
                    ctx.fillRect(46, 45, 10, 15); // Clipboard
                    ctx.fillStyle = '#000';
                    ctx.fillRect(46, 47, 8, 1); // Line 1
                    ctx.fillRect(46, 50, 8, 1); // Line 2
                    ctx.fillRect(46, 53, 8, 1); // Line 3
                }
                break;
                
            case "skeptical":
                // Add notebook in pocket
                ctx.fillStyle = '#fff';
                ctx.fillRect(41, 41, 5, 8);
                
                // Add magnifying glass when not moving
                if (!this.isMoving) {
                    ctx.fillStyle = '#343a40';
                    ctx.fillRect(53, 50, 2, 10); // Handle
                    ctx.beginPath();
                    ctx.arc(59, 50, 5, 0, Math.PI * 2); // Glass
                    ctx.stroke();
                    ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
                    ctx.beginPath();
                    ctx.arc(59, 50, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case "peacemaker":
                // Add flower in hair
                ctx.fillStyle = '#ff006e';
                ctx.beginPath();
                ctx.arc(45, 8, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffbe0b';
                ctx.beginPath();
                ctx.arc(45, 8, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Add peace necklace
                ctx.fillStyle = this.details.accessoryColor;
                ctx.beginPath();
                ctx.arc(30, 35, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(30, 35, 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(30, 33);
                ctx.lineTo(30, 37);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(28, 36);
                ctx.lineTo(32, 36);
                ctx.stroke();
                break;
        }
    }
    
    drawHair(ctx) {
        ctx.fillStyle = this.details.hairColor;
        
        // Different hairstyles based on random selection
        switch (this.details.hairStyle) {
            case 0: // Short hair
                ctx.beginPath();
                ctx.arc(30, 5, 14, 0, Math.PI, true);
                ctx.fill();
                break;
                
            case 1: // Long hair
                ctx.beginPath();
                ctx.arc(30, 5, 14, 0, Math.PI, true);
                ctx.fill();
                // Hair down the sides
                ctx.fillRect(15, 5, 5, 20);
                ctx.fillRect(40, 5, 5, 20);
                break;
                
            case 2: // Spiky hair
                for (let i = 0; i < 7; i++) {
                    ctx.beginPath();
                    ctx.moveTo(16 + i*4, 15);
                    ctx.lineTo(20 + i*4, 0);
                    ctx.lineTo(24 + i*4, 15);
                    ctx.fill();
                }
                break;
                
            case 3: // Parted hair
                ctx.beginPath();
                ctx.arc(22, 10, 8, Math.PI, 0, true);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(38, 10, 8, Math.PI, 0, true);
                ctx.fill();
                break;
                
            case 4: // Bald or very short
                ctx.beginPath();
                ctx.arc(30, 10, 7, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    }
    
    drawGlasses(ctx) {
        ctx.strokeStyle = "#343a40";
        ctx.lineWidth = 1;
        ctx.strokeRect(22, 10, 6, 4); // Left lens
        ctx.strokeRect(32, 10, 6, 4); // Right lens
        ctx.beginPath();
        ctx.moveTo(28, 12);
        ctx.lineTo(32, 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(22, 12);
        ctx.lineTo(18, 14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(38, 12);
        ctx.lineTo(42, 14);
        ctx.stroke();
    }
    
    drawBeard(ctx) {
        ctx.fillStyle = this.details.hairColor;
        ctx.beginPath();
        ctx.arc(30, 23, 10, 0, Math.PI);
        ctx.fill();
        
        // Add some texture to the beard
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(22 + i*4, 23);
            ctx.lineTo(22 + i*4, 28 + i%2);
            ctx.stroke();
        }
    }
    
    drawExpression(ctx) {
        // Eyes
        ctx.fillStyle = this.details.eyeColor;
        
        // Eye whiteness
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(25, 12, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(35, 12, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = this.details.eyeColor;
        
        // Eye position based on if being dragged
        const eyeOffsetX = this.interaction.isBeingDragged ? 1 : 0;
        const eyeOffsetY = this.interaction.isBeingDragged ? 1 : 0;
        
        ctx.beginPath();
        ctx.arc(25 + eyeOffsetX, 12 + eyeOffsetY, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(35 + eyeOffsetX, 12 + eyeOffsetY, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth varies based on mood
        switch(this.mood) {
            case "happy":
                // Big smile
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(30, 20, 8, 0, Math.PI);
                ctx.stroke();
                break;
                
            case "sad":
                // Sad frown
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(30, 25, 8, Math.PI, Math.PI * 2);
                ctx.stroke();
                break;
                
            case "angry":
                // Angry eyebrows
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
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
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(25, 12, 4, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(35, 12, 4, 0, Math.PI * 2);
                ctx.stroke();
                
                // Open mouth
                ctx.beginPath();
                ctx.arc(30, 22, 5, 0, Math.PI);
                ctx.stroke();
                
                // Surprised eyebrows
                ctx.beginPath();
                ctx.moveTo(22, 7);
                ctx.lineTo(28, 5);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(32, 5);
                ctx.lineTo(38, 7);
                ctx.stroke();
                break;
                
            case "surprised":
                // Surprised 'O' mouth
                ctx.beginPath();
                ctx.arc(30, 22, 6, 0, Math.PI * 2);
                ctx.stroke();
                
                // Raised eyebrows
                ctx.beginPath();
                ctx.moveTo(22, 8);
                ctx.lineTo(28, 6);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(32, 6);
                ctx.lineTo(38, 8);
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
        if (!this.speechBubble.text) return;
        
        const padding = this.speechBubble.padding;
        const bubbleWidth = this.speechBubble.width;
        const lineHeight = 20;
        const cornerRadius = 10;
        const tailWidth = 20;
        const tailHeight = this.speechBubble.tailHeight;
        
        // Calculate text metrics
        ctx.font = '14px Arial';
        
        // Wrap text to fit in bubble width
        const words = this.speechBubble.text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > bubbleWidth - padding * 2) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        // Calculate bubble dimensions
        const bubbleHeight = lines.length * lineHeight + padding * 2;
        
        // Determine best position for speech bubble (avoid going off canvas)
        const canvasWidth = ctx.canvas.width;
        const bubbleX = this.x + this.width / 2;
        
        // Position left or right of character based on position in canvas
        let bubbleCenterX;
        let tailDirectionRight; // true if tail points right, false if points left
        
        if (bubbleX < canvasWidth / 2) {
            // Character is on left side of canvas, place bubble to the right
            bubbleCenterX = this.x + this.width + bubbleWidth / 2;
            tailDirectionRight = false; // Tail points left
        } else {
            // Character is on right side, place bubble to the left
            bubbleCenterX = this.x - bubbleWidth / 2;
            tailDirectionRight = true; // Tail points right
        }
        
        // Ensure bubble stays within canvas
        if (bubbleCenterX - bubbleWidth / 2 < 10) {
            bubbleCenterX = bubbleWidth / 2 + 10;
        } else if (bubbleCenterX + bubbleWidth / 2 > canvasWidth - 10) {
            bubbleCenterX = canvasWidth - bubbleWidth / 2 - 10;
        }
        
        // Position bubble vertically above character
        const bubbleCenterY = this.y - bubbleHeight / 2 - 20;
        
        // Remember the last valid position to avoid flickering
        if (isNaN(bubbleCenterX) || isNaN(bubbleCenterY)) {
            bubbleCenterX = this.speechBubble.lastPosition.x;
            bubbleCenterY = this.speechBubble.lastPosition.y;
        } else {
            this.speechBubble.lastPosition.x = bubbleCenterX;
            this.speechBubble.lastPosition.y = bubbleCenterY;
        }
        
        // Start drawing the speech bubble
        const bubbleLeft = bubbleCenterX - bubbleWidth / 2;
        const bubbleTop = bubbleCenterY - bubbleHeight / 2;
        
        ctx.save();
        
        // Add 3D effect with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Draw bubble with rounded corners
        ctx.fillStyle = 'white';
        ctx.beginPath();
        
        // Top-left corner
        ctx.moveTo(bubbleLeft + cornerRadius, bubbleTop);
        
        // Top edge and top-right corner
        ctx.lineTo(bubbleLeft + bubbleWidth - cornerRadius, bubbleTop);
        ctx.quadraticCurveTo(bubbleLeft + bubbleWidth, bubbleTop, 
                           bubbleLeft + bubbleWidth, bubbleTop + cornerRadius);
        
        // Right edge and bottom-right corner
        ctx.lineTo(bubbleLeft + bubbleWidth, bubbleTop + bubbleHeight - cornerRadius);
        ctx.quadraticCurveTo(bubbleLeft + bubbleWidth, bubbleTop + bubbleHeight, 
                           bubbleLeft + bubbleWidth - cornerRadius, bubbleTop + bubbleHeight);
        
        // Bottom edge and tail
        const tailBaseX = tailDirectionRight ? 
            this.x + this.width / 2 : // Tail on right side of character
            bubbleLeft; // Tail on left side of bubble
            
        const tailTipX = tailDirectionRight ?
            this.x + this.width / 2 - tailWidth / 2 : // Tail points to right side of character
            this.x + this.width / 2; // Tail points to center of character
            
        const tailBaseLeftX = tailDirectionRight ?
            tailBaseX - tailWidth : tailBaseX;
            
        const tailBaseRightX = tailDirectionRight ?
            tailBaseX : tailBaseX + tailWidth;
        
        if (tailDirectionRight) {
            // Tail points to the right
            ctx.lineTo(tailBaseRightX + cornerRadius, bubbleTop + bubbleHeight);
            ctx.lineTo(tailTipX, bubbleTop + bubbleHeight + tailHeight);
            ctx.lineTo(tailBaseLeftX, bubbleTop + bubbleHeight);
        } else {
            // Tail points to the left
            ctx.lineTo(tailBaseRightX, bubbleTop + bubbleHeight);
            ctx.lineTo(tailTipX, bubbleTop + bubbleHeight + tailHeight);
            ctx.lineTo(tailBaseLeftX + cornerRadius, bubbleTop + bubbleHeight);
        }
        
        // Bottom-left corner
        ctx.lineTo(bubbleLeft + cornerRadius, bubbleTop + bubbleHeight);
        ctx.quadraticCurveTo(bubbleLeft, bubbleTop + bubbleHeight, 
                           bubbleLeft, bubbleTop + bubbleHeight - cornerRadius);
        
        // Left edge and top-left corner
        ctx.lineTo(bubbleLeft, bubbleTop + cornerRadius);
        ctx.quadraticCurveTo(bubbleLeft, bubbleTop, 
                           bubbleLeft + cornerRadius, bubbleTop);
        
        ctx.closePath();
        ctx.fill();
        
        // Add subtle gradient for more dimension
        const gradient = ctx.createLinearGradient(
            bubbleLeft, bubbleTop,
            bubbleLeft, bubbleTop + bubbleHeight
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(1, 'rgba(240, 240, 240, 0.7)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw text
        ctx.fillStyle = '#333';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        lines.forEach((line, index) => {
            const textY = bubbleTop + padding + lineHeight * (index + 0.5);
            ctx.fillText(line, bubbleLeft + padding, textY);
        });
        
        ctx.restore();
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

    // Generate decorative elements for the highlight effect
    generateDecorativeElements() {
        // Add bugs that move around the highlight
        for (let i = 0; i < 5; i++) {
            this.decorativeElements.bugs.push({
                angle: Math.random() * Math.PI * 2,
                speed: 0.01 + Math.random() * 0.02,
                size: 2 + Math.random() * 3,
                color: `hsl(${Math.floor(Math.random() * 60) + 20}, 100%, 50%)`,
                offset: Math.random() * 5,
                wingPhase: Math.random() * Math.PI
            });
        }
        
        // Add floating particles
        for (let i = 0; i < 15; i++) {
            this.decorativeElements.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 1 + Math.random() * 2,
                color: `rgba(255, ${Math.floor(Math.random() * 200) + 50}, 0, ${0.3 + Math.random() * 0.4})`,
                speed: 0.2 + Math.random() * 0.3,
                angle: Math.random() * Math.PI * 2
            });
        }
    }
    
    // Update the decorative elements
    updateDecorativeElements() {
        const now = Date.now();
        const elapsed = (now - this.decorativeElements.lastUpdateTime) / 1000;
        this.decorativeElements.lastUpdateTime = now;
        
        // Update bugs
        this.decorativeElements.bugs.forEach(bug => {
            bug.angle += bug.speed;
            bug.wingPhase += 0.2;
        });
        
        // Update particles
        this.decorativeElements.particles.forEach(particle => {
            particle.y -= particle.speed;
            particle.x += Math.sin(particle.angle) * 0.3;
            particle.angle += 0.05;
            
            // Reset particles that go off screen
            if (particle.y < 0) {
                particle.y = this.height;
                particle.x = Math.random() * this.width;
            }
        });
    }
    
    // Draw the highlight and decorative elements
    drawHighlight(ctx) {
        if (!this.isHighlighted) return;
        
        this.highlightAnimTime += 0.03;
        
        // Draw pulsing outline
        const pulseScale = 1 + Math.sin(this.highlightAnimTime) * 0.05;
        const glowSize = 5 + Math.sin(this.highlightAnimTime * 2) * 2;
        
        ctx.save();
        
        // Create a clipping path around the character
        ctx.beginPath();
        ctx.rect(
            -glowSize, 
            -glowSize, 
            this.width + glowSize * 2, 
            this.height + glowSize * 2
        );
        
        // Draw orange glow around character
        const gradient = ctx.createLinearGradient(
            0, 0,
            0, this.height
        );
        gradient.addColorStop(0, 'rgba(255, 165, 0, 0.6)');
        gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0.6)');
        
        ctx.shadowColor = 'rgba(255, 140, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 3;
        ctx.strokeStyle = gradient;
        
        // Draw the outline with a pulsing effect
        ctx.beginPath();
        ctx.rect(
            -2, 
            -2, 
            this.width + 4, 
            this.height + 4
        );
        ctx.stroke();
        
        // Draw dashed animated border
        ctx.setLineDash([5, 3]);
        ctx.lineDashOffset = -this.highlightAnimTime * 10;
        ctx.beginPath();
        ctx.rect(
            -4, 
            -4, 
            this.width + 8, 
            this.height + 8
        );
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Update decorative elements
        this.updateDecorativeElements();
        
        // Draw bugs moving around the outline
        this.decorativeElements.bugs.forEach(bug => {
            const radius = Math.max(this.width, this.height) / 2 + 10;
            const bugX = this.width / 2 + Math.cos(bug.angle) * radius + bug.offset;
            const bugY = this.height / 2 + Math.sin(bug.angle) * radius + bug.offset;
            
            // Draw bug body
            ctx.fillStyle = bug.color;
            ctx.beginPath();
            ctx.ellipse(bugX, bugY, bug.size, bug.size * 1.5, bug.angle, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw bug wings
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            const wingSpread = Math.sin(bug.wingPhase) * bug.size * 1.5;
            
            // Left wing
            ctx.beginPath();
            ctx.ellipse(
                bugX - Math.cos(bug.angle + Math.PI/2) * wingSpread,
                bugY - Math.sin(bug.angle + Math.PI/2) * wingSpread,
                bug.size * 1.2,
                bug.size * 0.8,
                bug.angle + Math.PI/4,
                0, Math.PI * 2
            );
            ctx.fill();
            
            // Right wing
            ctx.beginPath();
            ctx.ellipse(
                bugX + Math.cos(bug.angle + Math.PI/2) * wingSpread,
                bugY + Math.sin(bug.angle + Math.PI/2) * wingSpread,
                bug.size * 1.2,
                bug.size * 0.8,
                bug.angle - Math.PI/4,
                0, Math.PI * 2
            );
            ctx.fill();
        });
        
        // Draw floating particles
        this.decorativeElements.particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
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
        
        // Add interaction state
        this.interaction = {
            activeCharacter: null,
            isDragging: false,
            isPlaying: false
        };
        
        // Add mouse event listeners for character interaction
        // Explicitly bind the event handlers to this instance
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        // Remove any existing listeners to prevent duplicates
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        this.canvas.removeEventListener('touchcancel', this.handleTouchEnd);
        
        // Add new listeners
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.handleMouseUp);
        
        // Add touch event listeners for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
        this.canvas.addEventListener('touchcancel', this.handleTouchEnd);
        
        // Set cursor to pointer when hovering over a character
        this.canvas.style.cursor = 'default';
        
        // Log setup for debugging
        console.log('Environment initialized with canvas:', this.canvas);
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
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
    
    // Track mouse coordinates relative to canvas
    getMouseCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    
    // Handle mouse down event (start interaction)
    handleMouseDown(event) {
        // Don't interact if a story is playing
        if (this.interaction.isPlaying) return;
        
        const coords = this.getMouseCoordinates(event);
        const mouseX = coords.x;
        const mouseY = coords.y;
        
        // Check if mouse is over any character
        let foundCharacter = false;
        
        // Process characters in reverse order (top-most first)
        const characters = Array.from(this.characters.entries()).reverse();
        
        for (const [name, character] of characters) {
            if (character.containsPoint(mouseX, mouseY)) {
                this.interaction.activeCharacter = character;
                this.interaction.isDragging = true;
                character.startDrag(mouseX, mouseY);
                
                // Create ripple effect at click position
                this.createRippleEffect(mouseX, mouseY);
                foundCharacter = true;
                break;
            }
        }
        
        console.log(`Mouse down at ${mouseX},${mouseY} - Found character: ${foundCharacter ? this.interaction.activeCharacter.name : 'none'}`);
    }
    
    // Handle mouse move event (drag character)
    handleMouseMove(event) {
        const coords = this.getMouseCoordinates(event);
        const mouseX = coords.x;
        const mouseY = coords.y;
        
        // Update cursor based on hover state
        let isOverCharacter = false;
        let hoveredCharacter = null;
        
        for (const [name, character] of this.characters) {
            if (character.containsPoint(mouseX, mouseY)) {
                isOverCharacter = true;
                hoveredCharacter = character;
                break;
            }
        }
        
        // Update cursor style
        if (this.interaction.isDragging) {
            this.canvas.style.cursor = 'grabbing';
            document.body.classList.add('character-dragging');
        } else {
            this.canvas.style.cursor = isOverCharacter ? 'pointer' : 'default';
            document.body.classList.remove('character-dragging');
        }
        
        // Show tooltip with character name on hover
        this.updateCharacterTooltip(hoveredCharacter, mouseX, mouseY);
        
        // Update character position if dragging
        if (this.interaction.isDragging && this.interaction.activeCharacter) {
            this.interaction.activeCharacter.drag(mouseX, mouseY);
            this.updateCharacterHighlight();
        }
    }
    
    // Handle mouse up event (end interaction)
    handleMouseUp(event) {
        // Remove any character tooltips when releasing mouse
        const existingTooltip = document.querySelector('.character-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        if (this.interaction.activeCharacter) {
            const coords = this.getMouseCoordinates(event);
            const mouseX = coords.x;
            const mouseY = coords.y;
            
            // If it was a quick click (not a drag), get character's attention
            if (!this.interaction.isDragging || 
                (Math.abs(this.interaction.activeCharacter.x - mouseX) < 5 && 
                 Math.abs(this.interaction.activeCharacter.y - mouseY) < 5)) {
                this.interaction.activeCharacter.getAttention();
            }
            
            // End the drag operation
            this.interaction.activeCharacter.endDrag();
            this.interaction.activeCharacter = null;
        }
        
        this.interaction.isDragging = false;
        document.body.classList.remove('character-dragging');
    }
    
    // Update the isPlaying state
    setPlayingState(isPlaying) {
        this.interaction.isPlaying = isPlaying;
    }
    
    // Update the character draw method to add a highlight when being dragged
    updateCharacterHighlight() {
        this.characters.forEach(character => {
            character.isHighlighted = character === this.interaction.activeCharacter;
        });
    }
    
    // Update the tooltip showing character info on hover
    updateCharacterTooltip(character, x, y) {
        // Remove any existing tooltip
        const existingTooltip = document.querySelector('.character-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create new tooltip if hovering over a character
        if (character && !this.interaction.isDragging) {
            const tooltip = document.createElement('div');
            tooltip.className = 'character-tooltip';
            tooltip.textContent = character.name;
            
            // Position relative to the environment section
            const envSection = this.canvas.closest('.environment-section');
            const envRect = envSection ? envSection.getBoundingClientRect() : this.canvas.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            
            tooltip.style.left = `${canvasRect.left + x}px`;
            tooltip.style.top = `${canvasRect.top + y - 30}px`;
            
            document.body.appendChild(tooltip);
            
            // Fade in effect with visible class
            requestAnimationFrame(() => {
                tooltip.classList.add('visible');
            });
        }
    }
    
    // Create a ripple effect at the given position
    createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        this.canvas.parentNode.appendChild(ripple);
        
        // Remove after animation completes
        setTimeout(() => {
            if (this.canvas.parentNode.contains(ripple)) {
                this.canvas.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Touch event handlers
    handleTouchStart(event) {
        event.preventDefault(); // Prevent scrolling
        
        if (this.interaction.isPlaying) return;
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;
            
            console.log(`Touch start at ${touchX},${touchY}`);
            
            // Check if touch is over any character
            const characters = Array.from(this.characters.entries()).reverse();
            
            for (const [name, character] of characters) {
                if (character.containsPoint(touchX, touchY)) {
                    this.interaction.activeCharacter = character;
                    this.interaction.isDragging = true;
                    character.startDrag(touchX, touchY);
                    
                    // Create ripple effect at touch position
                    this.createRippleEffect(touchX, touchY);
                    break;
                }
            }
        }
    }
    
    handleTouchMove(event) {
        event.preventDefault(); // Prevent scrolling
        
        if (event.touches.length === 1 && this.interaction.isDragging && this.interaction.activeCharacter) {
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;
            
            this.interaction.activeCharacter.drag(touchX, touchY);
            this.updateCharacterHighlight();
        }
    }
    
    handleTouchEnd(event) {
        event.preventDefault(); // Prevent default behavior
        
        if (this.interaction.activeCharacter) {
            // If it was a quick tap, get character's attention
            if (!this.interaction.isDragging) {
                this.interaction.activeCharacter.getAttention();
            }
            
            // End the drag operation
            this.interaction.activeCharacter.endDrag();
            this.interaction.activeCharacter = null;
        }
        
        this.interaction.isDragging = false;
        
        // Remove any character tooltips
        const existingTooltip = document.querySelector('.character-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }
}

// Initialize environment when the page loads
let environment;
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('characterCanvas');
    environment = new Environment(canvas);
    environment.animate();
}); 