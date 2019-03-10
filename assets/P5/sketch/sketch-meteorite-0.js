let canvas;
let myMap;

const mappa = new Mappa('Leaflet');
const options = {
	lat: 0,
	lng: 150,
	zoom: 1.8,
	style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}

var data;
let allCoordinates = [];
let size;
let maxmass = 0;
let num = 100;


function preload(){
	data = loadJSON('https://data.nasa.gov/resource/y77d-th95.json');
  print(data);
}

function setup() {
	canvas = createCanvas(1000, 800);
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

  get_max()
  myMap.onChange(drawPoints);
}

function get_max() {

  for(let j = 0; j < num; j++){
    if (int(maxmass) < int(level0[j].mass)){
      maxmass = level0[j].mass;
      print(maxmass)
    }
  }
  print('max is %s', maxmass);



}

function draw() {


}

function drawPoints(){
  clear() 
  noStroke();
  fill(134, 226, 213);
  get_max();
  for(let i = 0; i < num; i++){
    let pos = myMap.latLngToPixel(level0[i].reclat, level0[i].reclong)
    print(level0[i].reclat);
    print(level0[i].reclong);

    let size = level0[i].mass;
    print(size, 0, maxmass, 0, 10)
    let normalizeSize = map(log(size), 0, log(maxmass), 0, 10);
    print('normalizeSize is %d', normalizeSize)
    ellipse(pos.x, pos.y, normalizeSize, normalizeSize);
    //ellipse(pos.x, pos.y, 10, 10);
  }  
}



