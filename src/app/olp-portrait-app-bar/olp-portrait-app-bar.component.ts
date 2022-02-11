import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'olp-portrait-app-bar',
  templateUrl: './olp-portrait-app-bar.component.html',
  styleUrls: ['./olp-portrait-app-bar.component.css']
})
export class OlpPortraitAppBarComponent implements OnInit {

  @Input() title: string;
  @Input() songId: string;

  constructor() { }

  ngOnInit(): void {
  }

  songViewP(): boolean { return this.songId != null && this.songId.length > 0; }

}
