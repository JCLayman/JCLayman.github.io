
document.addEventListener("DOMContentLoaded", function () {
    var fields = document.querySelectorAll("input, textarea");

    fields.forEach(function (field) {
        var savedValue = localStorage.getItem(field.id);

        if (savedValue !== null) {
            if (field.type === "checkbox" || field.type === "radio") {
                field.checked = savedValue === "true";
            } else {
                field.value = savedValue;
            }
        }

        field.addEventListener("input", function () {
            if (field.id) {
                if (field.type === "checkbox" || field.type === "radio") {
                    localStorage.setItem(field.id, field.checked);
                } else {
                    localStorage.setItem(field.id, field.value);
                }
            }
            updateAllCalculatedValues();
            checkDeathSaves();
        });

        if (field.type === "radio") {
            field.addEventListener("change", function () {
                if (field.id) {
                    localStorage.setItem(field.id, field.checked);
                }
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
        var value = parseInt(inputElement.value);
        if (!isNaN(value)) {
            return getModifier(value);
        }
    }
    return 0;
}

function updateAllCalculatedValues() {
    var proficiencyBonusElement = document.getElementById("proficiency-value");
    var proficiencyBonus = 0;
    if (proficiencyBonusElement && !isNaN(parseInt(proficiencyBonusElement.value))) {
        proficiencyBonus = parseInt(proficiencyBonusElement.value);
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
        var bonus = (bonusInput && !isNaN(parseInt(bonusInput.value))) ? parseInt(bonusInput.value) : 0;
        var proficient = (checkbox && checkbox.checked);
        var total = baseMod + bonus + (proficient ? proficiencyBonus : 0);
        var spanOutput = document.getElementById(ability + "-saving-value");
        if (spanOutput) {
            spanOutput.textContent = (total >= 0 ? "+" : "") + total;
        }
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
        var bonus = (bonusInput && !isNaN(parseInt(bonusInput.value))) ? parseInt(bonusInput.value) : 0;
        var proficient = (checkbox && checkbox.checked);
        var total = baseMod + bonus + (proficient ? proficiencyBonus : 0);
        var spanOutput = document.getElementById(skill.id + "-value");
        if (spanOutput) {
            spanOutput.textContent = (total >= 0 ? "+" : "") + total;
        }
    });
}

function checkDeathSaves() {
    var successCount = 0;
    var failureCount = 0;

    for (var i = 1; i <= 3; i++) {
        var successRadio = document.getElementById("radio-success" + i);
        var failRadio = document.getElementById("radio-fail" + i);

        if (successRadio && successRadio.checked) {
            successCount++;
        }
        if (failRadio && failRadio.checked) {
            failureCount++;
        }
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
        var successRadio = document.getElementById("radio-success" + i);
        var failRadio = document.getElementById("radio-fail" + i);

        if (successRadio) {
            successRadio.checked = false;
            localStorage.setItem(successRadio.id, false);
        }
        if (failRadio) {
            failRadio.checked = false;
            localStorage.setItem(failRadio.id, false);
        }
    }
}

function rollDice(sides) {
    var result = Math.floor(Math.random() * sides) + 1;
    alert("You rolled a d" + sides + ": " + result);
}
