
// Load saved stories
let stories = JSON.parse(localStorage.getItem("myStories")) || [];

// Make sure every story has an episodes array
stories.forEach(story => {
    if (!Array.isArray(story.episodes)) {
        story.episodes = [];
    }
});

// Save stories
function saveStories() {
    localStorage.setItem("myStories", JSON.stringify(stories));
}

// Create a story
function createStory() {
    let title = prompt("Enter your story title:");

    if (!title || !title.trim()) return;

    let description = prompt("Enter story description:");

    stories.push({
        id: Date.now(),
        title: title.trim(),
        description: description || "No description added yet.",
        episodes: []
    });

    saveStories();
    displayStories();
}

// Display stories
function displayStories() {
    let storyList = document.getElementById("storyList");
    storyList.innerHTML = "";

    let totalEpisodes = 0;

    stories.forEach(story => {

    // Create episodes array if it does not exist
    if (!Array.isArray(story.episodes)) {
        story.episodes = [];
    }

    totalEpisodes += story.episodes.length;
        let card = document.createElement("div");
        card.className = "stat-card";

        let title = document.createElement("h3");
        title.textContent = "📖 " + story.title;

        let description = document.createElement("p");
        description.textContent = story.description;

        let count = document.createElement("p");
        count.textContent = "Episodes: " + story.episodes.length;

        let addButton = document.createElement("button");
        addButton.textContent = "+ Add Episode";
        addButton.onclick = () => addEpisode(story.id);

        let editButton = document.createElement("button");
        editButton.textContent = "Edit Story";
        editButton.style.marginLeft = "8px";
        editButton.onclick = () => editStory(story.id);

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Story";
        deleteButton.style.background = "#dc3545";
        deleteButton.style.marginTop = "10px";
        deleteButton.onclick = () => deleteStory(story.id);

let worldButton = document.createElement("button");

worldButton.textContent = "🌍 Story World";

worldButton.style.marginTop = "10px";
worldButton.style.marginLeft = "8px";

worldButton.onclick = () => openStoryWorld(story.id);

        let episodeList = document.createElement("div");

        story.episodes.forEach((episode, index) => {
            let episodeRow = document.createElement("div");
            episodeRow.style.marginTop = "15px";
            episodeRow.style.padding = "12px";
            episodeRow.style.background = "#292342";
            episodeRow.style.borderRadius = "8px";

            let episodeTitle = document.createElement("p");
            episodeTitle.textContent =
                "Episode " + (index + 1) + ": " + episode.title;

            let viewButton = document.createElement("button");
            viewButton.textContent = "View / Edit";
            viewButton.style.marginTop = "8px";
           viewButton.onclick = () =>
    openEpisodeEditor(story.id, episode.id);

            let removeButton = document.createElement("button");
            removeButton.textContent = "Delete";
            removeButton.style.background = "#dc3545";
            removeButton.style.marginLeft = "8px";
            removeButton.style.marginTop = "8px";
            removeButton.onclick = () =>
                deleteEpisode(story.id, episode.id);

            episodeRow.appendChild(episodeTitle);
            episodeRow.appendChild(viewButton);
            episodeRow.appendChild(removeButton);

            episodeList.appendChild(episodeRow);
        });

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(count);
        card.appendChild(addButton);
        card.appendChild(editButton);
        card.appendChild(deleteButton);
        card.appendChild(worldButton);
        card.appendChild(episodeList);

        storyList.appendChild(card);
    });

    document.getElementById("totalStories").textContent = stories.length;

document.getElementById("totalEpisodes").textContent = totalEpisodes;
    refreshAIStoryOptions();
    if (stories.length === 0) {
        storyList.innerHTML = `
            <div class="empty-state">
                <h3>No stories yet</h3>
                <p>Create your first story!</p>
            </div>
        `;
    }
}

// Current episode details
let currentStoryId = null;
let currentEpisodeId = null;

