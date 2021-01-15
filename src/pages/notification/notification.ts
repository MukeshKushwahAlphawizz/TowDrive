import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {FirebaseProvider} from "../../providers/firebase/firebase";


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
  userData:any={}
  isDriver: boolean = false;
  constructor(public navCtrl: NavController,
              public user: User,
              public util: UtilProvider,
              public firedb: FirebaseProvider,
              public storage: Storage,
              public navParams: NavParams) {
    this.storage.get('userType').then(userType=> {
      if (userType == USERTYPE_DRIVER) {
        this.isDriver = true;
      }
    })
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  liveTracking(item: any) {
    this.storage.set('currentRoute',item.service_details).then(()=>{
      this.storage.set('isRequestSent',true).then(()=>{
        this.navCtrl.push('SetLocationPage');
      });
    })
  }

  chatDriver(driver: any) {
    let driverData = {
      date_of_join:new Date().getTime(),
      id:driver.driver_id+'_D',
      image:driver.driver_image,
      isDriver:true,
      name:driver.driver_name,
    }
    this.firedb.addUser(driverData,this.userData.id+'_C');
    let chatRef = this.userData.id+'_C'+'-'+driverData.id;
    this.navCtrl.push("ChatPage",{chatRef:chatRef,driver:driverData,customer:this.userData});
  }

  refresh() {
    this.getUserData();
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.pageNumber = 1;
      this.getAllNotification(this.pageNumber,true).then(res=>{
      }).catch(err=>{});
    })
  }

  getAllNotification(pageNumber,isShowLoader) {
    return new Promise((resolve, reject) => {
      if (isShowLoader){
        this.util.presentLoader();
      }
      let data = {
        "pageNumber":this.pageNumber,
        "pageSize":this.pageSize
      }
      this.user.getAllNotifications(data,this.userData.Authorization).subscribe(res=>{
        let response : any = res;
        if (response.status){
          pageNumber == '1'|| pageNumber == 1?this.notificationList = response.data:
            this.notificationList = [...this.notificationList,...response.data];

          this.notificationList = this.notificationList.filter(item=>{
            if (this.checkIsToday(parseInt(item.create_dt))){
              item.isToday = true;
              item.isYesterday = false;
              item.isOld = false;
              this.isTodayAvailable = true
            }else if (this.checkIsYesterday(parseInt(item.create_dt))){
              item.isToday = false;
              item.isYesterday = true;
              item.isOld = false;
              this.isYesterdayAvailable = true;
            }else {
              item.isOld = true;
              item.isToday = false;
              item.isYesterday = false;
              this.isPast = true;
            }
            return item;
          })
          this.notificationList.length > 0 ? this.isListEmpty = false: this.isListEmpty = true;
          this.pageNumber = this.pageNumber + 1;
          console.log(this.notificationList);
          resolve('');
        }else {
          pageNumber==1||pageNumber=='1'? this.notificationList = []:'';
          this.notificationList.length > 0 ? this.isListEmpty = false: this.isListEmpty = true;
          reject('');
        }
        if (isShowLoader){
          setTimeout(()=>{
            this.util.dismissLoader();
          },500);
        }
      },error => {
        reject('');
        console.error(error);
        if (isShowLoader){
          this.util.dismissLoader();
        }
      })
    })
  }

  doRefresh(refresher) {
    this.pageNumber = 1;
    this.getAllNotification(this.pageNumber,false).then(succ=>{
      // console.log('succ',succ);
      refresher.complete();
    }).catch(err=>{
      console.log(err);
      refresher.complete();
    })
  }
  doInfinite(infiniteScroll) {
    this.getAllNotification(this.pageNumber,false).then(succ=>{
      infiniteScroll.complete();
    }).catch(err=>{
      infiniteScroll.complete();
    })
  }

  clear(isClearAll: boolean,isPast) {
    let d : any = new Date();
    let yesterday : any = '';
    if (isClearAll){
      yesterday = d.setDate(d.getDate() - 1);
      yesterday = new Date(yesterday);
    }
    let data = {
      "is_clear":isClearAll?'2':'1',
      "notification_date":isPast?'':isClearAll?yesterday.getTime().toString():d.getTime().toString()
    }
    this.util.presentConfirm('Clear notification','Are you sure want to clear?').then(succ=>{
      this.util.presentLoader('Clearing..');
      this.user.clearNotifications(data,this.userData.Authorization).subscribe(succ=>{
        this.util.dismissLoader();
        let response : any = succ;
        if (response.status){
          this.util.presentToast(response.message);
        }
        this.pageNumber = 1;
        this.getAllNotification(this.pageNumber,true).then(succ=>{
        }).catch(err=>{
        })
      },err=>{
        console.log(err);
        this.util.dismissLoader();
      })

    }).catch(err=>{})
  }

  checkIsToday(date:any){
    const today = new Date();
    const someDate = new Date(parseInt(date));
    if (someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()){
      return true;
    }else {
      return false;
    }
  }
  checkIsYesterday(date:any){
    const today = new Date();
    const someDate = new Date(parseInt(date));
    let date1_tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    if (date1_tomorrow.getFullYear() == someDate.getFullYear() && date1_tomorrow.getMonth() == someDate.getMonth()
      && date1_tomorrow.getDate() == someDate.getDate()) {
      // console.log('1.yesterday date');
      return true;
    }else {
      return false;
    }
  }
}
