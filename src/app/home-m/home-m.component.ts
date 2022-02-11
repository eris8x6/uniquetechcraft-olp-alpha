import { Component, OnInit } from '@angular/core';
import { SongsApiClientService } from '../songs-api-client.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'olp2-home-m',
  templateUrl: './home-m.component.html',
  styleUrls: ['./home-m.component.css']
})
export class HomeMComponent implements OnInit {

  constructor(private songsClient: SongsApiClientService) { }

  public appBarTitle: string = "Sing Out!";

  songs: any[];

  searchKey: string;

  ngOnInit(): void {
    this.getSongs();
  }

  public sendSearch(): void {
    this.songsClient.getSongSearch(this.searchKey)
      .then(songsList => this.songs = songsList);
  }

  private getSongs(): void {
    this.songsClient.getSongList()
      .then(songsList => this.songs = songsList);
  }

}