// Open writing editor
function openEpisodeEditor(storyId, episodeId) {

    let story = stories.find(item => item.id === storyId);
    if (!story) return;

    let episode = story.episodes.find(
        item => item.id === episodeId
    );

    if (!episode) return;

    currentStoryId = storyId;
    currentEpisodeId = episodeId;

    document.getElementById("episodeTitle").value = episode.title;

    document.getElementById("episodeContent").innerHTML =
        episode.content || "";

    document.getElementById("writingEditor").hidden = false;

    document.getElementById("saveStatus").textContent = "Saved";

    updateWordCount();

    document.getElementById("writingEditor").scrollIntoView({
        behavior: "smooth"
    });
}

// Save episode
function saveEpisode() {

    let story = stories.find(item => item.id === currentStoryId);
    if (!story) return;

    let episode = story.episodes.find(
        item => item.id === currentEpisodeId
    );

    if (!episode) return;

    episode.title = document.getElementById("episodeTitle").value;

    episode.content =
        document.getElementById("episodeContent").innerHTML;

    saveStories();

    document.getElementById("saveStatus").textContent = "Saved ✓";

    displayStories();
}

// Auto save while typing
function autoSaveEpisode() {

    if (currentStoryId === null) return;

    let story = stories.find(item => item.id === currentStoryId);
    if (!story) return;

    let episode = story.episodes.find(
        item => item.id === currentEpisodeId
    );

    if (!episode) return;

    episode.title = document.getElementById("episodeTitle").value;

    episode.content =
        document.getElementById("episodeContent").innerHTML;

    saveStories();

    document.getElementById("saveStatus").textContent =
        "Auto Saved ✓";
}

// Word and character count
function updateWordCount() {

    let content = document.getElementById("episodeContent").innerText;

    let words = content.trim()
        ? content.trim().split(/\s+/).length
        : 0;

    let characters = content.length;

    document.getElementById("wordCount").textContent = words;

    document.getElementById("charCount").textContent = characters;

    autoSaveEpisode();
}

// Text formatting
function formatText(command, value = null) {

    document.getElementById("episodeContent").focus();

    document.execCommand(command, false, value);

    updateWordCount();
}

// Close editor
function closeEditor() {

    saveEpisode();

    document.getElementById("writingEditor").hidden = true;

    currentStoryId = null;
    currentEpisodeId = null;
}

// Auto save when episode title changes
document.getElementById("episodeTitle").addEventListener(
    "input",
    autoSaveEpisode
);

// Edit story
function editStory(id) {
    let story = stories.find(item => item.id === id);
    if (!story) return;

    let title = prompt("Edit story title:", story.title);
    if (title === null || !title.trim()) return;

    let description = prompt(
        "Edit description:",
        story.description
    );

    if (description === null) return;

    story.title = title.trim();
    story.description = description;

    saveStories();
    displayStories();
}

// Delete story
function deleteStory(id) {
    if (!confirm("Delete this story and all its episodes?")) return;

    stories = stories.filter(item => item.id !== id);

    saveStories();
    displayStories();
}

// Add episode
function addEpisode(storyId) {
    let story = stories.find(item => item.id === storyId);
    if (!story) return;

    let title = prompt("Enter episode title:");
    if (!title || !title.trim()) return;

    let content = prompt("Write your episode content:");
    if (content === null) return;

    story.episodes.push({
        id: Date.now(),
        title: title.trim(),
        content: content
    });

    saveStories();
    displayStories();

    alert("Episode saved successfully!");
}

// View and edit episode
function editEpisode(storyId, episodeId) {
    let story = stories.find(item => item.id === storyId);
    if (!story) return;

    let episode = story.episodes.find(
        item => item.id === episodeId
    );

    if (!episode) return;

    let title = prompt("Episode title:", episode.title);
    if (title === null || !title.trim()) return;

    let content = prompt("Episode content:", episode.content);
    if (content === null) return;

    episode.title = title.trim();
    episode.content = content;

    saveStories();
    displayStories();

    alert("Episode updated!");
}

// Delete episode
function deleteEpisode(storyId, episodeId) {
    if (!confirm("Delete this episode?")) return;

    let story = stories.find(item => item.id === storyId);
    if (!story) return;

    story.episodes = story.episodes.filter(
        item => item.id !== episodeId
    );

    saveStories();
    displayStories();
}

// Load saved data
displayStories();

// Voice Typing
let recognition = null;
let isVoiceActive = false;

