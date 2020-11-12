import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackLocationPage } from './track-location';

@NgModule({
  declarations: [
    TrackLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackLocationPage),
  ],
})
export class TrackLocationPageModule {}
