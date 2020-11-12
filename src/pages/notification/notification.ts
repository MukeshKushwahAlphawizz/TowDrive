import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  token: any = '';
  pageNumber : number = 1;
  pageSize : number = 10;
  notificationList :any = [];
  isTodayAvailable: boolean = false;
  isYesterdayAvailable: boolean = false;
  isPast: boolean = false;
  isListEmpty: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  clearAll(b: boolean, b2: boolean) {

  }

  doRefresh(refresher) {
    setTimeout(()=>{
      refresher.complete();
    },500)
  }

  liveTracking() {

  }

  doInfinite(infiniteScroll) {
    infiniteScroll.complete();
  }

  chatDriver() {

  }

  refresh() {

  }
}
