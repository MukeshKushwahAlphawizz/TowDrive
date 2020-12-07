import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  constructor(public navCtrl: NavController,
              public app:App,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  openNotif() {

  }

  openChat() {
    this.app.getRootNav().push('ChatPage');
  }
}
