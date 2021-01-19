import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-history-detail',
  templateUrl: 'history-detail.html',
})
export class HistoryDetailPage {
  detailData: any;
  isCustomer:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.detailData = navParams.data.detail;
    this.isCustomer = navParams.data.isCustomer;
  }

  ionViewDidLoad() {
  }
  openNotification() {
    this.navCtrl.push('NotificationPage');
  }

}
