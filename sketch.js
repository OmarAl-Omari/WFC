  // Wave Function Collapse - Road Tiles
  // Your Name
  // Date
  //
  // Extra for Experts:
  // - Added edge matching system for tile compatibility.
  // - Built a simplified WFC grid with random collapse and image rendering.


let DIM = 25;
let numOfImages = 10;
let tileImages = [];
let tiles = [];
let grid = [];
let showNumberOfOptions = false;
let myCanvas;
let beginButton;


let dimSelector;


function preload() {
  // for (let i = 0; i < numOfTiles; i++) {
  //   tileImages[i] = loadImage(`/tiles/road${i}.png`); // road1.png to road4.png
  // }
  for (let i = 0; i < numOfImages; i++) {
    tileImages[i] = loadImage(`tiles/landScape${i}.png`); // road1.png to road4.png
  }
}




function setup() {
  myCanvas = createCanvas(windowHeight, windowHeight);


  textAlign(CENTER,CENTER);
  // Create tile objects with edge definitions for the ROAD
  // tiles[0] = new Tile(tileImages[0], ["0", "0", "0", "0"]);
  // tiles[1] = new Tile(tileImages[1], ["1", "1", "0", "1"]); // from road1.png
  // const roatedTiles = rotateTile(tiles[1]);
  // tiles.push(...roatedTiles);
  tiles[0] = new Tile(tileImages[0], ["00", "00", "00", "00"]);
  tiles[1] = new Tile(tileImages[1], ["11", "11", "11", "11"]);
  tiles[2] = new Tile(tileImages[2], ["01", "10", "00", "00"]);
  tiles[3] = new Tile(tileImages[3], ["01", "10", "00", "00"]);
  tiles[4] = new Tile(tileImages[4], ["01", "11", "10", "00"]);
  tiles[5] = new Tile(tileImages[5], ["01", "11", "10", "00"]);
  tiles[6] = new Tile(tileImages[6], ["01", "11", "10", "00"]);
  tiles[7] = new Tile(tileImages[7], ["10", "01", "10", "01"]);
  tiles[8] = new Tile(tileImages[8], ["11", "11", "10", "01"]);
  tiles[9] = new Tile(tileImages[9], ["11", "11", "10", "01"]);
    //ADD ROTATIONS
  for(let i = 2; i< 10;i++){
    let rotatedTiles = rotateTile(tiles[i]);
    tiles.push(...rotatedTiles);
  }
  console.log(tiles.length);
  for(let i = 0; i < tiles.length; i++){
    tiles[i].analyzeCompatibility(tiles);
  }



  title = createDiv("Wave Function Collapse");
  title.position(windowHeight + windowHeight/20  , windowHeight/100);
  styleTitle(title);

  beginButton = createButton("Start");
  beginButton.mousePressed(startOver);
  beginButton.position(windowHeight + windowHeight/20  , windowHeight/10);
  styleButton(beginButton);
  
  
  dimSelector = createSelect();
  dimSelector.position(windowHeight + windowHeight/5  , windowHeight/10);
  dimSelector.option("5x5");
  dimSelector.option("10x10");
  dimSelector.option('25x25');
  dimSelector.option('50x50');
  dimSelector.option('100x100');


  dimSelector.selected('25x25');
  styleSelect(dimSelector);

  
  sliderText = createDiv("Speed");
  sliderText.position(windowHeight + windowHeight/20  , windowHeight/4 - windowHeight/32);
  styleTitle(sliderText);
  sliderText.style("font-size", `${windowWidth * 0.01}px`);
  speedSlider = createSlider(1, 100, 1, 1); 
  speedSlider.position(windowHeight + windowHeight/20  , windowHeight/4);
  speedSlider.size(windowHeight/5);

  screenShotButton = createButton("Take ScreenShoot");
  screenShotButton.position(windowHeight + windowHeight/20  , windowHeight/3);
  screenShotButton.mousePressed(takeScreenShot);
  styleButton(screenShotButton);

  startOver(); 

}


function draw() {
  background(255);
  const w = (width / DIM);
  const h = (height / DIM);


  drawGrid(w, h);

  for(let i = 0; i < speedSlider.value(); i++){
    stepWFC();
  }


}


function drawGrid(w, h){
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let index = i + j * DIM;
      let cell = grid[index];
      if (cell.collapsed) {
        let tileIndex = cell.options[0];  // options is now an array of 1 element
        image(tiles[tileIndex].img, i * w, j * h, w + 1, h + 1);


      } else {
        noFill();
        stroke(0);
        strokeWeight(1);
        rect(i*w,j*h,w,h);
        textSize(min(w, h) * 0.5 );
        fill(240);
        stroke(255,0,0);
        strokeWeight(25 / DIM);
        text(cell.options.length, (i+0.5) * w, (j+0.5) * h)
      }
    }
  }
}

