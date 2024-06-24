"use strict";

class Tile {
    constructor(x, y, notes) {
        this.x = x;
        this.y = y;

        this.size = G.tileProps.size;

        this.oldPush = 0;
        this.push = 0;
        this.pushTarget = 0;

        this.pushTime = 0;

        this.notes = notes;
        this.nextNoteTime = this.getNextNoteTime();

        this.loadedNotes = [];
    }

    getNextNoteTime() {
        if (this.notes.length > 0) {
            return this.notes[0].time - G.mapData.map.foresight * 500;
        } else {
            return Number.MAX_VALUE;
        }

    }

    draw() {
        if (this.pushTarget != this.push) {
            this.pushTime = Math.min((G.mapTime - this.pushStartTime) / G.tileProps.pushTime, 1);
            this.push = lerp(this.oldPush, this.pushTarget, Math.pow(this.pushTime, 0.4));
        }

        colorMode(HSB, 255);
        noFill();
        rectMode(CENTER);
        
        if (G.mapPlaying) {
            this.checkNotes();
            this.drawNotes();
        }

        stroke(0, 0, 255, 255);
        strokeWeight(floor(G.size / 50));
        rect(this.x, this.y, this.size - this.push, this.size - this.push);

    }

    press() {
        this.pushStartTime = G.mapTime;
        this.pushTime = 0;

        this.oldPush = this.push;
        this.pushTarget = G.tileProps.pushDistance;

        if (
            this.loadedNotes.length > 0 &&
            Math.abs(G.mapTime - this.loadedNotes[this.loadedNotes.length - 1].time) <= G.mapData.map.hitWindow * 250) {

            judgeHit(this.loadedNotes.pop().time, G.mapTime);
            
        }
    }

    release() {
        this.pushStartTime = G.mapTime;
        this.pushTime = 0;

        this.oldPush = this.push;
        this.pushTarget = 0;

        //TODO CHECK WTIH HOLDS
    }

    checkNotes() {
        while (
            this.loadedNotes.length > 0 &&
            G.mapTime - this.loadedNotes[0].time
            >= G.mapData.map.hitWindow * 150) {

            judgeMiss();
            this.loadedNotes.shift();
        }

        while (G.mapTime >= this.getNextNoteTime()) {
            this.loadedNotes.push(this.notes.shift());
            //console.log("LOADED NOTE");
        }
    }

    drawNotes() {
        strokeWeight(floor(G.size / 100));

        for(let note of this.loadedNotes) {
            stroke(...note.ColorHsb, 255);
            const sizePercent = Math.min((G.mapTime - note.time) / (G.mapData.map.foresight * 500) + 1, 1);
            rect(this.x, this.y, this.size * sizePercent, this.size * sizePercent);
        }
    }
}
