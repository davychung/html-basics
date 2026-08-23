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

const activityList = document.getElementById("activity-list");

const totalXPDisplay = document.getElementById("total-xp");

const activityForm = document.getElementById("activity-form");

const levelDisplay = document.getElementById("level");

const xpRates = {
    learning: 20,
    building: 30,
    "problem-solving": 25,
    career: 25,
    creativity: 20
};


function calculateXP(activityType, amount){
    return xpRates[activityType] * amount;
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

    const percentage =
    Math.min((dimensionXP[activityType] / 500) * 100, 100);

    dimensionDisplays[activityType].fill.style.width =
        `${percentage}%`;

    console.log("XP Earned:", xpEarned);

    totalXP += xpEarned;
    console.log(dimensionXP);

    dimensionXP[activityType] += xpEarned;

    dimensionDisplays[activityType].xp.textContent =
    `${dimensionXP[activityType]} XP`;

    totalXPDisplay.textContent = totalXP;

    const currentLevel = calculateLevel(totalXP);
    const currentRank = calculateRank(currentLevel);
    updateLevelProgress(totalXP, currentLevel);
    levelDisplay.textContent = `${currentLevel} (${currentRank})`;

    updateDimensionBars();

    const activityItem = document.createElement("li");

    activityItem.textContent =
        `${activityDescription} — ${activityType} — +${xpEarned} XP`;

    activityList.prepend(activityItem);

    if (activityList.children.length > 5) {
        activityList.removeChild(activityList.lastElementChild);
    }

    console.log("Type:", activityType);
    console.log("Amount:", activityAmount);
    console.log("Description:", activityDescription);
});