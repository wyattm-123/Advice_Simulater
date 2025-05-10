document.addEventListener('DOMContentLoaded', () => {
    const characterSelect = document.getElementById('characterSelect');
    const characterDescription = document.getElementById('characterDescription');
    const adviceInput = document.getElementById('adviceInput');
    const submitButton = document.getElementById('submitAdvice');
    const responseSection = document.getElementById('responseSection');
    const characterLeaving = document.querySelector('.character-leaving');
    const characterReturning = document.querySelector('.character-returning');
    const characterResponse = document.getElementById('characterResponse');

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
        
        // Remove previous character
        if (environment.getCharacter(selectedCharacter)) {
            environment.removeCharacter(selectedCharacter);
        }
        
        // Add new character
        const character = environment.addCharacter(selectedCharacter, characterDetails.sprite);
        
        // Set character's problem in speech bubble
        character.setProblem(characterDetails.currentProblem);
        
        // Update description
        characterDescription.textContent = `${characterDetails.description}\n\nCurrent Problem: ${characterDetails.currentProblem}`;
        
        // Reset response section
        responseSection.classList.add('hidden');
        characterLeaving.classList.remove('hidden');
        characterReturning.classList.add('hidden');
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
        
        // Show response section
        responseSection.classList.remove('hidden');
        characterLeaving.classList.remove('hidden');
        characterReturning.classList.add('hidden');

        // Hide speech bubble while character is thinking
        character.speechBubble.visible = false;
        
        // Make character walk off screen
        character.moveTo(-100);
        
        // Wait for character to leave
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show response
        characterLeaving.classList.add('hidden');
        characterReturning.classList.remove('hidden');
        characterResponse.textContent = getCharacterResponse(selectedCharacter, advice);

        // Make character walk back on screen
        character.moveTo(environment.canvas.width / 2 - 25);
        
        // Show speech bubble again
        character.speechBubble.visible = true;

        // Clear input
        adviceInput.value = '';
    });

    // Initialize with first character
    if (characterNames.length > 0) {
        characterSelect.value = characterNames[0];
        characterSelect.dispatchEvent(new Event('change'));
    }
}); 