"use strict";

function downloadSong(song) {
    return new Promise(async (resolve, reject) => {
        const songReader = new FileReader();
        const songStream = await fetch(song.link);
        songReader.readAsDataURL(await songStream.blob());
        songReader.onload = (e) => {
            resolve(songReader.result);
        }

    });
}

async function downloadMap() {
    const mapID = Rt[Bt.lvl.sel];
    const map = m(mapID, "id");


    const songID = map.song;
    const song = Lt(songID, "id");
    const songFile = await downloadSong(song);

    let notesByTile = {};
    for (let i = 1; i <= 9; i++) {
        notesByTile[i] = [];
    }

    let notes = map.beat;
    for (let note of notes) {
        const noteIndex = (7 - 3 * Math.floor(note[0] / 3) + (note[0] % 3));

        const offset = map.songOffset + note[10]

        const noteTime = note[1] * 500 + offset;
        notesByTile[noteIndex].push({
            "time": noteTime,
            "holdLength": note[6],
            "ColorHsb": [note[11], note[16], note[17]],
        });
    }

    console.log(notesByTile);

    const mapFile = {

        "song": {
            "ID": songID,
            "name": song.name,
            "artist": song.artist,

            //sometimes explicit is undefined ingame
            "isExplicit": song.explicit ? true : false,

            "bpm": map.bpmDis,

            "file": songFile
        },

        "map": {
            "ID": mapID,
            "name": map.title,
            "description": map.desc,
            "author": Ut(map.author, "uuid").user,

            "length": map.len,

            "foresight": map.ar,
            "hitWindow": map.hw,
            "hpDrain": map.hpD,

            "notes": notesByTile,
            "background": map.bg
        },
    }
    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(mapFile)], { type: 'application/json' });
    link.href = URL.createObjectURL(file);
    link.download = map.title + ".json";
    link.click();
    link.remove();
}