function startVoiceTyping() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        document.getElementById("voiceStatus").textContent =
            "Voice typing is not supported in this browser.";
        return;
    }

    if (isVoiceActive) return;

    recognition = new SpeechRecognition();

    recognition.lang = document.getElementById("voiceLanguage").value;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = function () {
        isVoiceActive = true;
        document.getElementById("voiceStatus").textContent =
            "🎙️ Listening... Speak now";
    };

    recognition.onresult = function (event) {
        let editor = document.getElementById("episodeContent");

        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                let spokenText = event.results[i][0].transcript;

                editor.appendChild(
                    document.createTextNode(spokenText + " ")
                );

                updateWordCount();
            }
        }
    };

    recognition.onerror = function (event) {
        document.getElementById("voiceStatus").textContent =
            "Voice error: " + event.error;
    };

    recognition.onend = function () {

    if (isVoiceActive) {
        setTimeout(() => {
            try {
                recognition.start();
            } catch (error) {
                console.log("Voice restart:", error);
            }
        }, 300);
    } else {
        document.getElementById("voiceStatus").textContent =
            "Voice typing stopped";
    }
};

    try {
    recognition.start();
} catch (error) {
    document.getElementById("voiceStatus").textContent =
        "Voice typing could not start.";
    console.error("Voice start error:", error);
}
}

function stopVoiceTyping() {
    if (recognition && isVoiceActive) {
        recognition.stop();
    }

    isVoiceActive = false;
    document.getElementById("voiceStatus").textContent =
        "Voice typing stopped";
}

