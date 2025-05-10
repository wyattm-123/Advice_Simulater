class Environment {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.characters = new Map();
        
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
        const playButton = document.getElementById('playButton');
        const pauseButton = document.getElementById('pauseButton');
        
        if (playButton.disabled) {
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
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#e9ecef';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#8BC34A';
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);
        
        // Draw all characters
        for (const character of this.characters.values()) {
            character.draw(this.ctx);
        }
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('characterCanvas');
    const environment = new Environment(canvas);
}); 