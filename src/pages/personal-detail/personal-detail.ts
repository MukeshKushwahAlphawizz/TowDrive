import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {ActionSheetController} from "ionic-angular/index";


@IonicPage()
@Component({
  selector: 'page-personal-detail',
  templateUrl: 'personal-detail.html',
})
export class PersonalDetailPage {
  startDate: String = new Date().toISOString();
  endDate: String = new Date().toISOString();
  firstName: any = '';
  lastName : any = '';
  address : any = '';
  dob : any = '';
  profileImg : any = '';
  requestData : any = {
    username:'',
    email:'',
    mobileNumber:'',
    password:'',
    firebaseToken:''
  };
  imageName: string = 'Upload Photo';
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public storage:Storage,
              public actionSheetCtrl:ActionSheetController,
              public navParams: NavParams) {
    this.requestData = JSON.parse(navParams.data.requestData);
  }

  ionViewDidLoad() {
  }

  back() {
    this.navCtrl.pop();
  }

  next() {
    this.util.presentLoader('');
    let formData = new FormData();
    formData.append('username',this.requestData.username);
    formData.append('email',this.requestData.email);
    formData.append('mobile',this.requestData.mobile);
    formData.append('password',this.requestData.password);
    formData.append('firebaseToken',this.requestData.firebaseToken);
    formData.append('first_name',this.firstName);
    formData.append('last_name',this.lastName);
    formData.append('address',this.address);
    formData.append('dob',this.dob);
    formData.append('image',this.profileImg);

    this.user.signup(formData).subscribe(res=>{
      let resp :any = res;
      this.util.presentAlert('',resp.message);
      if (resp.status){
        this.storage.set('token',resp.data.Authorization);
        this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
          this.navCtrl.setRoot('MenuPage');
        });
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    })

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
              this.imageName = this.util.randomImg();
              // this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        },
        {
          text: choosePicture,
          handler: () => {
            this.util.aceesGallery().then(data => {
              this.profileImg = data;
              this.imageName = this.util.randomImg();
              // this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        }
      ]
    });
    actionSheet.present();
  }
}
