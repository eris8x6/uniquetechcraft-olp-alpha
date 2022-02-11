import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongsApiClientService } from '../songs-api-client.service';

@Component({
  selector: 'app-song-m',
  templateUrl: './song-m.component.html',
  styleUrls: ['./song-m.component.css']
})
export class SongMComponent implements OnInit {

  songId: string;
  song: any;

  constructor(private activatedRoute: ActivatedRoute,
    private songsClient: SongsApiClientService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.songId = params['songId'];
      this.getSongData();
    });
  }

  public getChords(typ) {
    for (let stanza of this.song.chords) {
      console.log("Check " + stanza.type);
      if (stanza.type === typ) return stanza.value;
    }
    return "CHORDS ERROR";
  }

  private getSongData() {
    console.log("Get song data for id", this.songId);
    this.songsClient.getSongData(this.songId)
      .then(songData => this.song = songData);
  }

}
