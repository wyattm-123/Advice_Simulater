// Story data structure with scenes, dialogue, and character actions
const stories = {
    // The Fitness Challenge episode
    fitnessChallenge: {
        title: "The Fitness Challenge",
        description: "Fitness Fiona challenges the neighborhood to a fitness competition, but not everyone is excited about her 5AM workout routines. Will her enthusiasm win them over or drive them crazy?",
        characters: ["Fitness Fiona", "Lazy Larry", "Office Olivia", "Skeptical Sam"],
        scenes: [
            {
                setting: "morning",
                dialogue: [
                    {
                        character: "Fitness Fiona",
                        text: "GOOOOD MORNING NEIGHBORS! Time for our 5AM POWER WORKOUT!",
                        emote: "💪",
                        position: "center"
                    },
                    {
                        character: "Lazy Larry",
                        text: "Ughhh... it's too early. Five more minutes...",
                        emote: "😴",
                        position: "right"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "No excuses, Larry! I've organized a neighborhood fitness challenge! First prize is a PROTEIN SMOOTHIE MACHINE!",
                        emote: "🏆",
                        position: "center"
                    },
                    {
                        character: "Office Olivia",
                        text: "Fiona, some of us have to work late. Can we maybe do this at a reasonable hour?",
                        emote: "🙄",
                        position: "left"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "Studies show morning workouts boost productivity by 200%! Let's start with 50 JUMPING JACKS!",
                        emote: "⭐",
                        position: "center"
                    }
                ]
            },
            {
                setting: "afternoon",
                dialogue: [
                    {
                        character: "Lazy Larry",
                        text: "I can't feel my legs after this morning. Why did I let you talk me into this?",
                        emote: "😩",
                        position: "right"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "That's the burn of SUCCESS, Larry! Wait until tomorrow's STAIR CHALLENGE!",
                        emote: "🔥",
                        position: "center"
                    },
                    {
                        character: "Skeptical Sam",
                        text: "There's no way I'm joining this madness. These fitness challenges always fizzle out after a week.",
                        emote: "🤨",
                        position: "left"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "Sam! With that attitude you're missing out on the GAINS OF GLORY! I haven't missed a day in THREE YEARS!",
                        emote: "💯",
                        position: "center"
                    },
                    {
                        character: "Office Olivia",
                        text: "Actually, I do feel more alert at work today... maybe there's something to this?",
                        emote: "🤔",
                        position: "left"
                    }
                ]
            },
            {
                setting: "evening",
                dialogue: [
                    {
                        character: "Fitness Fiona",
                        text: "EVENING COOL-DOWN EVERYONE! Remember to hydrate and stretch those muscles!",
                        emote: "💧",
                        position: "center"
                    },
                    {
                        character: "Lazy Larry",
                        text: "I've never been so exhausted yet... strangely energized?",
                        emote: "😮",
                        position: "right"
                    },
                    {
                        character: "Skeptical Sam",
                        text: "Fine, I'll try ONE day. But if you wake me before 7AM, I'm out.",
                        emote: "👆",
                        position: "left"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "THAT'S THE SPIRIT! Team, tomorrow we conquer THE MOUNTAIN TRAIL! Bring water and positive vibes!",
                        emote: "🏔️",
                        position: "center"
                    },
                    {
                        character: "Office Olivia",
                        text: "I can't believe I'm saying this, but I'm actually looking forward to it!",
                        emote: "😊",
                        position: "left"
                    }
                ]
            }
        ]
    },
    
    // The Talent Show episode
    talentShow: {
        title: "The Talent Show",
        description: "The neighborhood is organizing a talent show, and Fitness Fiona is determined to show that fitness routines can be entertaining too. Will her extreme workout performance win over the audience?",
        characters: ["Fitness Fiona", "Artistic Andy", "Musical Maria", "Comedy Carl"],
        scenes: [
            {
                setting: "afternoon",
                dialogue: [
                    {
                        character: "Artistic Andy",
                        text: "Alright everyone, the neighborhood talent show is this weekend! Who's participating?",
                        emote: "🎨",
                        position: "left"
                    },
                    {
                        character: "Musical Maria",
                        text: "I'll be performing my violin solo. I've been practicing for weeks!",
                        emote: "🎻",
                        position: "right"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "Count me in! I'll showcase the POWER OF FITNESS with my extreme aerobic dance routine!",
                        emote: "💃",
                        position: "center"
                    },
                    {
                        character: "Comedy Carl",
                        text: "Uhh... Fiona, this is a talent show, not a gym demonstration.",
                        emote: "😏",
                        position: "left"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "Fitness IS an art, Carl! Just wait until you see my one-handed pushups set to classical music!",
                        emote: "💪",
                        position: "center"
                    }
                ]
            },
            {
                setting: "evening",
                dialogue: [
                    {
                        character: "Fitness Fiona",
                        text: "How's everyone's rehearsal going? I've been practicing my routine for EIGHT HOURS STRAIGHT!",
                        emote: "🔄",
                        position: "center"
                    },
                    {
                        character: "Artistic Andy",
                        text: "That's... intense. I'm just putting final touches on my speed painting.",
                        emote: "🖌️",
                        position: "left"
                    },
                    {
                        character: "Musical Maria",
                        text: "Fiona, are you sure you're not overdoing it? You need to rest before the show.",
                        emote: "😟",
                        position: "right"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "REST? That's just another word for MISSED OPPORTUNITY! I'll sleep next week!",
                        emote: "⚡",
                        position: "center"
                    },
                    {
                        character: "Comedy Carl",
                        text: "Twenty bucks says she passes out halfway through her routine.",
                        emote: "💰",
                        position: "left"
                    }
                ]
            },
            {
                setting: "night",
                dialogue: [
                    {
                        character: "Artistic Andy",
                        text: "And now, our final performer of the night... Fitness Fiona!",
                        emote: "👏",
                        position: "left"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "PREPARE TO BE AMAZED by the power of DEDICATION and PROTEIN SHAKES!",
                        emote: "✨",
                        position: "center"
                    },
                    {
                        character: "Musical Maria",
                        text: "Wow, I never knew fitness could be so... expressive!",
                        emote: "😮",
                        position: "right"
                    },
                    {
                        character: "Comedy Carl",
                        text: "I can't believe she's still going. Is she even human?",
                        emote: "🤯",
                        position: "left"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "AND FOR MY FINALE - a handstand split while reciting the benefits of proper hydration!",
                        emote: "🏅",
                        position: "center"
                    }
                ]
            }
        ]
    },
    
    // The Neighbor Feud episode
    neighborFeud: {
        title: "The Neighbor Feud",
        description: "When Grumpy Greg moves in next door to Fitness Fiona, their lifestyles immediately clash. Can Fiona's positive energy overcome Greg's determination to live in peace and quiet?",
        characters: ["Fitness Fiona", "Grumpy Greg", "Mediator Mike", "Peacemaker Penny"],
        scenes: [
            {
                setting: "morning",
                dialogue: [
                    {
                        character: "Fitness Fiona",
                        text: "RISE AND SHINE NEIGHBORHOOD! Let's start with 100 JUMPING JACKS on the front lawn!",
                        emote: "☀️",
                        position: "center"
                    },
                    {
                        character: "Grumpy Greg",
                        text: "HEY! Some people are trying to SLEEP around here! It's 6AM on a SATURDAY!",
                        emote: "😠",
                        position: "right"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "You must be the new neighbor! Come join us! Exercise is the BEST way to start the day!",
                        emote: "🤸‍♀️",
                        position: "center"
                    },
                    {
                        character: "Grumpy Greg",
                        text: "The best way to start MY day is with SILENCE and COFFEE! Turn that music down!",
                        emote: "☕",
                        position: "right"
                    },
                    {
                        character: "Mediator Mike",
                        text: "Folks, let's try to find a compromise here. Fiona, maybe move workouts to 8AM?",
                        emote: "✋",
                        position: "left"
                    }
                ]
            },
            {
                setting: "afternoon",
                dialogue: [
                    {
                        character: "Grumpy Greg",
                        text: "Finally, some peace and quiet to enjoy my book in the garden...",
                        emote: "📖",
                        position: "right"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "PROTEIN SMOOTHIE TIME! Who wants to try my new KALE-BEET-GINGER BLAST?",
                        emote: "🥤",
                        position: "center"
                    },
                    {
                        character: "Grumpy Greg",
                        text: "For crying out loud! Is everything with you an announcement?",
                        emote: "🤦‍♂️",
                        position: "right"
                    },
                    {
                        character: "Peacemaker Penny",
                        text: "Greg, Fiona is just being friendly. Fiona, not everyone shares your... enthusiasm.",
                        emote: "😊",
                        position: "left"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "I made you a smoothie too, Greg! NUTRIENTS ARE KEY TO HAPPINESS!",
                        emote: "🥗",
                        position: "center"
                    }
                ]
            },
            {
                setting: "evening",
                dialogue: [
                    {
                        character: "Grumpy Greg",
                        text: "What happened to my garden? My prize roses are TRAMPLED!",
                        emote: "🌹",
                        position: "right"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "Oh no! That might have happened during my tire-flip exercise... I'm SO sorry!",
                        emote: "😳",
                        position: "center"
                    },
                    {
                        character: "Grumpy Greg",
                        text: "That's IT! I'm calling a neighborhood meeting about proper boundaries!",
                        emote: "📢",
                        position: "right"
                    },
                    {
                        character: "Fitness Fiona",
                        text: "Wait! I'll make it up to you! I'll replant everything AND teach you stress-relief exercises!",
                        emote: "🌱",
                        position: "center"
                    },
                    {
                        character: "Mediator Mike",
                        text: "You know what would help? If you both actually listened to each other for once.",
                        emote: "🧠",
                        position: "left"
                    }
                ]
            }
        ]
    }
};

// Helper functions for stories
function getEpisodeDetails(episodeId) {
    return stories[episodeId];
}

function getEpisodeList() {
    return Object.keys(stories).map(id => ({
        id: id,
        title: stories[id].title,
        description: stories[id].description
    }));
}

function getCharactersInEpisode(episodeId) {
    return stories[episodeId].characters;
} 