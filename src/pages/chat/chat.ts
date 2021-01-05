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
  chatList = [
    {
      userProfile:'assets/img/user-default.png',
      dateTime:'10:22 am',
      message:'Hey, Whats Ur Plan Today ?',
      isMine:false
    },
    {
      userProfile:'assets/img/user-default.png',
      dateTime:'10:24 am',
      message:'Hey, Whats up? mmm.. Nothing special for now.',
      isMine:true
    },
    {
      userProfile:'assets/img/user-default.png',
      dateTime:'10:24 am',
      message:'Great! I’ill Pick you in a moment.',
      isMine:false
    },
    {
      userProfile:'assets/img/user-default.png',
      dateTime:'10:26 am',
      message:'Okay i m waiting...',
      isMine:true
    },
    {
      userProfile:'assets/img/user-default.png',
      dateTime:'',
      message:'...',
      isMine:false
    },

  ]
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
    // this.chatRef = navParams.data.chatRef;
    this.chatRef = '101_C-001_D'
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
        id:'101_C',
        image:'this.customer.image',
        isDriver:false,
        name:'this.customer.first_name'
      }
      //adding a customer user into driver
      // this.firedb.addUser(customer,this.driver.id);
      this.firedb.addUser(customer,'001_D');
    }).catch(err=>{})
  }

  scrollBottom(){
    if (this.content){
      setTimeout(()=>{
        this.content.scrollToBottom();
      },200)
    }
  }
}
