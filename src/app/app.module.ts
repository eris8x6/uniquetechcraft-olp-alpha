import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeMComponent } from './home-m/home-m.component';
import { NavFrameComponent } from './nav-frame/nav-frame.component';
import { SongMComponent } from './song-m/song-m.component';
import { OlpPortraitAppBarComponent } from './olp-portrait-app-bar/olp-portrait-app-bar.component';
import { CueMComponent } from './cue-m/cue-m.component';
import { TrimLyricsPipe } from './trim-lyrics.pipe';
import { TrimChordsPipe } from './trim-chords.pipe';
import { RenderChordPipe } from './render-chord.pipe';

@NgModule({
  declarations: [
    HomeMComponent,
    NavFrameComponent,
    SongMComponent,
    OlpPortraitAppBarComponent,
    CueMComponent,
    TrimLyricsPipe,
    TrimChordsPipe,
    RenderChordPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeMComponent },
      { path: 'song/:songId', component: SongMComponent },
      { path: 'cue/:songId', component: CueMComponent }
    ]),
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [NavFrameComponent]
})
export class AppModule { }
