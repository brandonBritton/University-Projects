let state = {
  testCases: [],
  lastRT: null,
  candidates: [],
  failRegion: {
    coords: { 'x': null, 'y': null },
    edgeSize: null,
    area: null
  },
  canvasSize: null,
  canvasCtxART: null,
  canvasCtxRT: null,
  collisionART: false,
  collisionRT: false,
  loopCount: 0,
  numberOfTests: 1,
  numberOfWinsART: 0,
  numberOfWinsRT: 0,
  numberOfTies: 0
};

//calculates the smallest distance between a candidate case, and all current test cases
function calcMinDistance(candidate) {
  let min_distance = -1;  //smallest distance after measuring distance between candidate and all other test cases
  let di = -1;            //distance between the candidate and all test cases

  for (let i = 0; i < state.testCases.length; i++) {     //iterating through each test case
    di = Math.sqrt(Math.pow((candidate.x - state.testCases[i].x), 2) + Math.pow((candidate.y - state.testCases[i].y), 2));   //equation for measuring distance
    if (i === 0) {
      min_distance = di;//assume the first distance is the smallest
    }
    if (di < min_distance) {
      min_distance = di;
    }
  }
  return min_distance;
}

function getNextARTTestCase() {
  /*implementation of the ART algorithm*/
  let d = 0;
  genNewCandidates();
  let t;
  let di;
  for (let i = 0; i < state.candidates.length; i++) {
    di = calcMinDistance(state.candidates[i]);
    if (di > d) {
      d = di;
      t = state.candidates[i];
    }
  }
  state.testCases.push(t);
  checkForCollisionART();
}

function getNextRTTestCase() {
  /*implementaion of RT*/
  state.lastRT = generateRandomPoint();
  checkForCollisionRT();
}

function genNewCandidates() {
  /*generates a fresh set of candidates*/
  for (let i = 0; i < 10; i++) {     //randomly generate new set of candidates
    state.candidates[i] = generateRandomPoint();
  }
}

/*generates a random point on the canvas*/
function generateRandomPoint() {
  return { 'x': Math.random() * state.canvasSize, 'y': Math.random() * state.canvasSize };
}

function initBlankCanvas() {
  /*initializes both blank canvas elements*/
  if (state.canvasSize === null) {
    console.error(`Need to initialize state.canvasSize before trying to initialize the canvas.`);
    return;
  }

  //this is probably slow - needs optimizing - altered for readability
  //sets height and width based on edge_size
  document.getElementById("artContainer").innerHTML = `
    <h2>ART</h2>
    <canvas id="myCanvasART" width="${state.canvasSize}" height="${state.canvasSize}"></canvas>
    <h3 id="artOutput" class="output"></h3>
	<h5 id="artCounter" class="output"></h5>
	<h5 id="numberOfTestsOutput" class="output"></h5>
	<h6 id="automatedTestOutput" class="output"></h6>`;
  document.getElementById("rtContainer").innerHTML = `
    <h2>RT</h2>
    <canvas id="myCanvasRT" width="${state.canvasSize}" height="${state.canvasSize}"></canvas>
    <h3 id="rtOutput" class="output"></h3>
  <h5 id="rtCounter" class="output"></h5>`;
  state.canvasCtxART = document.getElementById("myCanvasART").getContext("2d");     //setting up canvas stuff
  state.canvasCtxRT = document.getElementById("myCanvasRT").getContext("2d");
}

