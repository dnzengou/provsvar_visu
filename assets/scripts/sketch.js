const COLORS = [
    [0, 172, 193],          // susceptible
    [255, 179, 0],          // exposed
    [213, 0, 0],            // infected
    [85, 139, 47],          // recovered
];
var E_RADIUS = 6;           // particle radius

var entities;
var population;

var hist;
var maxHist;
var count;

var I_CHANCE = 1;           // chance for an entity to become infected
                            // 100% (naive population)
var I_RADIUS = 18;          // radius within which entities can be infected
                            // (about 3 people per radius unit)
var TRANSITIONS = [
    1,                      // exposed      -> infected
    0.005,                  // infected     -> recovered
    0                       // recovered    -> susceptible
];

var graphType = 0;          // 0 = line graph, 1 = pie chart, 2 = none
var showRadius = true;     // whether to display infection radius




/*
 * Other functions
 */

// Draws a line graph of all entities
function lineGraph() {
    // Transparent rect behind graph
    stroke(0);                      // Setting the outline (stroke) to black
    fill(0,250,0,63);               // Setting the interior of a shape (fill) to grey
    //fill(250);
    rect(0, 25, hist.length, 150);  // Drawing the rectangle

    // Plot history of each state
    noFill();
    strokeWeight(2);
    for (let i = 0; i < COLORS.length; i++) {
        stroke(COLORS[i]);
        beginShape();
        for (let j = 0; j < hist.length; j++) {
            let y = map(hist[j][i], 0, count, 175, 25);
            vertex(j, y);
        }
        endShape();
    }
    strokeWeight(1);

    // Draw line at current draw location
    stroke(204);
    line(hist.length, 25, hist.length, 175);
}


// Draws a pie chart of all entities
function pieChart() {
    let results = countStates();
    let states = results[0];
    let total = results[1];

    // Draw pie chart
    let radius = 75;
    let lastAngle = 0;
    for (let i = 0; i < states.length; i++) {
        let angle = states[i] / total * TWO_PI;
        if (angle === 0) continue;

        // Arc
        fill(COLORS[i].concat(191));
        noStroke();
        ellipseMode(RADIUS);
        arc(100, 100, radius, radius, lastAngle, lastAngle + angle);
        lastAngle += angle;
    }
}

// Fills map randomly with entities of each state (random walk)
// Requires an array of SEIR
function randomEntities(states) {
    entities = [];
    for (let i = 0; i < states.length; i++) {
        for (let j = 0; j < states[i]; j++) {
            let x = random(width);
            let y = random(height);
            entities.push(new Entity(x, y, i));
        }
    }
}

// Resets map
function reset() {
    // Set entity radius
    let e = parseInt(document.getElementById('e_r').value);
    E_RADIUS = e > 0 ? e : 1;

    // Set infection radius
    let r = parseInt(document.getElementById('i_r').value);
    I_RADIUS = r >= 0 ? r : 0;

    // Set initial population
    let ids = ['s0', 'e0', 'i0', 'r0'];
    population = [];
    for (let i = 0; i < ids.length; i++) {
        let v = parseInt(document.getElementById(ids[i]).value);
        population.push(v >= 0 ? v : 0);
    }
    randomEntities(population);

    // Set transitions
    ids = ['ds', 'de', 'di', 'dr'];
    let t = [];
    for (let i = 0; i < ids.length; i++) {
        let v = parseFloat(document.getElementById(ids[i]).value);
        t.push(constrain(v, 0, 1));
    }
    I_CHANCE = t.shift();
    TRANSITIONS = t;

    hist = [];
    count = countStates()[1];
}




/*
 * Main p5.js functions
 */

function setup() {
    let m = document.getElementById('sketch');
    let canvas = createCanvas(m.offsetWidth, m.offsetHeight);
    canvas.parent(m);
    resizeCanvas(m.offsetWidth, m.offsetHeight, true);
    
    reset();

    maxHist = ceil(width / 4);
}

function draw() {
    //background(0);
    background(255); // Setting the background to white

    hist.push(countStates()[0]);
    if (hist.length > maxHist) hist.shift();

    for (let i = 0; i < entities.length; i++) {
        entities[i].act();
    }

    if (graphType === 0) {
        lineGraph();
    } else if (graphType === 1) {
        pieChart();
    }
}




/*
 * User input
 */

function keyPressed() {
    switch (keyCode) {
        case 32:
            // Spacebar
            showRadius = !showRadius;
            break;
        case 71:
            // G
            graphType++;
            if (graphType > 2) graphType = 0;
            break;
        case 82:
            // R
            reset();
            break;
    }
}
