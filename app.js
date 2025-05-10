class Environment {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.characters = new Map();
        
        // Animation state
        this.isPlaying = false;
        this.clouds = [];
        this.borderItems = [];
        this.createClouds();
        this.createBorderItems();
        
        // Time tracking for animations
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Set initial canvas size
        this.resize();
        
        // Add resize listener
        window.addEventListener('resize', () => this.resize());
        
        // Initialize interaction state
        this.interaction = {
            activeCharacter: null,
            isDragging: false,
            mouseX: 0,
            mouseY: 0
        };
        
        // Add event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
        
        // Create initial characters
        this.createInitialCharacters();
    }
    
    resize() {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Story controls
        document.getElementById('playButton').addEventListener('click', () => this.toggleStory());
        document.getElementById('pauseButton').addEventListener('click', () => this.toggleStory());
        document.getElementById('episodeSelect').addEventListener('change', (e) => this.loadEpisode(e.target.value));
    }
    
    createInitialCharacters() {
        // Create one of each character type
        Object.entries(characterTypes).forEach(([type, data], index) => {
            const x = 100 + index * 150;
            const y = this.canvas.height - 150;
            const character = new Character(data.name, type, data.color, x, y);
            this.characters.set(data.name, character);
            
            // Create character card in UI
            this.createCharacterCard(data);
        });
    }
    
    createCharacterCard(data) {
        const card = document.createElement('div');
        card.className = 'character-card';
        
        const icon = document.createElement('div');
        icon.className = 'character-icon';
        icon.style.backgroundColor = data.color;
        icon.textContent = data.name[0];
        
        const details = document.createElement('div');
        details.className = 'character-details';
        
        const name = document.createElement('div');
        name.className = 'character-name';
        name.textContent = data.name;
        
        const trait = document.createElement('div');
        trait.className = 'character-trait';
        trait.textContent = data.description;
        
        details.appendChild(name);
        details.appendChild(trait);
        card.appendChild(icon);
        card.appendChild(details);
        
        document.getElementById('characterCards').appendChild(card);
    }
    
    getMouseCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }
    
    handleMouseDown(event) {
        const coords = this.getMouseCoordinates(event);
        
        // Check if clicked on a character
        for (const character of this.characters.values()) {
            if (character.containsPoint(coords.x, coords.y)) {
                this.interaction.activeCharacter = character;
                this.interaction.isDragging = true;
                character.startDrag(coords.x, coords.y);
                break;
            }
        }
    }
    
    handleMouseMove(event) {
        const coords = this.getMouseCoordinates(event);
        this.interaction.mouseX = coords.x;
        this.interaction.mouseY = coords.y;
        
        // Update cursor style
        let isOverCharacter = false;
        for (const character of this.characters.values()) {
            if (character.containsPoint(coords.x, coords.y)) {
                isOverCharacter = true;
                break;
            }
        }
        this.canvas.style.cursor = isOverCharacter ? 'pointer' : 'default';
        
        // Update dragging character
        if (this.interaction.isDragging && this.interaction.activeCharacter) {
            this.interaction.activeCharacter.drag(coords.x, coords.y);
        }
    }
    
    handleMouseUp() {
        if (this.interaction.activeCharacter) {
            this.interaction.activeCharacter.endDrag();
            this.interaction.activeCharacter = null;
        }
        this.interaction.isDragging = false;
    }
    
    handleTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const coords = this.getMouseCoordinates(touch);
            
            for (const character of this.characters.values()) {
                if (character.containsPoint(coords.x, coords.y)) {
                    this.interaction.activeCharacter = character;
                    this.interaction.isDragging = true;
                    character.startDrag(coords.x, coords.y);
                    break;
                }
            }
        }
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        if (event.touches.length === 1 && this.interaction.isDragging) {
            const touch = event.touches[0];
            const coords = this.getMouseCoordinates(touch);
            
            if (this.interaction.activeCharacter) {
                this.interaction.activeCharacter.drag(coords.x, coords.y);
            }
        }
    }
    
    handleTouchEnd() {
        this.handleMouseUp();
    }
    
    toggleStory() {
        this.isPlaying = !this.isPlaying;
        const playButton = document.getElementById('playButton');
        const pauseButton = document.getElementById('pauseButton');
        
        if (!this.isPlaying) {
            playButton.disabled = false;
            pauseButton.disabled = true;
            playButton.textContent = 'Play Story';
        } else {
            playButton.disabled = true;
            pauseButton.disabled = false;
            playButton.textContent = 'Playing...';
        }
    }
    
    loadEpisode(episodeId) {
        // Update UI
        const description = document.querySelector('.episode-description');
        description.textContent = `Episode ${episodeId} loaded! Click Play to start the story.`;
    }
    
    update() {
        // Update all characters
        for (const character of this.characters.values()) {
            character.update();
        }
    }
    
    createClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: 50 + Math.random() * 100,
                width: 100 + Math.random() * 100,
                height: 40 + Math.random() * 30,
                speed: 0.5 + Math.random() * 0.5,
                opacity: 0.6 + Math.random() * 0.3
            });
        }
    }

    createBorderItems() {
        const numItems = 20;
        for (let i = 0; i < numItems; i++) {
            this.borderItems.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: ['star', 'heart', 'circle', 'triangle'][Math.floor(Math.random() * 4)],
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                size: 10 + Math.random() * 20,
                angle: Math.random() * Math.PI * 2,
                speed: 1 + Math.random() * 2,
                rotationSpeed: 0.02 + Math.random() * 0.04
            });
        }
    }

    drawBackground() {
        // Draw sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');  // Sky blue
        gradient.addColorStop(1, '#E0F7FA');  // Light cyan
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw clouds
        this.clouds.forEach(cloud => {
            this.ctx.save();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
            
            // Draw cloud shape
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.height/2, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.width * 0.3, cloud.y - cloud.height * 0.1, cloud.height/2.2, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.width * 0.6, cloud.y, cloud.height/1.8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Move cloud
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvas.width;
            }
            this.ctx.restore();
        });

        // Draw ground with details
        const groundGradient = this.ctx.createLinearGradient(0, this.canvas.height - 100, 0, this.canvas.height);
        groundGradient.addColorStop(0, '#90EE90');  // Light green
        groundGradient.addColorStop(1, '#228B22');  // Forest green
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);

        // Draw grass details
        for (let i = 0; i < this.canvas.width; i += 15) {
            const height = 10 + Math.sin(i * 0.1 + Date.now() * 0.001) * 5;
            this.ctx.beginPath();
            this.ctx.moveTo(i, this.canvas.height - 100);
            this.ctx.lineTo(i + 7, this.canvas.height - 100 - height);
            this.ctx.lineTo(i + 14, this.canvas.height - 100);
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fill();
        }
    }

    drawBorderItems() {
        this.borderItems.forEach(item => {
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate(item.angle);
            this.ctx.fillStyle = item.color;

            switch (item.type) {
                case 'star':
                    this.drawStar(0, 0, 5, item.size, item.size/2);
                    break;
                case 'heart':
                    this.drawHeart(0, 0, item.size);
                    break;
                case 'circle':
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, item.size/2, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                case 'triangle':
                    this.drawTriangle(0, 0, item.size);
                    break;
            }

            this.ctx.restore();

            // Update position and rotation
            item.angle += item.rotationSpeed;
            item.x += Math.cos(item.angle) * item.speed;
            item.y += Math.sin(item.angle) * item.speed;

            // Wrap around screen
            if (item.x < -item.size) item.x = this.canvas.width + item.size;
            if (item.x > this.canvas.width + item.size) item.x = -item.size;
            if (item.y < -item.size) item.y = this.canvas.height + item.size;
            if (item.y > this.canvas.height + item.size) item.y = -item.size;
        });
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawHeart(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size/4);
        this.ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + size/4);
        this.ctx.bezierCurveTo(x - size/2, y + size/2, x, y + size * 0.75, x, y + size);
        this.ctx.bezierCurveTo(x, y + size * 0.75, x + size/2, y + size/2, x + size/2, y + size/4);
        this.ctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
        this.ctx.fill();
    }

    drawTriangle(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size/2);
        this.ctx.lineTo(x + size/2, y + size/2);
        this.ctx.lineTo(x - size/2, y + size/2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background elements
        this.drawBackground();
        
        // Draw border items
        this.drawBorderItems();
        
        // Draw all characters
        for (const character of this.characters.values()) {
            character.draw(this.ctx);
        }
    }

    animate(currentTime = 0) {
        // Calculate delta time
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update();
        this.draw();
        requestAnimationFrame((time) => this.animate(time));
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('characterCanvas');
    const environment = new Environment(canvas);
}); 