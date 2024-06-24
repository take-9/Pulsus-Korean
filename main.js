"use strict";
function loadMap(name) {
  fetch("./maps/" + name + ".json")
    .then((res) => res.json())
    .then((mapJson) => {
      G.mapData = mapJson;
      G.mapLoaded = true;
      G.audio = new Audio(G.mapData.song.file);
      G.audio.volume = 0.1;
    })
    .then(() => {
      for (let i = 0; i < 9; i++) {
        const tileX = G.size / 2 + (G.size / 3 * (i % 3 - 1));
        const tileY = G.size / 2 - (G.size / 3 * (floor(i / 3) - 1));
        G.tiles[i + 1] = new Tile(tileX, tileY, G.mapData.map.notes[i + 1]);
      }
    });
}
function setup() {
  createCanvas(G.width, G.height);
  background(20);
  //noStroke();
  loadMap("non");
  playMap();
}

function playMap() {
  confirm("Click ok to continue!");
  G.mapStartTime = performance.now();
  G.lastUpdateTime = G.mapStartTime;
  G.mapPlaying = true;
}

function draw() {
  if (!G.audio) {
    return;
  }

  clear();
  background(20);

  runMap();
}

function togglePause() {
  G.paused = !G.paused;

  if (G.paused) {
    G.pauseStartTime = performance.now();
    G.mapPlaying = false;
    G.songPlaying = false;
    G.audio.pause();
    G.audio.currentTime = G.mapTime / 1000;
    drawPauseMenu();
  } else {
    G.pauseTime += performance.now() - G.pauseStartTime;
    G.mapPlaying = true;
    G.songPlaying = true;
    G.audio.play();
  }

}

function drawPauseMenu() {
  alert("paused");
}

function runMap() {
  if (!(G.mapLoaded && G.mapPlaying)) {
    return;
  }

  G.mapTime = performance.now() - G.mapStartTime - G.mapStartLeeway - G.pauseTime + G.mapOffset;
  //test
  if(G.mapTime - G.lastUpdateTime > 1000) {
    console.log("syncing " + (G.mapTime - G.audio.currentTime * 1000));
    G.lastUpdateTime = G.mapTime;

    //G.audio.currentTime = G.mapTime / 1000;
    G.mapOffset = G.audio.currentTime * 1000 - G.mapTime;
    console.log("syncing " + (G.mapTime - G.audio.currentTime * 1000));
  }


  if (!G.songPlaying) {
    if (G.mapTime > 0) {
      G.songPlaying = true;

      G.audio.currentTime = G.mapTime / 1000;
      G.audio.play();
    }
  }

  for (let i = 1; i <= 9; i++) {
    G.tiles[i].draw();
  }

  if (G.mapTime > G.mapData.song) {
    showResultsScreen();
    G.mapPlaying = false;
  }
}

function keyPressed() {
  const tileIndex = G.keys[keyCode];
  if (tileIndex) {
    G.tiles[tileIndex].press();
    return;
  }
  if (keyCode === ESCAPE) {
    togglePause();
  }
}

function keyReleased() {
  const tileIndex = G.keys[keyCode];
  if (tileIndex) {
    G.tiles[tileIndex].release();
  }
}

