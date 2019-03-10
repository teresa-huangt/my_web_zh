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
let num = 50;
let maxyear = 0;
let minyear = 0;

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
	canvas = createCanvas(800,600);
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

  
  get_massMax();
  myMap.onChange(drawPoints);

  // Create GUI
  //get_yearRange();
  // yearSlider = createSlider(1766,2009,1993);
  // yearSlider.position (20,20);
  // cSlider = createSlider(0,255,100);
  // cSlider.position (20,50);
}


// Get the range of year
function get_yearRange(){

  // maxyear
  for (var k = 0; k < num; k++) {
    if (int(maxyear) < int(level0[k].year)){
      maxyear = level0[k].year;
      print(maxyear);
    }
  }
  print('yearMax is %s', maxyear);

  // minyear
  minyear = maxyear;
  for (var l = 0; l < num; l++) {
    if (int(minyear) > int(level0[l].year)){
      minyear = level0[l].year;
      print(minyear);
    }
  }
  print('yearMin is %s', minyear);
}


// Get the maximun of the meteorite‘s mass; interact with the circle size
function get_massMax() {

  for(var j = 0; j < num; j++){
    if (int(maxmass) < int(level0[j].mass)){
      maxmass = level0[j].mass;
      //print(maxmass)
    }
  }
  //print('massMax is %s', maxmass);
}

function draw() {

}

function is_goodyear(){
  is_good = 0
  if (typeof year == "undefined"){
    return
  }
  var yy = year[0]+year[1]+year[2]+year[3]
  if ((int(yy) > 1900) && (int(yy) < 1950)){
    is_good = 1
    return
  }
}

// draw meteorites using ellipse
function drawPoints(){
  clear();
  noStroke();
  fill(134, 226, 213,50);
  get_massMax();
  for(var i = 0; i < num; i++){
    let pos = myMap.latLngToPixel(level0[i].reclat, level0[i].reclong)
    //print(level0[i].reclat);
    //print(level0[i].reclong);

    year = level0[i].year;
    is_goodyear()
    if (is_good == 1){
      print(year)
    } else {
      continue
    }


    let size = level0[i].mass;
    //ßprint(size, 0, maxmass, 0, 10)
    let normalizeSize = map(log(size), 0, log(maxmass), 0, 50);
    //print('normalizeSize is %d', normalizeSize)
    ellipse(pos.x, pos.y, normalizeSize, normalizeSize);
    //ellipse(pos.x, pos.y, 10, 10);
  }  
}



