import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-request-accept',
  templateUrl: 'request-accept.html',
})
export class RequestAcceptPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  continue() {
    this.navCtrl.setRoot('SetLocationPage',{isRequestSent:true});
  }
}
