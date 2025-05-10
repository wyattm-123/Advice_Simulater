document.addEventListener('DOMContentLoaded', () => {
    const characterSelect = document.getElementById('characterSelect');
    const characterDescription = document.getElementById('characterDescription');
    const adviceInput = document.getElementById('adviceInput');
    const submitButton = document.getElementById('submitAdvice');
    const responseSection = document.getElementById('responseSection');
    const characterLeaving = document.querySelector('.character-leaving');
    const characterReturning = document.querySelector('.character-returning');
    const characterResponse = document.getElementById('characterResponse');
    
    // Active characters in scene
    const activeCharacters = new Set();

    // Populate character select
    const characterNames = getCharacterNames();
    characterNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        characterSelect.appendChild(option);
    });

    // Update character display when selection changes
    characterSelect.addEventListener('change', () => {
        const selectedCharacter = characterSelect.value;
        const characterDetails = getCharacterDetails(selectedCharacter);
        
        // If character is already active, just focus on them
        if (activeCharacters.has(selectedCharacter)) {
            focusOnCharacter(selectedCharacter);
            characterDescription.textContent = `${characterDetails.description}\n\nCurrent Problem: ${characterDetails.currentProblem}`;
            return;
        }
        
        // Add new character to scene
        const character = environment.addCharacter(selectedCharacter, characterDetails.sprite);
        activeCharacters.add(selectedCharacter);
        
        // Set character's problem in speech bubble
        character.setProblem(characterDetails.currentProblem);
        
        // Update description
        characterDescription.textContent = `${characterDetails.description}`;
        
        // Reset response section
        hideResponseSection();
    });

    // Handle advice submission
    submitButton.addEventListener('click', async () => {
        const advice = adviceInput.value.trim();
        if (!advice) {
            alert('Please enter some advice first!');
            return;
        }

        const selectedCharacter = characterSelect.value;
        const character = environment.getCharacter(selectedCharacter);
        
        if (!character) {
            alert('Please select a character first!');
            return;
        }
        
        // Hide any existing thought bubbles from all characters
        characterNames.forEach(name => {
            const char = environment.getCharacter(name);
            if (char) char.hideResponse();
        });
        
        // Make character think about advice
        character.speechBubble.visible = false;
        
        // Show thinking animation
        character.moveTo(character.x + (character.direction === 1 ? 30 : -30));
        await new Promise(resolve => setTimeout(resolve, 1000));
        character.moveTo(character.x + (character.direction === 1 ? -30 : 30));
        
        // Generate response based on character personality
        const response = getCharacterResponse(selectedCharacter, advice);
        
        // Wait a short time before showing response
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Show response in thought bubble
        character.setResponse(response);
        character.speechBubble.visible = true;
        
        // Clear input
        adviceInput.value = '';
    });
    
    // Focus camera on a specific character
    function focusOnCharacter(name) {
        const character = environment.getCharacter(name);
        if (!character) return;
        
        // Center view on character
        const canvasCenter = environment.canvas.width / 2;
        if (Math.abs(character.x - canvasCenter) > 50) {
            // Move other characters to make room if needed
            characterNames.forEach(charName => {
                if (charName !== name) {
                    const otherChar = environment.getCharacter(charName);
                    if (otherChar && Math.abs(otherChar.x - character.x) < 120) {
                        // Move this character away to avoid overlap
                        const moveDir = otherChar.x < character.x ? -1 : 1;
                        otherChar.moveTo(otherChar.x + (moveDir * 150));
                    }
                }
            });
            
            // Now move the selected character to center
            character.moveTo(canvasCenter - character.width/2);
        }
    }
    
    // Hide the response section since we're using thought bubbles now
    function hideResponseSection() {
        responseSection.classList.add('hidden');
        characterLeaving.classList.remove('hidden');
        characterReturning.classList.add('hidden');
    }

    // Initialize with first character
    if (characterNames.length > 0) {
        characterSelect.value = characterNames[0];
        characterSelect.dispatchEvent(new Event('change'));
    }
}); 