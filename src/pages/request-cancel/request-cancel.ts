import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-request-cancel',
  templateUrl: 'request-cancel.html',
})
export class RequestCancelPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestCancelPage');
  }

  tryAgain() {
    this.navCtrl.pop();
  }
}
