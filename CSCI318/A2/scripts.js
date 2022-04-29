// Just using the same values made at the top of the page.
const attributePool = {
    type: ["Cat", "Dog", "Bird"],
    color: ["Blue", "Red", "Green"],
    name: ["James", "Tim", "Bob"],
    diet: ["Rats", "Birdseed", "Apples"],
    owner: ["Jim", "Jane", "Bryce"],
    numLegs: ["<4", "4", ">4"],
    age: ["<10", "10", ">10"],
    numEyes: ["<2", "2", ">2"],
    height: ["<40", "40", ">40"],	// in centimeters?
    weight: ["<1000", "1000", ">1000"]  // in grams?
};

const stateDefault = `{
    "candidates":[],
    "petList":[],
    "errorPct":0.01,
    "initialized":false,
    "numberOfCategoriesAndChoices":0,
    "numTests":1000,
    "numCandidates":50
}`;

//Not sure if this is an ideal way to deep copy from stateDefault.
//But it prevents us from needing to modify the default state in multiple places.
let state = JSON.parse(stateDefault);

let logger = {
    write: function (input) {
        document.getElementById("console-output").value += `${input}\n\n`;
        document.getElementById("console-output").scrollTop = document.getElementById("console-output").scrollHeight;
    },
    error: function (input) {
        document.getElementById("console-output").value += `ERROR: ${input}\n\n`;
        document.getElementById("console-output").scrollTop = document.getElementById("console-output").scrollHeight;
    },
    clear: function () {
        document.getElementById("console-output").value = "";
    }
};

function createSelectList() {
    let createPetCheckbox = document.getElementById("create-pet-checkbox").checked;
    if (createPetCheckbox) {
        let label, select, option, container = document.createElement("div");

        for (attribute in attributePool) {
            selectBox = document.createElement("label");
            selectBox.setAttribute("for", attribute);
            label = document.createElement("span");
            label.innerText = attribute + ": ";
            select = document.createElement("select");
            select.setAttribute("name", attribute);
            select.setAttribute("id", attribute);

            for (element in attributePool[attribute]) {
                option = document.createElement("option");
                option.setAttribute("value", attributePool[attribute][element]);
                option.innerText = attributePool[attribute][element];
                select.appendChild(option);
            }
            selectBox.appendChild(label);
            selectBox.appendChild(select);
            container.appendChild(selectBox);
        }
        document.getElementById("error-region-selectboxes").appendChild(container);
    } else {
        document.getElementById("error-region-selectboxes").innerHTML = "";
    }
}

function displayPETsGenerated() {
    if (state.petList.length === 0) {
        console.warn(`There is currently no data in the state.petList array. Run generateAllPetCombinations() first to fix this.`);
    }

    logger.write(`Number of PETs generated: ${state.petList.length}`);
    for (let i = 0; i < ((state.petList.length > 1000) ? 1000 : state.petList.length); i++) {
        logger.write(`PET Index[${i}]:(${state.petList[i].type},${state.petList[i].color},${state.petList[i].name},${state.petList[i].diet},${state.petList[i].owner},${state.petList[i].numLegs},${state.petList[i].age},${state.petList[i].numEyes},${state.petList[i].height},${state.petList[i].weight})`);
    }
}

/*This is how the distance is calculated between the two objects*/
/*Need to work out how to compensate for the circumstance that one object might not have the same properties as another*/
/*e.g. If Pet_0 has a property 'Name', but Pet_1 does not. Then the distance between them would be increased by 1*/
function getDistance(object_x, object_y) {
    let distance = 0;
    for (key in attributePool) {
        if (object_x[key] != object_y[key])
            distance++;
    }
    return distance;
}

