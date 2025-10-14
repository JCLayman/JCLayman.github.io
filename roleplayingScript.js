document.addEventListener("DOMContentLoaded", function () {
    var fields = document.querySelectorAll("input, textarea");

    fields.forEach(function (field) {
        var savedValue = localStorage.getItem(field.id);

        if (savedValue !== null) {
            if (field.type === "checkbox") {
                field.checked = savedValue === "true";
            } else {
                field.value = savedValue;
            }
        }

        if (field.type === "checkbox") {
            field.addEventListener("change", function () {
                if (field.id) localStorage.setItem(field.id, field.checked);
                updateAllCalculatedValues();
                checkDeathSaves();
            });
        } else {
            field.addEventListener("input", function () {
                if (field.id) localStorage.setItem(field.id, field.value);
                updateAllCalculatedValues();
                checkDeathSaves();
            });
        }
    });

    var resetBtn = document.getElementById("reset-button");
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            localStorage.clear();
            location.reload();
        });
    }

    updateAllCalculatedValues();
    checkDeathSaves();
});

function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function getModifierFromInput(id) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        var value = parseInt(inputElement.value, 10);
        if (!isNaN(value)) return getModifier(value);
    }
    return 0;
}

function updateAllCalculatedValues() {
    var proficiencyBonusElement = document.getElementById("proficiency-value");
    var proficiencyBonus = 0;
    if (proficiencyBonusElement) {
        var pb = parseInt(proficiencyBonusElement.value, 10);
        if (!isNaN(pb)) proficiencyBonus = pb;
    }

    var abilities = {
        strength: getModifierFromInput("strength-value"),
        dexterity: getModifierFromInput("dexterity-value"),
        constitution: getModifierFromInput("constitution-value"),
        intelligence: getModifierFromInput("intelligence-value"),
        wisdom: getModifierFromInput("wisdom-value"),
        charisma: getModifierFromInput("charisma-value")
    };

    for (var key in abilities) {
        var modSpan = document.getElementById(key + "-mod");
        if (modSpan) {
            var modValue = abilities[key];
            modSpan.textContent = (modValue >= 0 ? "+" : "") + modValue;
        }
    }

    for (var ability in abilities) {
        var baseMod = abilities[ability];
        var checkbox = document.querySelector("#" + ability + "-saving-throw .proficiency-checkbox");
        var bonusInput = document.getElementById(ability + "-saving-bonus");
        var bonus = 0;
        if (bonusInput) {
            var b = parseInt(bonusInput.value, 10);
            if (!isNaN(b)) bonus = b;
        }
        var proficient = !!(checkbox && checkbox.checked);
        var total = baseMod + bonus + (proficient ? proficiencyBonus : 0);
        var spanOutput = document.getElementById(ability + "-saving-value");
        if (spanOutput) spanOutput.textContent = (total >= 0 ? "+" : "") + total;
    }

    var skillList = [
        { id: "acrobatics", ability: "dexterity" },
        { id: "animal-handling", ability: "wisdom" },
        { id: "arcana", ability: "intelligence" },
        { id: "athletics", ability: "strength" },
        { id: "deception", ability: "charisma" },
        { id: "history", ability: "intelligence" },
        { id: "insight", ability: "wisdom" },
        { id: "intimidation", ability: "charisma" },
        { id: "investigation", ability: "intelligence" },
        { id: "medicine", ability: "wisdom" },
        { id: "nature", ability: "intelligence" },
        { id: "perception", ability: "wisdom" },
        { id: "performance", ability: "charisma" },
        { id: "persuasion", ability: "charisma" },
        { id: "religion", ability: "intelligence" },
        { id: "sleight", ability: "dexterity" },
        { id: "stealth", ability: "dexterity" },
        { id: "survival", ability: "wisdom" }
    ];

    skillList.forEach(function (skill) {
        var baseMod = abilities[skill.ability];
        var checkbox = document.querySelector("#" + skill.id + " .proficiency-checkbox");
        var bonusInput = document.getElementById(skill.id + "-bonus");
        var bonus = 0;
        if (bonusInput) {
            var b = parseInt(bonusInput.value, 10);
            if (!isNaN(b)) bonus = b;
        }
        var proficient = !!(checkbox && checkbox.checked);
        var total = baseMod + bonus + (proficient ? proficiencyBonus : 0);
        var spanOutput = document.getElementById(skill.id + "-value");
        if (spanOutput) spanOutput.textContent = (total >= 0 ? "+" : "") + total;
    });
}

function checkDeathSaves() {
    var successCount = 0;
    var failureCount = 0;

    for (var i = 1; i <= 3; i++) {
        var successCheck = document.getElementById("checkbox-success" + i);
        var failCheck = document.getElementById("checkbox-fail" + i);

        if (successCheck && successCheck.checked) successCount++;
        if (failCheck && failCheck.checked) failureCount++;
    }

    if (successCount === 3) {
        alert("Congratulations, you are alive and well! :)");
        resetDeathSaves();
    } else if (failureCount === 3) {
        alert("Uh oh, you have died! :(");
        resetDeathSaves();
    }
}

function resetDeathSaves() {
    for (var i = 1; i <= 3; i++) {
        var successCheck = document.getElementById("checkbox-success" + i);
        var failCheck = document.getElementById("checkbox-fail" + i);

        if (successCheck) {
            successCheck.checked = false;
            localStorage.setItem(successCheck.id, false);
        }
        if (failCheck) {
            failCheck.checked = false;
            localStorage.setItem(failCheck.id, false);
        }
    }
}

function rollDice(sides) {
    var result = Math.floor(Math.random() * sides) + 1;
    alert("You rolled a d" + sides + ": " + result);
}
