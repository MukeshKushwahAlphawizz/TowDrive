import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  isToggle: boolean = true;
  language: any = 'ot';
  token : any = '';
  userData : any = '';
  role : any = '2';

  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public user:User,
              public navParams: NavParams) {
    this.storage.get('userType').then(userType=>{
      if (userType == USERTYPE_DRIVER){
        this.role = '3';
      }
    });
  }

  ionViewDidLoad() {
    this.storage.get('token').then(token=>{
      this.token = token;
    })
    this.storage.get('userData').then(userdata=>{
      this.userData = JSON.parse(userdata);
    });
  }

  openNotification() {

  }

  deleteAccount() {
    this.util.presentConfirm('Confirm Delete','Are you sure, you want to delete your account?').then(res=>{
      this.util.presentLoader('');
      let data = {
        account_status:'1'
      }
      this.user.deleteAccount(data,this.token,this.role).subscribe(res=>{
        let resp:any = res;
        if (resp.status){
          this.storage.set('userData',null);
          this.storage.set('token',null);
          this.navCtrl.setRoot('SelectTypePage');
        }else {
          this.util.presentToast(resp.message);
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        })
      })
    }).catch(err=>{
      console.log(err);
      this.util.dismissLoader();
    })
  }

  gotoChangePassword() {
    this.navCtrl.push('ChangePasswordPage');
  }

  changeAddress() {

  }

  changeNotif(event) {

  }

  selectLanguage() {

  }
}