//The maximum and the minimum are inclusive
function getRandomInt(min, max) {
    if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max < 0) {
        console.error(`getRandomInt(number: min, number: max) requires two positive integers. min=${min} and max=${max} are not valid arguments.`);
        return null;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCandiates() {
    if (state.petList.length === 0) {
        console.error(`Cannot generate candidates. There is currently no data in the state.petList array. Run generateAllPetCombinations() first to fix this.`);
        return null;
    }
    for (let i = 0; i < state.numCandidates; i++) {
        state.candidates[i] = state.petList[getRandomInt(0, state.petList.length - 1)];
    }
}

//This creates S set for a candidate (see Article 2 for knowledge on S set)
function returnObjectChoicePosition(pet) {
    let i, categoriesAndChoices = new Array(state.numberOfCategoriesAndChoices);

    for (i = 0; i < state.numberOfCategoriesAndChoices; i++) {
        categoriesAndChoices[i] = 0;
    }

    i = 0;
    for (attribute in pet) {
        if (attribute in attributePool) {
            categoriesAndChoices[i + (attributePool[attribute].indexOf(pet[attribute]) + 1)] = 1;
            i += attributePool[attribute].length + 1;
        }
    }
    return categoriesAndChoices;
}

//Calculates the distance between the candidate S set and the 'main' S set
function calculate_sum_distance(numTestCases, S_array, candidate_S) {
    let i, sum = 0;
    for (i = 0; i < state.numberOfCategoriesAndChoices; i++) {
        if (candidate_S[i] == 1) {
            sum += (numTestCases - S_array[i]);
        }
    }
    return sum;
}

function generateErrorRegion() {
    let numErrItems = Math.floor(state.errorPct * state.petList.length);
    logger.write(`Generating error region: ${state.errorPct} x ${state.petList.length} = ${numErrItems}`);
    let startIdx;

    if (document.getElementById("create-pet-checkbox").checked) {
        //read checkbox values and search for that pet in array
        //set startIdx to index of that pet

        let customPet = {
            type: document.getElementById("type").value,
            color: document.getElementById("color").value,
            name: document.getElementById("name").value,
            diet: document.getElementById("diet").value,
            owner: document.getElementById("owner").value,
            numLegs: document.getElementById("numLegs").value,
            age: document.getElementById("age").value,
            numEyes: document.getElementById("numEyes").value,
            height: document.getElementById("height").value,
            weight: document.getElementById("weight").value
        };
        logger.write(`Custom pet:\n${JSON.stringify(customPet)}`);
        let attMatches;
        for (element in state.petList) {
            attMatches = 0;
            for (attribute in customPet) {
                if (customPet[attribute] != state.petList[element][attribute]) {
                    break;
                }
                attMatches++;
            }
            if (attMatches === 10) {
                startIdx = element;
                break;
            }
        }
        logger.write(`Using custom pet @ index ${startIdx}.`);
        logger.write(`Found pet:\n${JSON.stringify(state.petList[startIdx])}`);
    } else {
        startIdx = getRandomInt(0, state.petList.length - 1);
        logger.write(`Using random pet @ index ${startIdx}.`);
        logger.write(`Found pet:\n${JSON.stringify(state.petList[startIdx])}`);
    }
    state.petList[startIdx].error = true;
    for (let diffThreshold = 0; diffThreshold < 11; diffThreshold++) {
        for (let petIdx = 0; petIdx < state.petList.length; petIdx++) {
            if (getDistance(state.petList[startIdx], state.petList[petIdx]) <= diffThreshold) {
                state.petList[petIdx].error = true;
                numErrItems--;
            }
            if (numErrItems === 0) {
                logger.write(`Generation of error region complete...`);
                return;
            }
        }
    }
}

function generateAllPetCombinations() {
    if (!state.initialized) {
        for (let typesIndex = 0; typesIndex < attributePool.type.length; typesIndex++) {
            for (let colorsIndex = 0; colorsIndex < attributePool.color.length; colorsIndex++) {
                for (let namesIndex = 0; namesIndex < attributePool.name.length; namesIndex++) {
                    for (let dietsIndex = 0; dietsIndex < attributePool.diet.length; dietsIndex++) {
                        for (let ownersNameIndex = 0; ownersNameIndex < attributePool.owner.length; ownersNameIndex++) {
                            for (let numOfLegsIndex = 0; numOfLegsIndex < attributePool.numLegs.length; numOfLegsIndex++) {
                                for (let ageIndex = 0; ageIndex < attributePool.age.length; ageIndex++) {
                                    for (let numOfEyesIndex = 0; numOfEyesIndex < attributePool.numEyes.length; numOfEyesIndex++) {
                                        for (let heightIndex = 0; heightIndex < attributePool.height.length; heightIndex++) {
                                            for (let weightIndex = 0; weightIndex < attributePool.weight.length; weightIndex++) {
                                                state.petList.push({
                                                    type: attributePool.type[typesIndex],
                                                    color: attributePool.color[colorsIndex],
                                                    name: attributePool.name[namesIndex],
                                                    diet: attributePool.diet[dietsIndex],
                                                    owner: attributePool.owner[ownersNameIndex],
                                                    numLegs: attributePool.numLegs[numOfLegsIndex],
                                                    age: attributePool.age[ageIndex],
                                                    numEyes: attributePool.numEyes[numOfEyesIndex],
                                                    height: attributePool.height[heightIndex],
                                                    weight: attributePool.weight[weightIndex],
                                                    error: false
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        for (attribute in attributePool) {
            state.numberOfCategoriesAndChoices += attributePool[attribute].length + 1;
        }
        state.initialized = true;
        logger.write(`Finished generating all pet combinations.`);
    } else {
        logger.error(`state.petList has already been initialized. Clear the petList and set state.initialized = false before continuing.`);
    }
}

function ART() {
    let S = new Array(state.numberOfCategoriesAndChoices);
    let k;
    for (k = 0; k < state.numberOfCategoriesAndChoices; k++) {
        S[k] = 0; //init S set
    }

    let E = []; //past test cases
    let test_case; //is initialized by either the first test case or the candidate with the largest distance
    let breakLoop = false;
    let n = 0;

    //let g; //for loop needs to be replaced with while(condition- failed test case)
    while (breakLoop === false) {
        n++; //dont ask me why n is incremented here rather than at the end of the loop... the paper told me to do it.

        if (n === 1) {
            test_case = state.petList[getRandomInt(0, state.petList.length - 1)];
        } else {
            generateCandiates(); //generate state.candidate

            let max_sum = -1;
            let current_sum;
            let candidate;
            let candidate_S;
            let max_candidate_index = -1;

            let j;
            for (j = 0; j < state.candidates.length; j++) { //calculating the candidate with teh max distance between it and the S set
                candidate = state.candidates[j];
                candidate_S = returnObjectChoicePosition(candidate);
                current_sum = calculate_sum_distance(n - 1, S, candidate_S);

                if (current_sum > max_sum) {
                    max_sum = current_sum;
                    max_candidate_index = j;
                }
            }
            test_case = state.candidates[max_candidate_index];
            if (test_case.error === true) {
                breakLoop = true;
            }
        }

        E[n - 1] = test_case;

        let i; //incrementing S set accordingly
        let S_test_case = returnObjectChoicePosition(test_case);
        for (i = 0; i < S.length; i++) {
            if (S_test_case[i] == 1) {
                S[i]++;
            }
        }
    }
    return n;
}

function RT() {
    let numberOfCorrectPets = 0;
    while (!state.petList[getRandomInt(0, state.petList.length - 1)].error) { // If the pet is having error: false
        numberOfCorrectPets++;
    }
    return numberOfCorrectPets;
}

function RUN() {
    if (!state.initialized) {
        logger.error(`The app has not been initialized. Please call initalize() first before attempting to run.`);
    } else {
        logger.write(`Running ${state.numTests} tests...`);
        let ARTwins = 0, RTwins = 0, ties = 0, artTemp, rtTemp;

        for (let i = 0; i < state.numTests; i++) {
            artTemp = ART();
            rtTemp = RT();
            if (artTemp > rtTemp) {
                RTwins++;
            } else if (artTemp < rtTemp) {
                ARTwins++;
            } else {
                ties++;
            }
        }
        logger.write(`SUMMARY:\nARTwins: ${ARTwins}\nRTwins: ${RTwins}\nTies: ${ties}`);
    }
}

function initialize() {
    if (state.initialized) {
        if (confirm(`Do you want to reinitialize the dataset?\n\nCurrent data:\n-Error percentage: ${state.errorPct * 100}%\n-Pet list contains: ${state.petList.length} pet(s).`)) {
            state = JSON.parse(stateDefault);
            initialize();
        }
    } else {
        let userErrorPercentInput = parseFloat(document.getElementById("userErrorPercent").value);
        let userNumberOfTests = parseInt(document.getElementById("userNumberOfTests").value);

        if (userErrorPercentInput < 100 && userErrorPercentInput > 0) {
            state.errorPct = userErrorPercentInput / 100; //convert to percentage
            logger.write(`---------------------------------------------------------------------------`);
            logger.write(`Error region percent set to ${state.errorPct * 100}%...`);
        } else {
            document.getElementById("userErrorPercent").value = state.errorPct * 100;
            logger.write(`---------------------------------------------------------------------------`);
            logger.write(`Default error region percent set to ${state.errorPct * 100}%...`);
        }

        if (userNumberOfTests > 0) {
            state.numTests = userNumberOfTests;
            logger.write(`Number of tests set to ${state.numTests}...`);
            logger.write(`---------------------------------------------------------------------------`);
        } else {
            document.getElementById("userNumberOfTests").value = state.numTests;
            logger.write(`Default number of tests set to ${state.numTests}...`);
            logger.write(`---------------------------------------------------------------------------`);
        }
        generateAllPetCombinations();
        generateErrorRegion();
        logger.write(`Initialization process now complete.`);
        logger.write(`---------------------------------------------------------------------------`);
    }
}
