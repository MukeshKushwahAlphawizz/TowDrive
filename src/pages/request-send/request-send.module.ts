import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestSendPage } from './request-send';

@NgModule({
  declarations: [
    RequestSendPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestSendPage),
  ],
})
export class RequestSendPageModule {}
