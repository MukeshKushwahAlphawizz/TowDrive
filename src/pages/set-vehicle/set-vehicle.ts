import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-set-vehicle',
  templateUrl: 'set-vehicle.html',
})
export class SetVehiclePage {
  startDate: String = new Date().toISOString();
  endDate: String = new Date().toISOString();
  requestData : any = {
    service_id:'1',
    current_location:'',
    latitude:'',
    longitude:'',
    address:'',
    card_holder_name:'',
    amount:'50',
    pickup_date:'',
    pickup_time:'',
    vehicle_name:'',
    vehicle_model:'',
    vin:'',
    tyre_size:'',
    breakdown_scrap:'',
    mobile_machenic_option:'',
    battery_name:'',
    battery_model:'',
    battery_capacity:'',
    payment_type:'',
    token:''
  }
  constructor(public navCtrl: NavController,
              public storage : Storage,
              public navParams: NavParams) {
    this.requestData.service_id = navParams.data.category;
    storage.get('myLocationObject').then(myLocationObject=>{
      this.requestData.current_location = myLocationObject.location;
      this.requestData.address = myLocationObject.address;
      this.requestData.latitude = myLocationObject.lat;
      this.requestData.longitude = myLocationObject.lng;
    })
  }

  ionViewDidLoad() {

  }

  back() {
    this.navCtrl.pop();
  }

  pay() {
    if (this.requestData)
    this.navCtrl.push('PaymentPage',{requestData:this.requestData});
  }
}
