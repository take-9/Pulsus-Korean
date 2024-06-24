"use strict";

const G = {};
G.width = 1920;
G.height = 1080;
G.size = Math.min(G.width, G.height);

G.keys = {
    //letters
    82:7,84:8,89:9,
    70:4,71:5,72:6,
    86:1,66:2,78:3,

    //numpad (numlock off)
    36:7,38:8,33:9,
    37:4,12:5,39:6,
    35:1,40:2,34:3,

    //numpad (numlock on)
    103:7,104:8,105:9,
    100:4,101:5,102:6,
    97 :1,98 :2,99 :3
};

G.tileProps = {
    pushDistance: G.size / 50,
    pushTime: 100,
    size: G.size / 4.3
};

G.tiles = {}; //set to the 9 tiles inside main
G.mapLoaded = false;

G.mapPlaying = false;
G.songPlaying = false;
G.paused = false;
G.audio = null;

G.mapData = {};

G.mapStartTime = 0;
G.mapStartLeeway = 3000;
G.mapTime = 0;
G.mapOffset = 0;
G.pauseTime = 0;
G.lastUpdateTime = 0;
