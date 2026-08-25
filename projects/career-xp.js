let totalXP = 0;

const dimensionDisplays = {
    "problem-solving": {
        xp: document.getElementById("problem-solving-xp"),
        fill: document.getElementById("problem-solving-fill")
    },

    building: {
        xp: document.getElementById("building-xp"),
        fill: document.getElementById("building-fill")
    },

    learning: {
        xp: document.getElementById("learning-xp"),
        fill: document.getElementById("learning-fill")
    },

    career: {
        xp: document.getElementById("career-xp"),
        fill: document.getElementById("career-fill")
    },

    creativity: {
        xp: document.getElementById("creativity-xp"),
        fill: document.getElementById("creativity-fill")
    }
};

const nextLevelText = document.getElementById("next-level-text");
const levelProgressFill = document.getElementById("level-progress-fill");

const dimensionXP = {
    learning: 0,
    building: 0,
    "problem-solving": 0,
    career: 0,
    creativity: 0
};

const careerEvents = [];

const activityList = document.getElementById("activity-list");

const totalXPDisplay = document.getElementById("total-xp");

const activityForm = document.getElementById("activity-form");

const levelDisplay = document.getElementById("level");

const activityRules = {
    learning: {
        xpPerHour: 20,
        dimensions: {
            learning: 1
        }
    },

    leetcode: {
        xpPerHour: 25,
        dimensions: {
            "problem-solving": 0.7,
            learning: 0.3
        }
    },

    "project-work": {
        xpPerHour: 30,
        dimensions: {
            building: 0.6,
            "problem-solving": 0.2,
            creativity: 0.2,
        }
    }
};


function calculateXP(activityType, amount){
    const rule = activityRules[activityType];

    return rule.xpPerHour * amount;
}

function allocateDimensionXP(activityType, xpEarned) {
    const dimensions = activityRules[activityType].dimensions;
    const dimensionAllocations ={};

    for (const dimension in dimensions) {
        const allocation = dimensions[dimension];
        const allocatedXP = xpEarned * allocation;
        
        dimensionXP[dimension] += allocatedXP;
        dimensionAllocations[dimension] = allocatedXP;

        dimensionDisplays[dimension].xp.textContent =
            `${dimensionXP[dimension]} XP`;
    }
    
    return dimensionAllocations;
}

function calculateLevel(totalXP) {
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

function calculateRank(level) {
    if (level <= 5) {
        return "Student";
    } else if (level <= 10) {
        return "Intern";
    } else if (level <= 20) {
        return "Junior";
    } else if (level <= 35) {
        return "Mid";
    } else {
        return "Senior";
    }
}

function updateDimensionBars() {
    for (const dimension in dimensionXP) {
        const percentage =
            totalXP === 0
                ? 0
                : (dimensionXP[dimension] / totalXP) * 100;

        dimensionDisplays[dimension].fill.style.width =
            `${percentage}%`;
    }
}

function updateLevelProgress(totalXP, currentLevel) {
    const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
    const nextLevelXP = Math.pow(currentLevel, 2) * 100;

    const xpIntoLevel = totalXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const xpRemaining = nextLevelXP - totalXP;

    const percentage =
        (xpIntoLevel / xpNeededForLevel) * 100;

    nextLevelText.textContent =
        `${xpRemaining} XP to Level ${currentLevel + 1}`;

    levelProgressFill.style.width =
        `${percentage}%`;
}

function createCareerEvent(
    activityType,
    amount,
    activityDescription,
    xpEarned,
    dimensionAllocations
) {
    return{
        id: Date.now(),
        type: activityType,
        amount,
        description: activityDescription,
        xpEarned,
        dimensions: dimensionAllocations,
        createdAt: new Date().toISOString()
    };
}

function renderRecentActivity(careerEvent){
    const activityItem = document.createElement("li");

    activityItem.textContent =
        `${careerEvent.description} — ${careerEvent.type} — +${careerEvent.xpEarned} XP`;

    activityList.prepend(activityItem);

    if (activityList.children.length > 5) {
        activityList.removeChild(activityList.lastElementChild);
    }
}

activityForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const activityType = document.getElementById("activity-type").value;
    const activityAmount = document.getElementById("activity-amount").value;
    const activityDescription = document.getElementById("activity-description").value;

    const amount = Number(activityAmount);
    if (amount <= 0) {
        return;
    }

    const xpEarned = calculateXP(activityType, amount);

    console.log("XP Earned:", xpEarned);

    totalXP += xpEarned;
    const dimensionAllocations = allocateDimensionXP(activityType, xpEarned);

    const careerEvent = createCareerEvent(
    activityType,
    amount,
    activityDescription,
    xpEarned,
    dimensionAllocations
    );
    
    careerEvents.unshift(careerEvent);

    console.log("Career Event:", careerEvent);
    console.log("All Career Events:", careerEvents);

    console.log(dimensionXP);

    totalXPDisplay.textContent = totalXP;

    const currentLevel = calculateLevel(totalXP);
    const currentRank = calculateRank(currentLevel);
    updateLevelProgress(totalXP, currentLevel);
    levelDisplay.textContent = `${currentLevel} (${currentRank})`;

    updateDimensionBars();

    renderRecentActivity(careerEvent);

    console.log("Type:", activityType);
    console.log("Amount:", activityAmount);
    console.log("Description:", activityDescription);
});