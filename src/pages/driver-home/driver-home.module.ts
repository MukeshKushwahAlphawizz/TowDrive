import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverHomePage } from './driver-home';

@NgModule({
  declarations: [
    DriverHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DriverHomePage),
  ],
})
export class DriverHomePageModule {}
