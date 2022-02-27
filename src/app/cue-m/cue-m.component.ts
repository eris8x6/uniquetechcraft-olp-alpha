import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongsApiClientService } from '../songs-api-client.service';
import { Observable, timer, Subscription } from 'rxjs';

@Component({
    selector: 'app-cue-m',
    templateUrl: './cue-m.component.html',
    styleUrls: ['./cue-m.component.css']
})
export class CueMComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('cueView') viewElement: ElementRef;

    songId: string;
    cueSheetData: any = {
        staves: [{
            lyricLine: ["This", "is", "a", "test"],
            chordLine: ["A", "D", "G", "X"]
        }]
    };
    currentStaves: any;

    playing: boolean = false;
    fullScreen: boolean = false;
    tempo: number = 120.0;

    private beatsPerStaff: number = 16; // Arbitrary default
    private currentLine: number = 0;
    private playTimer: Observable<number>;
    private playSubscription: Subscription;

    constructor(private activatedRoute: ActivatedRoute,
        private songsClient: SongsApiClientService) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.songId = params['songId'];
            this.getSongData();
        });
    }

    ngAfterViewInit(): void {
        this.enterFullScreen();
    }

    ngOnDestroy(): void {
        if (this.playSubscription) this.playSubscription.unsubscribe();
    }

    public enterFullScreen() {
        let fs = this.viewElement.nativeElement.requestFullscreen();
        fs.then(() => this.lockLandscape());
        this.fullScreen = true;
    }

    public leaveFullScreen() {
        let nfs = document.exitFullscreen();
        nfs.then(() => this.unlockOrientation());
        this.fullScreen = false;
    }

    private lockLandscape() {
        console.log("Attempt to lock landscape orientation");
        screen.orientation.lock('landscape');
    }

    private unlockOrientation() {
        console.log("Attempt to unlock orientation");
        screen.orientation.unlock();
    }

    public togglePlaying() {
        this.playing = !this.playing;
        if (this.playing) this.playLine();
        else this.playSubscription.unsubscribe();
    }

    public skipForward() {
        this.currentLine = Math.min(this.cueSheetData.staves.length - 3, this.currentLine + 3);
        this.scroll();
    }

    public skipBackward() {
        this.currentLine = Math.max(0, this.currentLine - 3);
        this.scroll();
    }

    public staffBars(staff) {
        return Math.max(staff.lyricLine.length, staff.chordLine.length);
    }

    private scroll() {
        this.currentStaves = this.cueSheetData.staves.slice(this.currentLine, this.currentLine + 3);
        if (this.playing && (this.currentLine + 3 < this.cueSheetData.staves.length)) this.playLine();
    }

    private playLine() {
        var lineTime = 60000.0 * this.beatsPerStaff / this.tempo;
        console.log("Start line timer for", lineTime);
        this.playTimer = timer(lineTime);
        this.playSubscription = this.playTimer.subscribe((n) => {
            this.currentLine = Math.min(this.cueSheetData.staves.length - 3, this.currentLine + 1);
            console.log("Line timer done, advanced to line", this.currentLine);
            this.scroll();
        });
    }

    private getSongData() {
        this.songsClient.getSongData(this.songId)
            .then(songData => {
                this.extractCueSheetData(songData);
                this.tempo = songData.tempo as number;
                this.beatsPerStaff = songData.beatsPerStaff as number;
            });
    }

    private extractCueSheetData(songData) {
        this.cueSheetData = {
            title: songData.title,
            composer: songData.composer,
            key: songData.key,
            err: null
        };

        const lyricStanzas = new Array();
        for (var lyricStanza of songData.lyrics) {
            const lyricLines = lyricStanza.text.split('/');
            const lyrics = lyricLines.map((val, inx, arry) => { return val.split('^'); });
            lyricStanzas.push({
                lyricLines: lyrics,
                type: lyricStanza.type,
                number: lyricStanza.number
            });
        }

        console.log("Unpacked lyrics to stanzas, count is", lyricStanzas.length);

        const chordStanzas = new Array();
        for (var chordStanza of songData.chords) {
            const chordLines = chordStanza.value.split('/');
            const chords = chordLines.map((val, inx, arry) => {
                var chordLine;
                if (val.substr(0, 1) === '|') {
                    const copyPos = Number.parseInt(val.substring(1));
                    chordLine = arry[copyPos - 1];
                }
                else {
                    chordLine = val;
                }
                return chordLine.split(' ');
            });
            chordStanzas.push({
                chordLines: chords,
                type: chordStanza.type,
                number: chordStanza.number
            });
        }

        console.log("Unpacked chords to stanzas, count is", chordStanzas.length);

        let arrangement;
        if (songData.arrangement) {
            arrangement = songData.arrangement;
        }
        else {
            // Verify lyrics
            let verseCount = 0;
            let chorusCount = 0;
            let chorusNumber = null;
            let otherCount = 0;
            for (let stanza of lyricStanzas) {
                switch (stanza.type) {
                    case "verse":
                        verseCount++;
                        break;
                    case "chorus":
                        chorusCount++;
                        chorusNumber = stanza.number;
                        break;
                    default:
                        otherCount++;
                }
            }
            if (otherCount > 0 || verseCount == 0 || chorusCount == 0 || chorusCount > 1) {
                // Throw error
                this.cueSheetData.err = true;
                return;
            }

            // Verify chords
            let verseChords = -1;
            let chorusChords = -1;
            let otherChords = false;
            for (let stanza of chordStanzas) {
                switch (stanza.type) {
                    case "verse":
                        verseChords = stanza.number;
                        break;
                    case "chorus":
                        chorusChords = stanza.number;
                        break;
                    default:
                        otherChords = true;
                }
            }
            if (verseChords == -1 || chorusChords == -1 || otherChords) {
                // Throw error
                this.cueSheetData.err = true;
                return;
            }

            // Generate default arrangement
            arrangement = new Array();
            for (let stanza of lyricStanzas) {
                if (stanza.type === "verse") {
                    let verseArr = {
                        type: "verse",
                        lyricNumber: stanza.number,
                        chordNumber: verseChords
                    };
                    arrangement.push(verseArr);
                    let chorusArr = {
                        type: "chorus",
                        lyricNumber: chorusNumber,
                        chordNumber: chorusChords
                    };
                    arrangement.push(chorusArr);
                }
            }
        }

        var staves = new Array();
        console.log("Making cuesheet staves for arrangement stanzas, count", arrangement.length);
        for (var cueStanza of arrangement) {
            console.log("Staves for arr stanza ", cueStanza);
            let stzLyricLines = null;
            let stzChordLines = null;
            for (let lyrStanza of lyricStanzas) {
                if (lyrStanza.type === cueStanza.type && lyrStanza.number === cueStanza.lyricNumber) stzLyricLines = lyrStanza.lyricLines;
            }
            for (let chdStanza of chordStanzas) {
                console.log("Matching chord stanza", chdStanza);
                if (chdStanza.type == cueStanza.type &&
                    (chdStanza.number === cueStanza.chordNumber ||
                        cueStanza.chordNumber === 1 && !chordStanza.number)) {
                    stzChordLines = chdStanza.chordLines;
                }
            }
            if (!stzLyricLines) {
                console.log("No lyric lines for cueStanza", cueStanza);
                this.cueSheetData.err = true;
                return;
            }
            if (!stzChordLines) {
                console.log("No chord lines for cueStanza", cueStanza);
                this.cueSheetData.err = true;
                return;
            }
            stzLyricLines.forEach((lyricLine, lineInx, arry) => {
                // Parse lines to bars
                var chordLine = stzChordLines[lineInx];
                var lineBars = new Array();
                if (lyricLine.length == chordLine.length) {
                    lyricLine.forEach((barLyric, barInx, arry) => {
                        lineBars.push({
                            lyric: barLyric,
                            chords: chordLine[barInx]
                        });
                    });
                    staves.push({
                        bars: lineBars
                    });
                }
                else {
                    console.log("Lyric/chord length mismatch in line " + (lineInx + 1) + " of cueStanza", cueStanza);
                    this.cueSheetData.err = true;
                    return;
                }
            });
        }
        this.cueSheetData.staves = staves;
        console.log("Dereference to staves complete, count", staves.length);
        this.scroll();

    }

}
