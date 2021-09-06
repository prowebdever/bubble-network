import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController,LoadingController } from '@ionic/angular';
//import {Stripe} from '@ionic-native/stripe/ngx';
declare var Stripe;
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  pop: PopoverController;
  price = 0;
  cardNumber: string;
  cardMonth: number;
  cardYear: number;
  cardCVV: string;
  is_paid = false;

  /***************** Stripe *******************/
  stripe_secret_key:string = 'sk_test_51HbCTAHdInK4l3MN1mDshyKCEzf2NFKOzNxsxpuXP9aqyT6N3AUKqGDWj0lbU8Jw4PhtQmk6kAfHaDxYhYudaNK400GOJV3SKs';
  stripe_publishable_key:string = 'pk_test_51HbCTAHdInK4l3MNS90PDpel0GWwrHVig9ROr7gx2l43zDmwBpGm6tQF8gyYgESkaCZmNjm0fc0ZyQ7lUo2mIsLk00N6iyehkX';
  /*********************************************/

  stripe = Stripe(this.stripe_publishable_key);
  card: any;

  constructor(navParams: NavParams, private http: HttpClient, public loadingController: LoadingController) {
    this.price = navParams.get('price');
    this.pop = navParams.get('popoverController');
  }

  ngOnInit() {
    this.setupStripe();
  }

  payWithStripe() {
  /*
    this.stripe.setPublishableKey(this.stripe_publishable_key);
    let card = {
      number: this.cardNumber,
      expMonth: this.cardMonth,
      expYear: this.cardYear,
      cvc: this.cardCVV
     };
    this.stripe.createCardToken(card)
      .then(token => {
        console.log(token);
        //this.makePayment(token.id);
      })
      .catch(error => console.error(error));*/
  }

  setupStripe() {
      let elements = this.stripe.elements();
      var style = {
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

      this.card = elements.create('card', { style: style, hidePostalCode:true });
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
        console.log(event)

        this.stripe.createSource(this.card).then(result => {
          if (result.error) {
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          } else {
            console.log(result);
            this.makePayment(result.source);
          }
        });
      });
    }

  async makePayment(source) {
    const loadingElement = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'crescent'
    });
    await loadingElement.present();
     this.http.post('https://bubbleflix.herokuapp.com/payment/stripe',
        {
            amount: this.price * 100,
            currency: "usd",
            token: source.id
        })
        .subscribe(data => {
            loadingElement.dismiss();
            this.is_paid = true;
            this.close();
        }, error => {
            loadingElement.dismiss();
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = error;
        });
  }

  close() {
    this.pop.dismiss(this.is_paid);
  }
}
