import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App} from "ionic-angular/index";
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  allUsers:any=[];
  userData:any={};
  isListEmpty:boolean=false;
  isDriver:boolean=false;
  constructor(public navCtrl: NavController,
              public app:App,
              public storage:Storage,
              public util:UtilProvider,
              public firedb:FirebaseProvider,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.storage.get('userType').then(userType=> {
        if (userType === USERTYPE_DRIVER) {
          this.isDriver = true;
          this.getAllDrivers();
        }else {
          this.getAllCustomers();
        }
      })
    })
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  openChat(otherUser) {
    if (this.isDriver){
      let chatRef = otherUser.id+'-'+this.userData.id+'_D';
      this.navCtrl.push("ChatPage",{chatRef:chatRef,customer:otherUser,driver:this.userData});
    }else {
      let chatRef = this.userData.id+'_C'+'-'+otherUser.id;
      this.app.getRootNav().push("ChatPage",{chatRef:chatRef,driver:otherUser,customer:this.userData});
    }
  }

  getAllCustomers() {
    this.util.presentLoader();
    this.firedb.getAllUsers(this.userData.id+'_C').subscribe(data=>{
      if (data && data.length){
        this.allUsers = data;
        this.allUsers = this.allUsers.filter(item=>{
          this.firedb.getFirstChat(this.userData.id+'_C'+'-'+item.id).subscribe(data=>{
            if (data && data[0]){
              item.last_message = data[0]['message'];
              item.last_message_time = data[0]['date'];
            }else {
              //if latest message is undefined then check again for latest message
              this.firedb.getFirstChat(this.userData.id + '_C' + '-' + item.id).subscribe(data => {
                item.last_message = data[0]['message'];
                item.last_message_time = data[0]['date'];
              })
            }
          })
          return item;
        })
      }
      this.allUsers.length && this.allUsers.length>0?this.isListEmpty=false:this.isListEmpty=true;
      // console.log('all users of customer >>>',this.allUsers);
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    });
  }
  getAllDrivers() {
    this.util.presentLoader();
    this.firedb.getAllUsers(this.userData.id+'_D').subscribe(data=>{
      if (data && data.length){
        this.allUsers = data;
        this.allUsers = this.allUsers.filter(item=>{
          this.firedb.getFirstChat(item.id+'-'+this.userData.id+'_D').subscribe(data=>{
            if (data && data[0]){
              item.last_message = data[0]['message'];
              item.last_message_time = data[0]['date'];
            }else {
              //if latest message is undefined then check again for latest message
              this.firedb.getFirstChat(item.id+'-'+this.userData.id+'_D').subscribe(data => {
                item.last_message = data[0]['message'];
                item.last_message_time = data[0]['date'];
              })
            }
          })
          return item;
        })
      }
      this.allUsers.length && this.allUsers.length>0?this.isListEmpty=false:this.isListEmpty=true;
      // console.log('all users of drivers >>>',this.allUsers);
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    });
  }
}
