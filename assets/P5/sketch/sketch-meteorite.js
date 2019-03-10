// Define parameters of canvas & myMap
let canvas;
let myMap;

const mappa = new Mappa('Leaflet');
const options = {
	lat: 0,
	lng: 0,
	zoom: 1.8,
	style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}

// Define other parameters
var data;
let allCoordinates = [];
let hist = []
let maxhist = 0

let size;
let maxmass = 0;
let num = 200;
let maxyear = 0;
let minyear = 0;

let mouseyear = 0;
let mousegap = 0;

var gui;
var myYear = 1993;
var myColor = '#eeee00';

var is_good = 0;


// Preload the data
function preload(){
	data = loadJSON('https://data.nasa.gov/resource/y77d-th95.json');
  print(data);
}


// Setup
function setup() {
  pixelDensity(1)
	canvas = createCanvas(800, 600);
	myMap = mappa.tileMap(options);
	myMap.overlay(canvas);

  allCoordinates.push(data);
  print('show allCoordinates');
  print(allCoordinates.length);
  print(allCoordinates);
  level0 = allCoordinates[0];
  print('show level0');
  print(level0.length);
  print(level0);

  cal_yearRange();
  cal_hist();
  cal_massMax();
  //show_Introduction();
  //myMap.onChange(drawPoints);
  myMap.onChange(draw);

  // Create GUI
  //get_yearRange();
  // yearSlider = createSlider(1766,2009,1993);
  // yearSlider.position (20,20);
  // cSlider = createSlider(0,255,100);
  // cSlider.position (20,50);
}

function cal_hist(){
  for (var k = 0; k < num; k++) {
    year = int(level0[k].year)
    for (var y = year-5; y < year+5; y++) {
      if (hist[y] == undefined){
        hist[y] = 1
      } else {
        hist[y] += 1
      }
      if (hist[y] > maxhist) {
        maxhist = hist[y]
      }
    }
  }
  print('maxhist is %s', maxhist)
}


// Get the range of year
function cal_yearRange(){

  // maxyear
  for (var k = 0; k < num; k++) {
    if (int(maxyear) < int(level0[k].year)){
      maxyear = level0[k].year;
    }
  }
  maxyear = int(maxyear)
  print('yearMax is %s', maxyear);

  // minyear
  minyear = maxyear;
  for (var l = 0; l < num; l++) {
    if (int(minyear) > int(level0[l].year)){
      minyear = level0[l].year;
    }
  }
  if (int(minyear) < 1793){
    minyear = 1793
  }
  print('yearMin is %s', minyear);
}


// Get the maximun of the meteorite‘s mass; interact with the circle size
function cal_massMax() {
  for(var j = 0; j < num; j++){
    if (int(maxmass) < int(level0[j].mass)){
      maxmass = level0[j].mass;
    }
  }
}


// 
function show_Introduction(){
  fill(200)
  textSize(20)
  text("Move your mouse.", width/2-50, 30)
  textSize(14)
}


function draw() {
  if (is_in_scroll()){
    clear()
    cal_mouseyear()
    drawPoints()
    draw_scroll()
  }
}

// Return true if mouse is in bottom rectangle
function is_in_scroll() {
  if (mouseX > width) return false
  if (mouseX < 0) return false
  if (mouseY > height) return false
  if (mouseY < 0) return false
  return true
}

// Map year range to the rectangle range
function cal_mouseyear(){
  mouseyear = int(map(mouseX, 0, width, int(minyear), int(maxyear)))
  mousegap = int(map(mouseY ** 3, 0, height ** 3, 10, 100))
}

// Draw meteorites using ellipse
function drawPoints(){
  lx = -1
  ly = -1
  a = 200
  for(var i = 0; i < num; i++){
    let point = level0[i]
    if (!is_goodyear(point.year, mouseyear-mousegap, mouseyear+mousegap)){
      continue
    }
    if (point.reclat == undefined) {
      continue
    }
    if (lx == -1) {
      lx = point.reclat
      ly = point.reclong
    } else {
      x = point.reclat
      y = point.reclong
      pos1 = myMap.latLngToPixel(lx, ly)
      pos2 = myMap.latLngToPixel(x, y)
      stroke(200, a)
      if (a > 10) {
        a = a - 10
      }
      //line(pos1.x, pos1.y, pos2.x, pos2.y)
      lx = x
      ly = y
    }
    draw_fallpoint(point)
  } 
}

function draw_fallpoint(point){
  let pos = myMap.latLngToPixel(point.reclat, point.reclong)
  let normalizeSize = map(log(point.mass), 0, log(maxmass), 0, 30);
  prepare_draw_fallpoint()
  ellipse(pos.x, pos.y, normalizeSize, normalizeSize);
  fill(134, 226, 213)
  text(int(point.year), pos.x, pos.y)
}

function prepare_draw_fallpoint(){
  noStroke();
  fill(134, 226, 213, 50);
}

function is_goodyear(year, a, b){
  if (typeof year == "undefined"){
    return false
  }
  var yy = year[0]+year[1]+year[2]+year[3]
  if ((int(yy) > a) && (int(yy) < b)){
    return true
  }
  return false
}

function draw_scroll(){
  noStroke()
  fill(142, 53, 74)
  rect(0, height-50, width, 50)
  
  fill(241, 169, 160, 90)
  rect(mouseX-mousegap/2, height-50, mousegap,50)

  fill(200)
  text(str(mouseyear-mousegap)+' - '+str(mouseyear+mousegap), mouseX+5, height-60)
  show_Introduction()
  draw_hist()
}

function draw_hist(){
  stroke(255, 255, 255)
  fill(255, 255, 255)
  lx = 0
  ly = height
  for (var j = minyear; j < maxyear; j++){
    h = hist[j]
    if (h == undefined){
      continue
    }
    x = map(j, minyear, maxyear, 0, width)
    y = map(h, 0, maxhist, 0, 50)
    line(lx, height-ly, x, height-y)
    lx = x
    ly = y
  }
}





