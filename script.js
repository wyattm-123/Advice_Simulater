document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const episodeSelect = document.getElementById('episodeSelect');
    const startStoryBtn = document.getElementById('startStoryBtn');
    const nextSceneBtn = document.getElementById('nextSceneBtn');
    const episodeTitle = document.getElementById('episodeTitle');
    const episodeDescription = document.getElementById('episodeDescription');
    const characterList = document.getElementById('characterList');
    
    // State
    let currentEpisode = 'fitnessChallenge';
    let currentScene = 0;
    let currentDialogueIndex = 0;
    let isPlayingScene = false;
    let storyInterval;
    let activeCharacters = new Map();
    
    // Initialize
    updateEpisodeInfo();
    populateCharacterList();
    
    // Event Listeners
    episodeSelect.addEventListener('change', () => {
        currentEpisode = episodeSelect.value;
        updateEpisodeInfo();
        populateCharacterList();
        resetStory();
    });
    
    startStoryBtn.addEventListener('click', () => {
        if (isPlayingScene) {
            return;
        }
        
        resetStory();
        startStoryBtn.textContent = "Restart Story";
        nextSceneBtn.disabled = false;
        playScene();
    });
    
    nextSceneBtn.addEventListener('click', () => {
        if (isPlayingScene) {
            // Skip to the end of current dialogue
            clearInterval(storyInterval);
            isPlayingScene = false;
            currentDialogueIndex = 0;
            currentScene++;
            
            if (currentScene < getEpisodeDetails(currentEpisode).scenes.length) {
                playScene();
            } else {
                // End of story
                currentScene = 0;
                nextSceneBtn.textContent = "Next Scene";
                nextSceneBtn.disabled = true;
            }
        } else {
            // Move to next scene
            if (currentScene < getEpisodeDetails(currentEpisode).scenes.length) {
                playScene();
            } else {
                // Reset story
                resetStory();
                startStoryBtn.textContent = "Start Story";
                nextSceneBtn.disabled = true;
            }
        }
    });
    
    // Functions
    function updateEpisodeInfo() {
        const episodeDetails = getEpisodeDetails(currentEpisode);
        episodeTitle.textContent = `Episode: ${episodeDetails.title}`;
        episodeDescription.textContent = episodeDetails.description;
    }
    
    function populateCharacterList() {
        characterList.innerHTML = '';
        const episodeCharacters = getCharactersInEpisode(currentEpisode);
        
        episodeCharacters.forEach(name => {
            const character = getCharacterDetails(name);
            
            const card = document.createElement('div');
            card.className = 'character-card';
            
            const icon = document.createElement('div');
            icon.className = 'character-icon';
            icon.style.backgroundColor = character.sprite.color;
            icon.textContent = character.favoriteEmotes[0];
            
            const details = document.createElement('div');
            details.className = 'character-details';
            
            const nameEl = document.createElement('div');
            nameEl.className = 'character-name';
            nameEl.textContent = name;
            
            const traitEl = document.createElement('div');
            traitEl.className = 'character-trait';
            traitEl.textContent = character.traits;
            
            details.appendChild(nameEl);
            details.appendChild(traitEl);
            
            card.appendChild(icon);
            card.appendChild(details);
            
            characterList.appendChild(card);
        });
    }
    
    function resetStory() {
        currentScene = 0;
        currentDialogueIndex = 0;
        clearInterval(storyInterval);
        isPlayingScene = false;
        nextSceneBtn.textContent = "Next Scene";
        
        // Clear existing characters
        environment.characters.forEach((character, name) => {
            environment.removeCharacter(name);
        });
        activeCharacters.clear();
    }
    
    function playScene() {
        isPlayingScene = true;
        const episode = getEpisodeDetails(currentEpisode);
        const scene = episode.scenes[currentScene];
        
        if (!scene) {
            resetStory();
            return;
        }
        
        // Update UI
        if (currentScene === episode.scenes.length - 1) {
            nextSceneBtn.textContent = "Finish Story";
        }
        
        // Update environment based on scene setting
        updateEnvironment(scene.setting);
        
        // Ensure all characters for this scene are present
        const charactersInScene = new Set();
        scene.dialogue.forEach(entry => charactersInScene.add(entry.character));
        
        charactersInScene.forEach(charName => {
            if (!activeCharacters.has(charName)) {
                const characterDetails = getCharacterDetails(charName);
                const character = addCharacterToScene(charName, characterDetails, scene.dialogue);
                activeCharacters.set(charName, character);
            }
        });
        
        // Play through dialogue
        currentDialogueIndex = 0;
        playNextDialogue(scene);
    }
    
    function addCharacterToScene(name, details, dialogueEntries) {
        // Find this character's position in the scene
        const firstEntry = dialogueEntries.find(entry => entry.character === name);
        const position = firstEntry ? firstEntry.position : "center";
        
        // Calculate position on canvas
        let xPos;
        const canvasWidth = environment.canvas.width;
        
        if (position === "left") {
            xPos = canvasWidth * 0.2;
        } else if (position === "right") {
            xPos = canvasWidth * 0.8;
        } else {
            xPos = canvasWidth * 0.5;
        }
        
        // Add character to environment with the intelligent positioning system
        const character = environment.addCharacterAt(name, details.sprite, xPos);
        
        // Set mood based on character type
        switch (details.personality) {
            case "energetic":
                character.mood = "excited";
                break;
            case "relaxed":
                character.mood = "neutral";
                break;
            case "organized":
                character.mood = "neutral";
                break;
            case "cynical":
                character.mood = "neutral";
                break;
            case "creative":
                character.mood = "happy";
                break;
            case "harmonious":
                character.mood = "happy";
                break;
            case "humorous":
                character.mood = "happy";
                break;
            case "cranky":
                character.mood = "angry";
                break;
            case "diplomatic":
                character.mood = "neutral";
                break;
            case "nurturing":
                character.mood = "happy";
                break;
            default:
                character.mood = "neutral";
        }
        
        return character;
    }
    
    function updateEnvironment(setting) {
        // Change background based on time of day
        switch (setting) {
            case "morning":
                environment.setTimeOfDay("morning");
                // Update character moods for morning
                activeCharacters.forEach((character, name) => {
                    const details = getCharacterDetails(name);
                    if (details.personality === "energetic") {
                        character.mood = "excited";
                    } else if (details.personality === "relaxed" || 
                               details.personality === "cranky") {
                        character.mood = "angry"; // Not morning people!
                    }
                });
                break;
            case "afternoon":
                environment.setTimeOfDay("afternoon");
                // Reset most characters to their default moods
                activeCharacters.forEach((character, name) => {
                    const details = getCharacterDetails(name);
                    if (details.personality === "energetic") {
                        character.mood = "excited";
                    } else if (details.personality === "creative" || 
                               details.personality === "harmonious" ||
                               details.personality === "nurturing") {
                        character.mood = "happy";
                    } else if (details.personality === "cranky") {
                        character.mood = "angry";
                    } else {
                        character.mood = "neutral";
                    }
                });
                break;
            case "evening":
                environment.setTimeOfDay("evening");
                // Evening moods - more relaxed
                activeCharacters.forEach((character, name) => {
                    const details = getCharacterDetails(name);
                    if (details.personality === "relaxed") {
                        character.mood = "happy"; // Finally their time!
                    } else if (details.personality === "energetic") {
                        character.mood = "neutral"; // Winding down
                    }
                });
                break;
            case "night":
                environment.setTimeOfDay("night");
                // Night moods
                activeCharacters.forEach((character, name) => {
                    const details = getCharacterDetails(name);
                    if (details.personality === "relaxed") {
                        character.mood = "happy"; // They like night
                    } else if (details.personality === "energetic") {
                        character.mood = "neutral"; // Less energy at night
                    } else if (details.personality === "cranky") {
                        character.mood = "happy"; // Finally some peace and quiet
                    }
                });
                break;
            default:
                environment.setTimeOfDay("afternoon");
        }
    }
    
    function playNextDialogue(scene) {
        if (currentDialogueIndex >= scene.dialogue.length) {
            isPlayingScene = false;
            return;
        }
        
        // Hide all speech bubbles
        activeCharacters.forEach(character => {
            character.speechBubble.visible = false;
            character.thoughtBubble.visible = false;
        });
        
        // Get current dialogue
        const dialogue = scene.dialogue[currentDialogueIndex];
        const character = activeCharacters.get(dialogue.character);
        
        if (character) {
            // Show emote
            showEmote(character, dialogue.emote);
            
            // Move character slightly forward for emphasis
            const originalX = character.x;
            const stepForward = character.x + (character.direction === 1 ? 15 : -15);
            
            character.moveTo(stepForward);
            
            // Show dialogue with typing effect
            setTimeout(() => {
                character.speechBubble.visible = true;
                
                let textIndex = 0;
                const fullText = dialogue.text;
                character.setProblem("");
                
                clearInterval(storyInterval);
                storyInterval = setInterval(() => {
                    textIndex++;
                    if (textIndex <= fullText.length) {
                        character.setProblem(fullText.substring(0, textIndex));
                    } else {
                        clearInterval(storyInterval);
                        
                        // Move character back to original position after delay
                        setTimeout(() => {
                            character.moveTo(originalX);
                            
                            // Wait and move to next dialogue
                            setTimeout(() => {
                                currentDialogueIndex++;
                                playNextDialogue(scene);
                            }, 2000);
                        }, 1500);
                    }
                }, 50);
            }, 500);
        } else {
            // If character not found, skip to next dialogue
            currentDialogueIndex++;
            playNextDialogue(scene);
        }
    }
    
    function showEmote(character, emote) {
        // Create floating emote element
        const emoteEl = document.createElement('div');
        emoteEl.className = 'emote-container';
        emoteEl.textContent = emote;
        emoteEl.style.left = `${character.x + 30}px`;
        emoteEl.style.top = `${character.y - 20}px`;
        
        document.body.appendChild(emoteEl);
        
        // Remove after animation completes
        setTimeout(() => {
            document.body.removeChild(emoteEl);
        }, 2000);
    }
}); 