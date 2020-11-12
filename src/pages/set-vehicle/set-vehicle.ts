import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-set-vehicle',
  templateUrl: 'set-vehicle.html',
})
export class SetVehiclePage {
  startDate: String = new Date().toISOString();
  endDate: String = new Date().toISOString();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  back() {
    this.navCtrl.pop();
  }

  pay() {
    this.navCtrl.push('PaymentPage');
  }
}
