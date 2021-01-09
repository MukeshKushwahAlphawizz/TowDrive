import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-request-accept',
  templateUrl: 'request-accept.html',
})
export class RequestAcceptPage {

  constructor(public navCtrl: NavController,
              public storage:Storage,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  continue() {
    this.storage.set('isRequestSent',true).then(()=>{
      this.navCtrl.setRoot('SetLocationPage');
    });
  }
}
