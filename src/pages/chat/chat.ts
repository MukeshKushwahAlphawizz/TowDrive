import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  openNotif() {
    this.navCtrl.push('NotificationPage');
  }
}
