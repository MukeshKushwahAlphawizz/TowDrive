import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";

@IonicPage()
@Component({
  selector: 'page-set-vehicle',
  templateUrl: 'set-vehicle.html',
})
export class SetVehiclePage {
  startDate: String = new Date().toISOString();

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
    tyre_size:'',
    breakdown_scrap:'',
    mobile_machenic_option:'',
    battery_name:'',
    battery_model:'',
    battery_capacity:'',
    payment_type:'',
    token:'',
    drop_location:'',
    drop_latitude:'',
    drop_longitude:'',
  }
  priceData:any={};
  constructor(public navCtrl: NavController,
              public storage : Storage,
              public util : UtilProvider,
              public navParams: NavParams) {
    this.requestData.service_id = navParams.data.category;
    this.priceData = navParams.data.priceData;
    this.requestData.drop_location = navParams.data.dropData.drop_location;
    this.requestData.drop_latitude = navParams.data.dropData.drop_latitude;
    this.requestData.drop_longitude = navParams.data.dropData.drop_longitude;
    this.requestData.amount = parseFloat(this.priceData.service_charge)+parseFloat(this.priceData.distance_charge);
    console.log(this.requestData);
    storage.get('myLocationObject').then(myLocationObject=>{
      this.requestData.current_location = myLocationObject.location;
      this.requestData.address = myLocationObject.address;
      this.requestData.latitude = myLocationObject.lat;
      this.requestData.longitude = myLocationObject.lng;
    });
  }

  ionViewDidLoad() {

  }

  back() {
    this.navCtrl.pop();
  }

  pay() {
    if (this.requestData.vehicle_name.trim() ===''){
      this.util.presentToast('Please enter your vehicle name');
      return;
    }
    if (this.requestData.vehicle_model.trim() ===''){
      this.util.presentToast('Please enter your vehicle model name');
      return;
    }
    if (this.requestData.pickup_time.trim() ===''){
      this.util.presentToast('Please select pickup time');
      return;
    }
    if (this.requestData.pickup_date.trim() ===''){
      this.util.presentToast('Please select pickup date');
      return;
    }
    if (this.requestData.service_id === '1'){
      //tyre change
      if (this.requestData.tyre_size.trim() ===''){
        this.util.presentToast('Please enter the tyre size');
        return;
      }
    }else if (this.requestData.service_id === '2'){
      //Breakdown Recovery
      if (this.requestData.breakdown_scrap.trim() ===''){
        this.util.presentToast('Please select service option');
        return;
      }
    }else if (this.requestData.service_id === '3'){
      //Scrap Vehicle
      if (this.requestData.breakdown_scrap.trim() ===''){
        this.util.presentToast('Please select service option');
        return;
      }
    }else if (this.requestData.service_id === '4'){
      //Battery Start
      if (this.requestData.battery_name.trim() ===''){
        this.util.presentToast('Please enter battery name');
        return;
      }
      if (this.requestData.battery_model.trim() ===''){
        this.util.presentToast('Please enter battery model');
        return;
      }
      if (this.requestData.battery_capacity.trim() ===''){
        this.util.presentToast('Please enter battery capacity');
        return;
      }
    }else if (this.requestData.service_id === '5'){
      //Vehicle Delivery
    }else if (this.requestData.service_id === '6'){
      //Mobile Mechanic
      if (this.requestData.mobile_machenic_option.trim() ===''){
        this.util.presentToast('Please select mobile mechanic options');
        return;
      }
    }
    this.navCtrl.push('PaymentPage',{requestData:this.requestData,priceData:this.priceData});
  }
}