function stepWFC(){
  let cellToCollapse = findLeastOption();

  if (cellToCollapse) {
    //Collapse that cell of the grid
    let chosenIndex = cellToCollapse.index;
    grid[chosenIndex].collapse();
    //Get which tile it is
    let collapsedTileIndex = grid[chosenIndex].options[0];
    let collapsedtile = tiles[collapsedTileIndex]; //Setting the tile


    
    //UP
    if (chosenIndex - DIM >= 0) {
      let upNeighbor = grid[chosenIndex - DIM];
      //the north tile is left with the options that are compatible with the tile that was collapsed
      upNeighbor.options = upNeighbor.options.filter(opt => collapsedtile.north.includes(opt));
      if (upNeighbor.options.length === 0) {
        noOptionsFound();
      }


    }
    //RIGHT
    if (chosenIndex % DIM !== DIM - 1) {
      let rightNeighbor = grid[chosenIndex +1];
      rightNeighbor.options = rightNeighbor.options.filter(opt => collapsedtile.east.includes(opt));
      if (rightNeighbor.options.length === 0) {
        noOptionsFound();
      }
    }
    //DOWN
    if (chosenIndex + DIM < DIM * DIM) {
      let downNeighbor = grid[chosenIndex + DIM];
      downNeighbor.options = downNeighbor.options.filter(opt => collapsedtile.south.includes(opt));
      if (downNeighbor.options.length === 0) {
        noOptionsFound();
      }
    }
    //LEFT
    if (chosenIndex % DIM !== 0) {
      let leftNeighbor = grid[chosenIndex - 1];
      leftNeighbor.options = leftNeighbor.options.filter(opt => collapsedtile.west.includes(opt));
      if (leftNeighbor.options.length === 0) {
        noOptionsFound();
      }
    }
  }
  else{
    //noLoop();
    
  }
}


function noOptionsFound(){
  console.error("No valid options left for neighbor! Conflict detected.");
  noLoop();
}


function takeScreenShot(){
  saveCanvas(myCanvas,"screenshot","png");
}

function findLeastOption() {
  const nonCollapsed = grid.filter(cell => !cell.collapsed);
  //If all collapsed finish
  if (nonCollapsed.length === 0){
    return;
  }
  //Find the least amount of optoins then filter the ones with that number
  const leastAmount = Math.min(...nonCollapsed.map(cell => cell.options.length));
  const candidates = nonCollapsed.filter(cell => cell.options.length === leastAmount);


  let candidate = candidates[Math.floor(Math.random() * candidates.length)];
    return candidate;
}


function startOver(){
  grid = [];
  if(dimSelector.selected() == "5x5") DIM = 5;
  if(dimSelector.selected() == "10x10") DIM = 10;
  if(dimSelector.selected() == "25x25") DIM = 25;
  if(dimSelector.selected() == "50x50") DIM = 50;
  if(dimSelector.selected() == "100x100") DIM = 100;
  for (let i = 0; i < DIM * DIM; i++) {
    grid[i] = new Cell(tiles.length,i);
  }
}
function mousePressed(){
  //startOver();
}








function rotateTile(tile) {
  const imageWidth = tile.img.width;
  const imageHeight = tile.img.height;
  const originalEdges = tile.edges;


  let rotations = [90, 180, 270];


  const isSymmetricNS = originalEdges[0] === originalEdges[2].split("").reverse().join("");
  const isSymmetricEW = originalEdges[1] === originalEdges[3].split("").reverse().join("");


  if (isSymmetricNS && isSymmetricEW) {
    rotations = [90]; // Only one unique rotation needed
  }


  const rotatedTiles = [];


  for (let i = 0; i < rotations.length; i++) {
    let angle = rotations[i];
    let turns = angle / 90;


    let gfx = createGraphics(imageWidth, imageHeight);
    gfx.translate(imageWidth / 2, imageHeight / 2);
    gfx.rotate(radians(angle));
    gfx.imageMode(CENTER);
    gfx.image(tile.img, 0, 0, imageWidth+2, imageHeight+1);




    // Rotate and adjust edges
    let newEdges = [];
    for (let j = 0; j < originalEdges.length; j++) {
      // Index shift: clockwise
      let rotatedIndex = (j - turns + originalEdges.length) % originalEdges.length;
      let edge = originalEdges[rotatedIndex];
      newEdges[j] = edge;
    }


    let newTile = new Tile(gfx, newEdges);
    rotatedTiles.push(newTile);
  }


  return rotatedTiles;
}








function styleButton(btn) {
  let padX = windowWidth * 0.01;
  let padY = windowHeight * 0.015;
  let fontSize = windowWidth * 0.010;

  btn.style("background-color", "#243634");
  btn.style("color", "white");
  btn.style("border", "none");
  btn.style("padding", `${padY}px ${padX}px`);
  btn.style("border-radius", "12px");
  btn.style("cursor", "pointer");
  btn.style("font-size", `${fontSize}px`);
  btn.style("box-shadow", "0px 6px 15px rgba(45, 35, 35, 0.4)");

  btn.mouseOver(() => btn.style("background-color", "#1b2a28"));
  btn.mouseOut(() => btn.style("background-color", "#243634"));
}


function styleSelect(sel) {
  let fontSize = windowWidth * 0.010;
  let pad = windowWidth * 0.008;

  sel.style("background-color", "#243634");
  sel.style("color", "white");
  sel.style("border", "1px solid #444");
  sel.style("padding", `${pad}px`);
  sel.style("border-radius", "10px");
  sel.style("font-size", `${fontSize}px`);
  sel.style("cursor", "pointer");
}

function styleTitle(t) {
  let fontSize = windowWidth * 0.02;

  t.style("color", "#e6f2f0");
  t.style("font-size", `${fontSize}px`);
  t.style("font-weight", "bold");
  t.style("font-family", "Arial");
}
