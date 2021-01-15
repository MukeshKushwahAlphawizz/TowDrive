import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  userData : any = {};
  feedback:any={
    service_name:'',
    service_status:'',
    payment_mode:'',
    approx_cost:'',
    timings:'0',
    service_provider:'0',
    work_quality:'0',
    comment:'',
  }
  routeDetail:any='';
  constructor(public navCtrl: NavController,
              public user:User,
              public util:UtilProvider,
              public storage:Storage,
              public navParams: NavParams) {
    this.routeDetail = navParams.data.routeDetail;
    this.feedback.service_name = this.routeDetail.service_name;
    this.feedback.service_status = this.routeDetail.status;
    this.feedback.payment_mode = this.routeDetail.payment_type;
    this.feedback.approx_cost = this.routeDetail.amount;
  }

  ionViewDidLoad() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
    })
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  provideFeedback() {
    if (this.feedback.comment.trim() ===''){
      this.util.presentToast('Please write comment');
      return;
    }
    this.util.presentLoader();
    this.user.addFeedback(this.feedback,this.userData.Authorization).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.util.presentAlert('',resp.message);
        this.navCtrl.setRoot('MenuPage');
      }
      this.util.dismissLoader();
    },error => {
      this.util.dismissLoader();
      console.error(error);
    });
  }

  workQualityChange(rating: number) {
    this.feedback.work_quality = rating;
  }

  timingChange(rating: number) {
    this.feedback.timings = rating;
  }

  serviceProviderChange(rating: number) {
    this.feedback.service_provider = rating;
  }
}
