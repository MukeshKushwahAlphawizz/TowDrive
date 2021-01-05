import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {User} from "../../providers";
import {PayPal, PayPalConfiguration, PayPalPayment} from "@ionic-native/paypal";

declare var Stripe;
declare var paypal: any;
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  testKey = 'pk_test_51HU6ieLh9b4PD8QRemTXIzp5TidbPqNcz2E0yG9V53HVoehsrgdrT76tvta2j5uXtzqVE3KHaWdvyDRmRW56aLM700Igbn2w1a'
  stripe = Stripe(this.testKey);
  card: any;

  isPaypal: boolean = false;
  userData: any = '';
  bookingId: any = '';
  amount: any = '';
  requestData:any={};

  payPalBtn: any;
  payPalConfig:any;
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public storage:Storage,
              public user:User,
              private payPal: PayPal,
              public navParams: NavParams) {
    this.requestData=navParams.data.requestData;
    this.payPalConfig = {
      env: 'sandbox',
      client: {
        sandbox: 'AWtxst4d1DsZBHTSYyuy9tC2Kv2qzEDQdZMNeQhlOzrq4iqwHD09_iIjPpF3QNtlqMMOxOGruNtD3kQz',
      },
      commit: false,
      payment: (data, actions) => {
        // console.log("data is", data, actions);
        return actions.payment.create({
          payment: {
            transactions: [
              { amount: { total: this.requestData.amount, currency: 'INR' } }
            ]
          }
        });
      }
    }
  }

  ionViewDidLoad() {
    this.setupStripePaypal();
    this.getUserData();
  }
  getUserData() {
    this.storage.get('userData').then(data=>{
      this.userData = JSON.parse(data);
    })
  }
  payNow() {
    // this.navCtrl.push('RequestSendPage')
  }

  paypal() {
    if (this.payPalBtn){
    }else {
      this.payPalBtn = paypal.Buttons(this.payPalConfig).render('#paypal-button');
    }
    this.isPaypal = true;
  }

  cardPay() {
    this.isPaypal = false;
  }

  setupStripePaypal(){
    let elements = this.stripe.elements();
    let style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { style: style });

    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.util.presentLoader('');
      this.stripe.createToken(this.card).then(result=>{
        console.log('token >>>',JSON.stringify(result));
        let data : any = result;
        let last4 = data.token.card.last4;
        let cardName = data.token.card.brand;
        this.stripPay(data.token.id,last4,cardName,"stripe");
      }).catch(err=>{
        console.error(err);
        this.util.dismissLoader();
      })
    });
  }

  stripPay(token,last4,cardName,method) {
    this.requestData.payment_type = method;
    this.requestData.token = token;
    this.user.serviceBooking(this.requestData,this.userData.Authorization).subscribe(res=>{
      let resp : any = res;
      this.util.presentToast(resp.message);
      if (resp.status){
        this.util.presentAlert('','Request is successfully sent');
        this.storage.set('currentRoute',null).then(()=>{
          // this.navCtrl.popToRoot();
        });
      }else {
        this.util.presentAlert('',resp.message);
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }
}
