import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {ActionSheetController} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  userData:any = '';
  firstName: any = '';
  lastName: any = '';
  address: any = '';
  mobileNumber: any = '';
  email: any = '';
  profileImg: any = '';
  profileImgToShow: any = '';
  token: any = '';
  role: any = '2';
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public user:User,
              public actionSheetCtrl:ActionSheetController,
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
      if (userdata){
        this.userData = JSON.parse(userdata);
        this.email = this.userData.email;
        this.firstName = this.userData.first_name;
        this.lastName = this.userData.last_name;
        this.mobileNumber = this.userData.mobile;
        this.address = this.userData.address;
        this.profileImgToShow = this.userData.image;
      }
    });
  }

  openNotification() {
    this.navCtrl.push('NotificationPage');
  }

  save() {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.email.trim())) {
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('email',this.email);
      formData.append('first_name',this.firstName);
      formData.append('last_name',this.lastName);
      formData.append('address',this.address);
      formData.append('image',this.profileImg);
      this.user.updateProfile(formData,this.token,this.role).subscribe(res=>{
        let resp :any = res;
        this.util.presentAlert('',resp.message);
        if (resp.status){
          this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
          });
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500);
      },error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }else {
      this.util.presentToast('Please enter valid email');
    }
  }

  openPicker() {
    let select = 'Choose or take a picture';
    let takePicture = 'Take a picture';
    let choosePicture = 'Choose picture';
    let actionSheet = this.actionSheetCtrl.create({
      title: select,
      buttons: [
        {
          text: takePicture,
          handler: () => {
            this.util.takePicture().then(data => {
              this.profileImg = data;
              this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        },
        {
          text: choosePicture,
          handler: () => {
            this.util.aceesGallery().then(data => {
              this.profileImg = data;
              this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        }
      ]
    });
    actionSheet.present();
  }
}