function downloadEpisode() {
    if (currentStoryId === null || currentEpisodeId === null) {
        alert("Please open an episode first.");
        return;
    }

    let title = document.getElementById("episodeTitle").value.trim();
    let content = document.getElementById("episodeContent").innerText;

    if (!title) {
        alert("Please enter an episode title.");
        return;
    }

    let text = title + "\n\n" + content;

    let blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });

    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");

    link.href = url;
    link.download = title.replace(/[\\/:*?"<>|]/g, "_") + ".txt";

    link.click();

    URL.revokeObjectURL(url);
}


async function downloadEpisodeDOCX() {
    if (currentStoryId === null || currentEpisodeId === null) {
        alert("Please open an episode first.");
        return;
    }

    const title = document.getElementById("episodeTitle").value.trim();
    const content = document.getElementById("episodeContent").innerText;

    if (!title) {
        alert("Please enter an episode title.");
        return;
    }

    if (!window.docx) {
        alert("Word library not loaded. Check your internet connection.");
        return;
    }

    const { Document, Packer, Paragraph, TextRun } = window.docx;

    const paragraphs = [
        new Paragraph({
            children: [
                new TextRun({
                    text: title,
                    bold: true,
                    size: 32
                })
            ]
        }),
        ...content.split(/\r?\n/).map(line =>
            new Paragraph({
                children: [new TextRun(line)]
            })
        )
    ];

    const documentFile = new Document({
        sections: [{ children: paragraphs }]
    });

    try {
        const blob = await Packer.toBlob(documentFile);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = title.replace(/[\\/:*?"<>|]/g, "_") + ".docx";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (error) {
        alert("Unable to create Word file. Please try again.");
        console.error(error);
    }
}

 // Current Story World
let currentWorldStoryId = null;

// Initialize Story World data
function initializeStoryWorld(story) {
    if (!story.world) {
        story.world = {};
    }

    ["characters", "places", "jewels", "groups", "others"].forEach(type => {
        if (!Array.isArray(story.world[type])) {
            story.world[type] = [];
        }
    });
}

stories.forEach(story => {
    initializeStoryWorld(story);
});

saveStories();

// Open Story World
function openStoryWorld(storyId) {
    let story = stories.find(item => item.id === storyId);

    if (!story) return;

    initializeStoryWorld(story);
    currentWorldStoryId = storyId;

    document.getElementById("worldStoryTitle").textContent =
        "Story: " + story.title;

    document.getElementById("stories").hidden = true;
    document.getElementById("writingEditor").hidden = true;
    document.getElementById("storyWorld").hidden = false;

    showWorldSection("characters");
    displayWorldItems();
    displayCharacterProfiles();
    saveStories();

    document.getElementById("storyWorld").scrollIntoView({
        behavior: "smooth"
    });
}

// Close Story World
function closeStoryWorld() {
    document.getElementById("storyWorld").hidden = true;
    document.getElementById("stories").hidden = false;

    currentWorldStoryId = null;
}

// Switch World Sections
function showWorldSection(sectionName) {
    document.querySelectorAll(".world-content").forEach(section => {
        section.hidden = true;
    });

    document.getElementById(sectionName).hidden = false;
}

// Add World Item
function addWorldItem(type) {
    let story = stories.find(item => item.id === currentWorldStoryId);

    if (!story) return;

    initializeStoryWorld(story);

    // Others category
   if (type === "others") {
    let category = document.getElementById("otherCategory").value;

    if (category === "Custom") {
        category = document.getElementById("customCategory").value.trim();
    }

    let person = document.getElementById("otherPerson").value.trim();
    let name = document.getElementById("otherName").value.trim();
    let level = document.getElementById("otherLevel").value.trim();
    let description = document.getElementById("otherDescription").value.trim();

    if (!category || !person || !name || !level) {
        alert("Please enter category, person, power and level.");
        return;
    }

    story.world.others.push({
        id: Date.now(),
        person: person,
        name: name,
        level: level,
        category: category,
        details: [description]
    });

    saveStories();
    displayWorldItems();

    document.getElementById("otherPerson").value = "";
    document.getElementById("otherName").value = "";
    document.getElementById("otherLevel").value = "";
    document.getElementById("otherDescription").value = "";
    document.getElementById("customCategory").value = "";

    alert("Details saved successfully!");
    return;
}
// Characters, Places, Jewels, Groups
    let fields = {
        characters: [
            "characterName",
            "characterAge",
            "characterRole",
            "characterDescription"
        ],
        places: [
            "placeName",
            "placeType",
            "placeDescription"
        ],
        jewels: [
            "jewelName",
            "jewelType",
            "jewelDescription"
        ],
        groups: [
            "groupName",
            "groupDescription"
        ]
    };

    let ids = fields[type];

    if (!ids) return;

    let values = ids.map(id =>
        document.getElementById(id).value.trim()
    );

    if (!values[0]) {
        alert("Please enter a name.");
        return;
    }

    story.world[type].push({
        id: Date.now(),
        name: values[0],
        details: values.slice(1)
    });

    saveStories();
    displayWorldItems();

    ids.forEach(id => {
        document.getElementById(id).value = "";
    });

    alert("Details saved successfully!");
}

// Display World Items
function displayWorldItems() {
    let story = stories.find(item => item.id === currentWorldStoryId);

    if (!story) return;

    initializeStoryWorld(story);

    // Existing categories
    let listIds = {
        characters: "characterList",
        places: "placeList",
        jewels: "jewelList",
        groups: "groupList"
    };

    Object.keys(listIds).forEach(type => {
        let list = document.getElementById(listIds[type]);

        if (!list) return;

        list.innerHTML = "";

        story.world[type].forEach(item => {
            let card = document.createElement("div");
            card.className = "stat-card";
            card.style.marginTop = "15px";

            let heading = document.createElement("h3");
            heading.textContent = item.name;

            let details = document.createElement("p");
            details.textContent = item.details.join(" | ");


            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.background = "#dc3545";
            deleteButton.style.marginTop = "10px";

            deleteButton.onclick = () => {
                if (confirm("Delete " + item.name + "?")) {
                    story.world[type] = story.world[type].filter(
                        entry => entry.id !== item.id
                    );

                    saveStories();
                    displayWorldItems();
                }
            };

            card.appendChild(heading);
            card.appendChild(details);
            card.appendChild(deleteButton);

            list.appendChild(card);
        });
    });

    // Others - Separate Subcategories
    let otherList = document.getElementById("otherList");

    if (!otherList) return;

    otherList.innerHTML = "";

    let categories = {};

    story.world.others.forEach(item => {
        let category = item.category || "Others";

        if (!categories[category]) {
            categories[category] = [];
        }

        categories[category].push(item);
    });

    Object.keys(categories).forEach(category => {
        let heading = document.createElement("h3");
        heading.textContent = "📁 " + category;
        heading.style.marginTop = "20px";

        otherList.appendChild(heading);

        categories[category].forEach(item => {
            let card = document.createElement("div");
            card.className = "stat-card";
            card.style.marginTop = "10px";

         let name = document.createElement("h3");
name.textContent = item.person;

let powers = document.createElement("div");

if (item.powers) {
    item.powers.forEach(p => {
        let powerLine = document.createElement("p");

        powerLine.textContent =
            "⚡ " + p.name + " - Level " + p.level;

        powers.appendChild(powerLine);
    });
} else {
    let oldPower = document.createElement("p");
    oldPower.textContent =
        "Power: " + item.name + " - Level " + item.level;

    powers.appendChild(oldPower);
}

            let description = document.createElement("p");
            description.textContent = item.details.join(" | ");
            // Edit Button
let editButton = document.createElement("button");

editButton.textContent = "Edit";
editButton.style.background = "#2563eb";
editButton.style.marginRight = "10px";

editButton.onclick = () => {
    editCharacterPowers(item.id);
};

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.background = "#dc3545";

            deleteButton.onclick = () => {

    let confirmDelete = confirm(
        "Delete all powers of " + item.person + "?"
    );

    if (confirmDelete) {

        let index = story.world.others.findIndex(
            entry => String(entry.id) === String(item.id)
        );

        if (index !== -1) {
            story.world.others.splice(index, 1);

            saveStories();
            displayWorldItems();

            alert("Character powers deleted successfully!");
        } else {
            alert("Power record not found!");
        }
    }
};

           card.appendChild(name);
           card.appendChild(powers);
           card.appendChild(description);
           card.appendChild(editButton);
           card.appendChild(deleteButton);

            otherList.appendChild(card);
        });
    });
}

// Custom Category input
function toggleCustomCategory() {
    let category = document.getElementById("otherCategory").value;

    document.getElementById("customCategory").hidden =
        category !== "Custom";
}
// Add another Power input
function addPowerRow() {
    let container = document.getElementById("powerContainer");

    let row = document.createElement("div");
    row.className = "power-row";

    row.innerHTML = `
        <input type="text" class="powerName" placeholder="Power Name">

        <input type="number" class="powerLevel" placeholder="Level">

        <button type="button" onclick="this.parentElement.remove()">
            Remove
        </button>
    `;

    container.appendChild(row);
}


// Save all powers at once
function saveAllPowers() {
    let story = stories.find(item => item.id === currentWorldStoryId);

    if (!story) return;

    initializeStoryWorld(story);

    let person = document.getElementById("otherPerson").value.trim();
    let category = document.getElementById("otherCategory").value;

    if (category === "Custom") {
        category = document.getElementById("customCategory").value.trim();
    }

    let powerRows = document.querySelectorAll(".power-row");

    let powers = [];

    powerRows.forEach(row => {
        let name = row.querySelector(".powerName").value.trim();
        let level = row.querySelector(".powerLevel").value.trim();

        if (name && level) {
            powers.push({
                name: name,
                level: level
            });
        }
    });

    if (!person || !category || powers.length === 0) {
        alert("Enter character name and at least one complete power.");
        return;
    }

    story.world.others.push({
        id: Date.now(),
        person: person,
        category: category,
        powers: powers,
        details: [
            document.getElementById("otherDescription").value.trim()
        ]
    });

    saveStories();
    displayWorldItems();

    document.getElementById("otherPerson").value = "";
    document.getElementById("otherDescription").value = "";
    document.getElementById("customCategory").value = "";

    document.getElementById("powerContainer").innerHTML = `
        <div class="power-row">
            <input type="text" class="powerName" placeholder="Power Name">
            <input type="number" class="powerLevel" placeholder="Level">
        </div>
    `;

    alert("All powers saved successfully!");
}
function editCharacterPowers(itemId) {

    let story = stories.find(
        item => item.id === currentWorldStoryId
    );

    if (!story) return;

    let character = story.world.others.find(
        item => String(item.id) === String(itemId)
    );

    if (!character) return;

    let newPerson = prompt(
        "Enter Character Name:",
        character.person
    );

    if (newPerson === null || !newPerson.trim()) return;

    let updatedPowers = [];

    let existingPowers = character.powers || [
        {
            name: character.name || "",
            level: character.level || ""
        }
    ];

    for (let i = 0; i < existingPowers.length; i++) {

        let newName = prompt(
            "Power " + (i + 1) + " Name:",
            existingPowers[i].name
        );

        if (newName === null) return;

        let newLevel = prompt(
            "Power " + (i + 1) + " Level:",
            existingPowers[i].level
        );

        if (newLevel === null) return;

        if (!newName.trim() || !newLevel.trim()) {
            alert("Power name and level are required.");
            return;
        }

        updatedPowers.push({
            name: newName.trim(),
            level: newLevel.trim()
        });
    }

    character.person = newPerson.trim();
    character.powers = updatedPowers;

    saveStories();
    displayWorldItems();

    alert("Character powers updated successfully!");
}
// Currently editing character
let editingCharacterId = null;


// Open Edit Screen
function editCharacterPowers(itemId) {

    let story = stories.find(
        item => item.id === currentWorldStoryId
    );

    if (!story) return;

    let character = story.world.others.find(
        item => String(item.id) === String(itemId)
    );

    if (!character) return;

    editingCharacterId = itemId;

    document.getElementById("editPersonName").value =
        character.person || "";

    let container = document.getElementById("editPowerContainer");
    container.innerHTML = "";

    let existingPowers = character.powers || [];

    existingPowers.forEach(power => {
        addEditPowerRow(power.name, power.level);
    });

    document.getElementById("editPowerSection").hidden = false;
}


// Add Power Row in Edit Screen
function addEditPowerRow(name = "", level = "") {

    let container = document.getElementById("editPowerContainer");

    let row = document.createElement("div");
    row.className = "power-row";

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "editPowerName";
    nameInput.placeholder = "Power Name";
    nameInput.value = name;

    let levelInput = document.createElement("input");
    levelInput.type = "number";
    levelInput.className = "editPowerLevel";
    levelInput.placeholder = "Level";
    levelInput.value = level;

    let removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.onclick = () => row.remove();

    row.appendChild(nameInput);
    row.appendChild(levelInput);
    row.appendChild(removeButton);

    container.appendChild(row);
}


// Save Edited Powers
function saveEditedPowers() {

    let story = stories.find(
        item => item.id === currentWorldStoryId
    );

    if (!story) return;

    let character = story.world.others.find(
        item => String(item.id) === String(editingCharacterId)
    );

    if (!character) return;

    let person = document.getElementById("editPersonName").value.trim();

    let rows = document.querySelectorAll(
        "#editPowerContainer .power-row"
    );

    let powers = [];

    for (let row of rows) {

        let name = row.querySelector(".editPowerName").value.trim();
        let level = row.querySelector(".editPowerLevel").value.trim();

        if (!name || !level) {
            alert("Please complete all Power Names and Levels.");
            return;
        }

        powers.push({
            name: name,
            level: level
        });
    }

    if (!person || powers.length === 0) {
        alert("Enter a character name and at least one Power.");
        return;
    }

    character.person = person;
    character.powers = powers;

    saveStories();

    document.getElementById("editPowerSection").hidden = true;

    editingCharacterId = null;

    displayWorldItems();

    alert("Character updated successfully!");
}


// Cancel Edit
function cancelEditPowers() {

    document.getElementById("editPowerSection").hidden = true;

    editingCharacterId = null;
}
function saveCharacterProfile() {
    let story = stories.find(
        item => item.id === currentWorldStoryId
    );

    if (!story) return;

    if (!story.world.characterProfiles) {
        story.world.characterProfiles = [];
    }

    let name = document.getElementById("profileName").value.trim();
    let age = document.getElementById("profileAge").value;
    let gender = document.getElementById("profileGender").value;
    let role = document.getElementById("profileRole").value;
    let appearance = document.getElementById("profileAppearance").value;
    let personality = document.getElementById("profilePersonality").value;
    let background = document.getElementById("profileBackground").value;
    let imageFile = document.getElementById("characterImage").files[0];

    if (!name || !age || !gender || !role) {
        alert("Please fill in Name, Age, Gender and Role.");
        return;
    }

    let profile = editingProfileId !== null
        ? story.world.characterProfiles.find(
            item => String(item.id) === String(editingProfileId)
        )
        : null;

    if (editingProfileId !== null && !profile) {
        alert("Character profile not found.");
        return;
    }

    function saveProfile(imageData) {
        let profileData = {
            name,
            age,
            gender,
            role,
            appearance,
            personality,
            background
        };

        if (profile) {
            Object.assign(profile, profileData);

            if (imageData !== null) {
                profile.image = imageData;
            }
        } else {
            story.world.characterProfiles.push({
                id: Date.now(),
                ...profileData,
                image: imageData || ""
            });
        }

        saveStories();
        editingProfileId = null;

        document.getElementById("profileName").value = "";
        document.getElementById("profileAge").value = "";
        document.getElementById("profileGender").value = "";
        document.getElementById("profileRole").value = "";
        document.getElementById("profileAppearance").value = "";
        document.getElementById("profilePersonality").value = "";
        document.getElementById("profileBackground").value = "";
        document.getElementById("characterImage").value = "";

        displayCharacterProfiles();

        alert("Character Profile Saved Successfully!");
    }

    if (imageFile) {
        let reader = new FileReader();

        reader.onload = function(event) {
            saveProfile(event.target.result);
        };

        reader.readAsDataURL(imageFile);
    } else {
        saveProfile(null);
    }
}
function displayCharacterProfiles() {
    let story = stories.find(
        item => item.id === currentWorldStoryId
    );

    if (!story) return;

    let container = document.getElementById("characterProfileList");

    container.innerHTML = "";

    let profiles = story.world.characterProfiles || [];

    profiles.forEach(profile => {
        let card = document.createElement("div");
        card.className = "stat-card";

        let image = document.createElement("img");

        if (profile.image) {
            image.src = profile.image;
            image.alt = profile.name;
            image.style.width = "150px";
            image.style.height = "150px";
            image.style.objectFit = "cover";
            image.style.borderRadius = "12px";
        }

        let details = document.createElement("div");

        details.innerHTML = `
            <h3>${escapeProfileText(profile.name)}</h3>
            <p>Age: ${escapeProfileText(profile.age)}</p>
            <p>Gender: ${escapeProfileText(profile.gender)}</p>
            <p>Role: ${escapeProfileText(profile.role)}</p>
            <p>Appearance: ${escapeProfileText(profile.appearance)}</p>
            <p>Personality: ${escapeProfileText(profile.personality)}</p>
            <p>Background: ${escapeProfileText(profile.background)}</p>
        `;

        if (profile.image) {
            card.appendChild(image);
        }

    let editButton = document.createElement("button");
editButton.textContent = "✏️ Edit";
editButton.onclick = () => editCharacterProfile(profile.id);

let deleteButton = document.createElement("button");
deleteButton.textContent = "🗑️ Delete";
deleteButton.onclick = () => deleteCharacterProfile(profile.id);

details.appendChild(editButton);
details.appendChild(deleteButton);

        card.appendChild(details);
        container.appendChild(card);
    });
}

function escapeProfileText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}
let editingProfileId = null;

// Edit Character Profile
function editCharacterProfile(profileId) {
    let story = stories.find(
        item => item.id === currentWorldStoryId
    );

    if (!story) return;

    let profile = story.world.characterProfiles.find(
        item => String(item.id) === String(profileId)
    );

    if (!profile) return;

    editingProfileId = profileId;

    document.getElementById("profileName").value = profile.name;
    document.getElementById("profileAge").value = profile.age;
    document.getElementById("profileGender").value = profile.gender;
    document.getElementById("profileRole").value = profile.role;
    document.getElementById("profileAppearance").value = profile.appearance;
    document.getElementById("profilePersonality").value = profile.personality;
    document.getElementById("profileBackground").value = profile.background;

    document.getElementById("characterProfiles").scrollIntoView({
        behavior: "smooth"
    });
}

// Delete Character Profile
function deleteCharacterProfile(profileId) {
    let story = stories.find(
        item => item.id === currentWorldStoryId
    );

    if (!story) return;

    let confirmDelete = confirm("Are you sure you want to delete this character?");

    if (!confirmDelete) return;

    story.world.characterProfiles = story.world.characterProfiles.filter(
        item => String(item.id) !== String(profileId)
    );

    saveStories();
    displayCharacterProfiles();

    alert("Character deleted successfully!");
}

function refreshAIStoryOptions() {
    const select = document.getElementById("aiStorySelect");
    if (!select) return;
    const selectedId = select.value;
    select.replaceChildren(new Option("General writing help", ""));
    stories.forEach(story => select.add(new Option(story.title, String(story.id))));
    if (stories.some(story => String(story.id) === selectedId)) {
        select.value = selectedId;
    }
}

function buildAIStoryContext(story) {
    if (!story) return "";

    const parts = [
        `Title: ${story.title || ""}`,
        `Description: ${story.description || ""}`
    ];

    // Story World
    if (story.world) {
        const worldTypes = [
            "characters",
            "places",
            "jewels",
            "groups",
            "others",
            "characterProfiles"
        ];

        worldTypes.forEach(type => {
            const items = story.world[type];

            if (Array.isArray(items) && items.length) {
                const contextItems =
                    type === "characterProfiles"
                        ? items.map(({ image, ...profile }) => profile)
                        : items;

                parts.push(
                    `=== ${type.toUpperCase()} ===\n` +
                    JSON.stringify(contextItems, null, 2)
                );
            }
        });
    }

    // Episodes
    if (Array.isArray(story.episodes)) {
        story.episodes.forEach((episode, index) => {
            const content = document.createElement("div");
            content.innerHTML = episode.content || "";

            parts.push(
                `=== EPISODE ${index + 1} ===\n` +
                `Title: ${episode.title || "Untitled"}\n` +
                `Content:\n${content.innerText || ""}`
            );
        });
    }

    return parts.join("\n\n");
}
function appendAIMessage(role, text) {
    const messages = document.getElementById("aiMessages");
    const message = document.createElement("div");
    message.className = `ai-message ${role}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
}

async function askStoryAI(event) {
    event.preventDefault();
    const input = document.getElementById("aiQuestion");
    const button = document.getElementById("aiSendButton");
    const question = input.value.trim();
    if (!question) return;

    const selectedId = document.getElementById("aiStorySelect").value;
    const story = stories.find(item => String(item.id) === selectedId);
    const history = [...document.querySelectorAll("#aiMessages .ai-message")]
        .filter(message => !message.classList.contains("pending") && !message.classList.contains("error"))
        .map(message => ({
            role: message.classList.contains("user") ? "user" : "assistant",
            content: message.textContent
        }))
        .slice(-8);
    appendAIMessage("user", question);
    input.value = "";
    input.disabled = true;
    button.disabled = true;
    const pending = appendAIMessage("assistant pending", "Thinking…");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question,
                storyContext: buildAIStoryContext(story),
                history
            })
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
            const message = typeof data?.error === "string" && data.error.trim()
                ? data.error
                : `Story AI request failed (HTTP ${response.status}). Make sure the backend server is running and configured.`;
            throw new Error(message);
        }
        if (typeof data?.answer !== "string" || !data.answer.trim()) {
            throw new Error("Story AI returned an empty response. Please try again.");
        }
        pending.textContent = data.answer;
        pending.classList.remove("pending");
    } catch (error) {
        pending.textContent = error.message || "Could not connect to Story AI. Start the project with the backend server and try again.";
        pending.classList.remove("pending");
        pending.classList.add("error");
    } finally {
        input.disabled = false;
        button.disabled = false;
        input.focus();
    }
}

document.getElementById("aiChatForm")?.addEventListener("submit", askStoryAI);
// ===============================
// BACKUP & RESTORE
// ===============================

function exportBackup() {
    const backupData = {
        app: "My Private Story Studio",
        version: 1,
       stories: JSON.parse(localStorage.getItem("myStories") || "[]"),
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob(
        [JSON.stringify(backupData, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "my-private-story-studio-backup.json";
    a.click();

    URL.revokeObjectURL(url);
}

function importBackup(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const backupData = JSON.parse(e.target.result);

            if (!Array.isArray(backupData.stories)) {
                alert("Invalid backup file.");
                return;
            }

          localStorage.setItem(
    "myStories",
    JSON.stringify(backupData.stories)
);

            alert("Backup restored successfully!");

            location.reload();

        } catch (error) {
            alert("Unable to restore backup.");
            console.error(error);
        }
    };

    reader.readAsText(file);
}