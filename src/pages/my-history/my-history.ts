import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {User} from "../../providers";

@IonicPage()
@Component({
  selector: 'page-my-history',
  templateUrl: 'my-history.html',
})
export class MyHistoryPage {

  userType:any={};
  userData:any={};
  pageNumber:number=1;
  pageSize:number=10;
  historyList:any=[];
  isListEmpty:boolean=false;
  isCustomer: boolean = false;
  constructor(public navCtrl: NavController,
              public storage: Storage,
              public util: UtilProvider,
              public user: User,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.pageNumber=1;
    this.storage.get('userType').then(userType=>{
      this.storage.get('userData').then(userData=>{
        this.userData=JSON.parse(userData);
        if (userType == USERTYPE_DRIVER){
          this.isCustomer = false;
        }else {
          this.isCustomer = true;
        }
        this.getHistory(this.isCustomer,true,this.pageNumber).then(res=>{
          this.historyList=res;
          this.historyList.lenght>0?this.isListEmpty=false:this.isListEmpty=true;
        }).catch(err=>{
          this.historyList.lenght>0?this.isListEmpty=false:this.isListEmpty=true;
        })
      })
    });
  }

  openNotification() {
    this.navCtrl.push('NotificationPage');
  }

  goDetail(item) {
    // this.navCtrl.push('HistoryDetailPage');
    this.navCtrl.push("HistoryDetailPage",{detail:item});
  }

  getHistory(isCustomer,pageNumber,isRefresh) {
    return new Promise((resolve, reject) => {
      let data = {
        pageNumber:pageNumber,
        pageSize:this.pageSize
      }
      if (isRefresh){
        this.util.presentLoader();
      }
      this.user.getHistory(data,this.userData.Authorization,isCustomer).subscribe(res=>{
        let resp : any = res;
        this.historyList = resp.data;
        console.log(res);
        this.historyList.length && this.historyList.length > 0?this.isListEmpty = false:this.isListEmpty = true;
        if (resp.status){
          resolve(resp.data);
        }else {
          reject(false)
          this.historyList = [];
        }
        if (isRefresh){
          setTimeout(()=>{
            this.util.dismissLoader();
            this.historyList.length && this.historyList.length > 0?this.isListEmpty = false:this.isListEmpty = true;
          },500)
        }
      });
    })
  }

  doRefresh(refresher) {
    this.pageNumber = 1;
    this.getHistory(this.isCustomer,this.pageNumber,false).then(succ=>{
      // console.log('succ',succ);
      refresher.complete();
    }).catch(err=>{
      console.log(err);
      refresher.complete();
    })
  }
  doInfinite(infiniteScroll) {
    this.getHistory(this.isCustomer,this.pageNumber,false).then(succ=>{
      infiniteScroll.complete();
    }).catch(err=>{
      infiniteScroll.complete();
    })
  }
}
