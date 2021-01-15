import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {Content} from "ionic-angular/index";
import {USERTYPE_DRIVER, UtilProvider} from "../../providers/util/util";
import {Storage, StorageConfig} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;

  chatRef:any={}
  chats: any[] = [];
  isListEmpty: boolean = false;
  msg: any = '';
  driver:any='';
  customer:any='';
  toggled: boolean = false;
  isDriver: boolean = false;
  constructor(public navCtrl: NavController,
              public firedb:FirebaseProvider,
              public util:UtilProvider,
              public storage:Storage,
              public navParams: NavParams) {
    this.chatRef = navParams.data.chatRef;
    this.customer = navParams.data.customer;
    this.driver = navParams.data.driver;
    // this.chatRef = '101_C-001_D'
    this.storage.get('userType').then(userType=>{
      if (userType == USERTYPE_DRIVER){
        // this.userType = userType;
        this.isDriver = true;
        // this.role = '3';
      }
    });
  }

  ionViewDidLoad() {
    this.getAllChats();
  }
  getAllChats() {
    this.util.presentLoader();
    this.firedb.getAllUserChats(this.chatRef).subscribe(data=>{
      if (data && data.length){
        this.chats = data;
      }
      this.chats.length && this.chats.length>0?this.isListEmpty=false:this.isListEmpty=true;
      // console.log('all chat is >>>',this.chats);
      setTimeout(()=>{
        this.scrollBottom();
        this.util.dismissLoader();
      },500);
    });
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }

  sendMessage() {
    if (this.msg.trim() ===''){
      return;
    }
    if (this.isDriver){
      this.sendDriverMsg();
    }else {
      this.sendCustomerMsg()
    }
  }

  scrollBottom(){
    if (this.content){
      setTimeout(()=>{
        this.content.scrollToBottom();
      },200)
    }
  }

  sendCustomerMsg() {
    let message = {
      message:this.msg.trim(),
      date:new Date().getTime(),
      isDriver:false,
      isRead:false
    }
    this.firedb.addMessage(message,this.chatRef).then(res=>{
      this.msg = '';
      this.scrollBottom();
      let customer = {
        date_of_join:new Date().getTime(),
        id:this.customer.id+'_C',
        image:this.customer.image,
        isDriver:false,
        name:this.customer.first_name+' '+this.customer.last_name
      }
      //adding a customer user into driver
      this.firedb.addUser(customer,this.driver.id);
    }).catch(err=>{})
  }

  sendDriverMsg() {
    let message = {
      message:this.msg.trim(),
      date:new Date().getTime(),
      isDriver:true,
      isRead:false
    }
    this.firedb.addMessage(message,this.chatRef).then(res=>{
      this.msg = '';
      this.scrollBottom();
      let driver = {
        date_of_join:new Date().getTime(),
        id:this.driver.id+'_D',
        image:this.driver.image,
        isDriver:true,
        name:this.driver.username !== ''?this.driver.username:this.driver.first_name+' '+this.driver.last_name
      }
      //adding a driver user into customer
      this.firedb.addUser(driver,this.customer.id);
    }).catch(err=>{})
  }
}
