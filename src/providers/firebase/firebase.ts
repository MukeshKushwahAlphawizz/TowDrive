import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class FirebaseProvider {
  chats: Observable<any[]>;
  users: Observable<any[]>;
  chatRef :any;
  userRef :any;
  constructor(public http: HttpClient,public db : AngularFireDatabase) {

  }

  addUser(customer,driverId) {
    let users : any = this.db.list('/all-users/'+driverId).valueChanges();
    let disposeMe = users.subscribe(item=>{
      let userArr : any = item;
      let isUserAvailable : boolean = false;
      userArr.filter(item=>{
        if (item.id === customer.id){
          //user is already in the list
          isUserAvailable = true;
          return;
        }
      })
      disposeMe.unsubscribe();
      if (!isUserAvailable){
        this.userRef = this.db.database.ref('/all-users/'+driverId);
        this.userRef.push(customer).then(() =>{})
      }
    });
  }
  getAllUsers(userId){
    this.users = this.db.list('/all-users/'+userId).valueChanges();
    return this.users;
  }

  getFirstChat(customerDriverId){
    this.chats = this.db.list('/all-chats/'+customerDriverId,
      ref => ref.limitToLast(1)).valueChanges();
    return this.chats;
  }
  addMessage(message,ref) {
    return new Promise((resolve, reject) => {
      this.chatRef = this.db.database.ref('/all-chats/'+ref);
      this.chatRef.push(message).then(() =>{
        resolve(true);
      }).catch(()=>{
        reject(false);
      });
    });
  }
  getAllUserChats(customerDriverId){
    this.chats = this.db.list('/all-chats/'+customerDriverId).valueChanges();
    return this.chats;
  }

}
