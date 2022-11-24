// Copyright (c) 2019 ml5
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

//Full Implement - mikkped - moodle
//HTTP REQUEST GET THE WEATHER - IXD_Weather2 - learn.hobye.dk

// Sætter variabel for API
let ingredients;

//Start placering for text
let textX = 10;
//mellemnrum mellem ord
let space = 30;

// opreter variabel for timer og sætter den til 0
let timer = 0;

let curResults;
let confidence = 0;
// Classifier variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/G-4XJFpyv/";

// Video
let video;
let flippedVideo;
// Til at gemme klassifisering
let label = "";

// indlæser modelen først
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the video
  video = createCapture(VIDEO);
  video.size(250, 200);
  video.hide(); // gemmer videocanvas under selve canvas

  flippedVideo = ml5.flipImage(video);
  // Starter klassificering
  classifyVideo();
}

//kolonnehøjde
let colHeight = 20;

function draw() {
  background(245);
  // Tegner video
  image(flippedVideo, width - 250, 0);
  list();

  if (confidence > 0.95) {
    text(label + "(" + round(confidence * 100) + ")", width - 250, 240);
  }
}

function list() {
  //hvis igredients ikke er udefineret, så gør dette
  if (ingredients != undefined) {
    fill(142, 166, 221);
    textSize(50);
    text("Meals ", 10, 50);
    fill(242, 166, 121);
    textSize(20);

    //forløkke som opdeler kolonner så det ikke overskrider sidens højde
    for (let j = 0; j < ingredients.meals.length; j++) {
      let collumn = Math.floor(j / colHeight);
      //let tempX = textX + width/2;
      text(
        ingredients.meals[j].strMeal,
        textX + collumn * 550,
        ((j % colHeight) + 3) * space
      );
    }
  }
  //tegner et mærkat af forudsigelse 
  fill(255, 50, 0);
  textSize(15);
  text(label, width - 250, 220);
}

//får en forudsigelse af det som kameraet ser
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// Når vi har et resultat
function gotResult(error, results) {
  // hvis der opstår en fejl
  if (error) {
    console.error(error);
    return;
  }
  //resultat er i en liste efter overbevisning
  label = results[0].label;
  confidence = results[0].confidence;
  curResults = results;

  //løber igennem vores model og finder objekter som er over 95%
  for (let i = 0; i < curResults.length; i++) {
    if (curResults[i].confidence > 0.95) {
      foodIdea();
      break;
    }
  }
  // Classificering igen
  classifyVideo();
}

function foodIdea() {
  //timer som udfører det hvert 2. sekund
  if (millis() - timer > 2000) {
    timer = millis();
    //sætter URL fra API
    let url = "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + label;
    //henter jsonfilen som i eksempel fra learn.hobye.dk
    httpGet(url, "json", false, function (response) {
      ingredients = response;
    });
  }
}
