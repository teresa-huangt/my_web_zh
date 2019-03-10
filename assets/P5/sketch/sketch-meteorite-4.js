// Define parameters of canvas & myMap
let canvas;
let myMap;

const mappa = new Mappa('Leaflet');
const options = {
	lat: 0,
	lng: 150,
	zoom: 1.8,
	style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}

// Define other parameters
var data;
let allCoordinates = [];

let size;
let maxmass = 0;
let num = 1000;
let maxyear = 0;
let minyear = 3000;

let mouseyear = 0;
let mousegap = 0;
var hist_curve = [];

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
  cal_massMax();
  myMap.onChange(drawPoints);

  // Create GUI
  //get_yearRange();
  // yearSlider = createSlider(1766,2009,1993);
  // yearSlider.position (20,20);
  // cSlider = createSlider(0,255,100);
  // cSlider.position (20,50);
}


// Get the range of year
function cal_yearRange(){
  // max and min year
  for (var k = 0; k < num; k++) {
    if (int(maxyear) < int(level0[k].year)){
      maxyear = level0[k].year;
    }
    if (int(minyear) > int(level0[k].year)){
      minyear = level0[k].year;
    }
  }
  print('yearMax is %s', maxyear);
  print('yearMin is %s', minyear);
  for (var k = int(minyear); k < int(maxyear); k+=10){
    hist_curve.push(0);
  }
  var idx = 0;
  for (var k = 0; k < num; k++) {
    idx = int((int(level0[k].year)-int(minyear)) / 10);
    hist_curve[idx] = hist_curve[idx] + 1;
  }
  print(hist_curve)
  var m = get_max(hist_curve, hist_curve.length);
  for (var k=0; k<hist_curve.length; k++){
    hist_curve[k] = hist_curve[k] / m;
  }
}

function get_max(mylist, n){
  m = int(mylist[0]);
  for (var i=0; i<n; i++){
    if (m < int(mylist[i])){
      m = int(mylist[i]);
    }
  }
  return m;
}

// Get the maximun of the meteorite‘s mass; interact with the circle size
function cal_massMax() {
  for(var j = 0; j < num; j++){
    if (int(maxmass) < int(level0[j].mass)){
      maxmass = level0[j].mass;
    }
  }
}

function draw() {
  if (is_in_scroll()){
    cal_mouseyear()
    var num_draw = drawPoints()
    draw_scroll()
    fill(255, 255, 255)
    text(str(mouseyear-mousegap)+' - '+str(mouseyear+mousegap), mouseX-40, mouseY-10)
    text(str(num_draw), mouseX, height-70)
  }
}

function draw_scroll(){
  noStroke()
  fill(142, 53, 74, 10)
  rect(0, height-50, width, 50)
  fill(142, 53, 74, 150)
  rect(mouseX-mousegap/2, 550, mousegap,50)
  stroke(255)
  noFill()
  var len = hist_curve.length
  for (var k = 1; k < len-2; k++){
    x1 = map(k-1, 0, len, 0, width)
    y1 = height - hist_curve[k-1]*50
    x2 = map(k, 0, len, 0, width)
    y2 = height - hist_curve[k]*50
    x3 = map(k+1, 0, len, 0, width)
    y3 = height - hist_curve[k+1]*50
    x4 = map(k+2, 0, len, 0, width)
    y4 = height - hist_curve[k+2]*50
    curve(x1, y1, x2, y2, x3, y3, x4, y4)
  }
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

// draw meteorites using ellipse
function drawPoints(){
  clear();
  var num_draw = 0;
  for(var i = 0; i < num; i++){
    let point = level0[i]
    if (!is_goodyear(point.year, mouseyear-mousegap, mouseyear+mousegap)){
      continue
    }
    draw_fallpoint(point)
    num_draw++;
  }
  draw_scroll()
  return num_draw;
}

function draw_fallpoint(point){
  if (isNaN(point.reclat)){
    return
  }
  if (isNaN(point.reclong)){
    return
  }
  let pos = myMap.latLngToPixel(point.reclat, point.reclong)
  let normalizeSize = map(log(point.mass), 0, log(maxmass), 0, 50);
  prepare_draw_fallpoint()
  ellipse(pos.x, pos.y, normalizeSize, normalizeSize);
  fill(134, 226, 213)
  text(int(point.year), pos.x, pos.y)
}

function prepare_draw_fallpoint(){
  noStroke();
  fill(134, 226, 213, 50);
}

function is_in_scroll() {
  if (mouseX > width) return false
  if (mouseX < 0) return false
  if (mouseY > height) return false
  if (mouseY < height-50) return false
  return true
}

function cal_mouseyear(){
  mouseyear = int(map(mouseX, 0, width, int(minyear), int(maxyear)))
  mousegap = int(map(mouseY, height-50, height, 10, 100))
}