function initState() {
  /*performs the app state initialization*/
  state.testCases = [];
  state.collisionART = false;
  state.collisionRT = false;
  state.loopCount = 1;
  state.lastRT = null;
  state.manualAdvance = document.getElementById("manual").checked;

  let fail_region_percent = parseFloat(document.getElementById("failPct").value) / 100;  //user will change this

  //sets percentage to 1 if no value is assigned, or if value is out of range
  if (isNaN(fail_region_percent) || fail_region_percent > 1 || fail_region_percent <= 0) {
    fail_region_percent = 0.01;
    document.getElementById("failPct").value = "1";
    console.log(`Using default fail_region_percent value of (1)`);
  }

  console.log(`Using failure pct: ${fail_region_percent}`);

  let edge_size = parseInt(document.getElementById("edgeSize").value);  //change this to set the HxW of the canvas

  //sets edge size to 500px if no value is given or value is out of range
  if (isNaN(edge_size) || edge_size < 300 || edge_size > 800) {
    edge_size = 500;
    document.getElementById("edgeSize").value = "500";
    console.warn(`edge_size is out of bounds (300px-800px). Using default edge_size value of 500px.`);
  }

  console.log(`Using edge size: ${edge_size}px`);

  let fail_region_edge_size = Math.sqrt(edge_size * edge_size * fail_region_percent);  //width and height of fail region

  let border_limit_max = edge_size - fail_region_edge_size; //determines the maximum x and y coordinate for the fail region to prevent the fail region from being cut off by the border

  let random_x = Math.random() * border_limit_max;  //generates a random number inclusively between 0 and the border_limit_max
  let random_y = Math.random() * border_limit_max;  //" "

  //update app state
  state.failRegion.edgeSize = fail_region_edge_size;
  state.failRegion.coords.x = random_x;
  state.failRegion.coords.y = random_y;
  state.failRegion.area = fail_region_percent;
  state.canvasSize = edge_size;
  state.testCases.push(generateRandomPoint());
  state.lastRT = state.testCases[0];
  initBlankCanvas();
  drawErrorRegion(1, "green");
  drawErrorRegion(2, "green");
  checkForCollisionART();
  checkForCollisionRT();
  checkForTie();
}

function checkForCollisionRT() {
  //let point = generateRandomPoint();
  //state.lastRT = point;
  if (state.lastRT.x >= state.failRegion.coords.x && state.lastRT.x <= (state.failRegion.coords.x + state.failRegion.edgeSize)
    && state.lastRT.y >= state.failRegion.coords.y && state.lastRT.y <= (state.failRegion.coords.y + state.failRegion.edgeSize)) {
    console.log("collisionRT");
    document.getElementById("rtOutput").innerHTML = `HIT!✔️`;
    state.collisionRT = true;
    state.numberOfWinsRT++;
    drawErrorRegion(2, "red");
  }
  drawLastTestCase(2);
}

function checkForCollisionART() {
  //collisionART demonstration
  let i = state.testCases.length - 1; //'i' is the test case index to check for collisions with
  if (state.testCases[i].x >= state.failRegion.coords.x && state.testCases[i].x <= (state.failRegion.coords.x + state.failRegion.edgeSize)
    && state.testCases[i].y >= state.failRegion.coords.y && state.testCases[i].y <= (state.failRegion.coords.y + state.failRegion.edgeSize)) {
    console.log("collisionART");
    document.getElementById("artOutput").innerHTML = `HIT!✔️`;
    state.collisionART = true;
    state.numberOfWinsART++;
    drawErrorRegion(1, "red");
  }
  drawLastTestCase(1); //this gets drawn last over the top of whatever else is there
}

// Needs to be BADLY refactored coz now it is aids
function drawErrorRegion(canvas, color) {
  let ctx;
  if (canvas === 1) {
    ctx = state.canvasCtxART;
  } else if (canvas === 2) {
    ctx = state.canvasCtxRT;
  } else {
    console.error(`drawErrorRegion(canvas: number, color: string) must be called with canvas = 1 or 2. canvas = ${canvas} is not a valid argument.`);
    return;
  }
  if (color !== "green" && color !== "red") {
    console.error(`drawErrorRegion(canvas: number, color: string) must be called with color = "green" or "red". color = ${color} is not a valid argument.`);
    return;
  }
  ctx.fillStyle = color;                            //colour of fail region
  ctx.fillRect(state.failRegion.coords.x, state.failRegion.coords.y, state.failRegion.edgeSize, state.failRegion.edgeSize);//rendering the fail region
}

function drawLastTestCase(canvas) {
  let ctx;
  if (canvas === 1) {
    ctx = state.canvasCtxART;
    //drawing a square is more performant than drawing a circle
    ctx.fillStyle = "black";                            //colour of fail region
    ctx.fillRect(state.testCases[state.testCases.length - 1].x, state.testCases[state.testCases.length - 1].y, 2, 2); //rendering the test case
  } else if (canvas === 2) {
    ctx = state.canvasCtxRT;
    //drawing a square is more performant than drawing a circle
    ctx.fillStyle = "black";                            //colour of fail region
    ctx.fillRect(state.lastRT.x, state.lastRT.y, 2, 2); //rendering the test case
  } else {
    console.error(`drawLastTestCase(canvas: number) must be called with canvas = 1 or 2. drawLastTestCase(${canvas}) is not a valid argument.`);
  }
}

function checkForTie() {
  if (state.collisionART === true && state.collisionRT === true) {
    document.getElementById("artOutput").innerHTML = `TIE!`;
    document.getElementById("rtOutput").innerHTML = ``;
    state.numberOfTies++;
    // Currently, when there is a tie, both RT and ART are incremented as win each too. So here's the band-aid fix.
    state.numberOfWinsART--;
    state.numberOfWinsRT--;
  }
}

function advance() {
  if (state.collisionART === false && state.collisionRT === false) {
    state.loopCount++;
    getNextARTTestCase();
    getNextRTTestCase();
    checkForTie();
    document.getElementById("artCounter").innerHTML = "Test case: " + state.loopCount;
  } else {
    console.log("Ended");
    return;
  }
}

function driver() {
  initState();
  if (state.manualAdvance === true) {
    document.getElementById("manualButton").disabled = false;
    document.getElementById("artCounter").innerHTML = "Test case: " + state.loopCount;
    return;
  } else {
    document.getElementById("manualButton").disabled = true;
  }

  // Added this extra condition so that when race is intitiated, it will go as fast as possible regardless of failure rate percentage
  if (state.failRegion.area < 0.001 || document.getElementById("testInput").value !== "") {
    while (state.collisionART === false && state.collisionRT === false) {
      state.loopCount++;
      getNextARTTestCase();
      getNextRTTestCase();
      checkForTie();
    }
    document.getElementById("artCounter").innerHTML = "Test case: " + state.loopCount;
  } else {

    let loop = setInterval(function () {
      if (state.collisionART === true || state.collisionRT === true) {
        clearInterval(loop);
      } else {
        state.loopCount++;
        document.getElementById("artCounter").innerHTML = "Test case: " + state.loopCount;
        getNextARTTestCase();
        getNextRTTestCase();
        checkForTie();
      }
    }, 1);
  }
}

// Resets UI when the checkbox is selected for the races
function resetInterfaceState() {
  let checkBox = document.getElementById("manual");
  if (checkBox.checked == true) {
    checkBox.checked = false;
    document.getElementById("manualButton").disabled = true;
  }
  startTest();
}

function startTest() {
  // Reset values to 0.
  state.numberOfTies = 0;
  state.numberOfWinsART = 0;
  state.numberOfWinsRT = 0;

  //sets the number of tests to 1000 if a value is not assigned, or value is below 1
  let tempNumberOfTests = parseInt(document.getElementById("testInput").value);

  if (tempNumberOfTests < 1 || isNaN(tempNumberOfTests)) {
    state.numberOfTests = 1000;
    document.getElementById("testInput").value = "1000";
    console.log(`Using default numberOfTests: ${state.numberOfTests}`);
  }
  else {
    state.numberOfTests = tempNumberOfTests;
    console.log(`Value of numberOfTests: ${state.numberOfTests}`);
  }

  for (let i = 0; i < state.numberOfTests; i++) {
    driver();
  }

  // Declutter output when automated test is run.
  document.getElementById("artOutput").innerHTML = "";
  document.getElementById("rtOutput").innerHTML = "";
  document.getElementById("artCounter").innerHTML = "";

  // Final Output
  document.getElementById("numberOfTestsOutput").innerHTML = "Number of Tests: " + state.numberOfTests;
  document.getElementById("automatedTestOutput").innerHTML = "ART Wins: " + state.numberOfWinsART + "<br />" + "RT Wins: " + state.numberOfWinsRT + "<br />" + "Ties: " + state.numberOfTies;
}
