import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommentsAllComponent } from '../commentsall/commentsall.component';
import { CheckOutService } from '../../service/checkoutService';
import { ShoppingCartService } from '../../service/shoppingCart-service';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { Http, Headers, RequestOptions } from "@angular/http";
import { TransactionService } from '../../service/transactionService';
import 'rxjs/add/operator/map';
declare var $:any;

@Component({
    selector: "check-out",
    templateUrl: 'client/components/checkout/checkout.component.html',
    styleUrls:['/assets/css/bootstrap.css','/assets/css/checkout.css'],
})
export class CheckOutComponent {
	check1Active:string = 'active';
	check2Active:string = 'disabled';
	check3Active:string = 'disabled';
	checkout:string = '1';
	addressform:FormGroup;
	payment:string = 'paypal';
    constructor(public http: Http, public fb:FormBuilder, private checkoutService: CheckOutService, private shoppingCartService: ShoppingCartService, private transactionService: TransactionService) {
    	this.addressform = fb.group({
	        salutation : ['',Validators.required],
	        title:['',Validators.required],
	        firstname : ['',Validators.required],
	        lastname:['',Validators.required],
	        company : ['',Validators.required],
	        street:['',Validators.required],
	        streetnr : ['',Validators.required],
	        zip:['',Validators.required],
	        city : ['',Validators.required],
	        country:['',Validators.required],
	        phone : ['',Validators.required],
	        email:['',Validators.required],
        });   
    }

    onPrev(){
    	if(this.checkout == '3'){
    		this.check1Active = 'active';
    		this.check2Active = 'disabled';
    		this.check3Active = 'disabled';
    		this.checkout = '1';
    	}else if(this.checkout == '2')
    	{
    		this.check1Active = 'active';
    		this.check2Active = 'disabled';
    		this.check3Active = 'disabled';
    		this.checkout = '1';
    	}else if(this.checkout == '1'){
    		this.shoppingCartService.showCart=true; 
    		this.checkoutService.showCheckout=false;
    	}
    	
    }
    onNext(){

    	if(this.checkout == '1'){
    		this.check1Active = 'disabled';
    		this.check2Active = 'disabled';
    		this.check3Active = 'active';
    		this.checkout = '3';

    		var salutation = this.addressform.controls.salutation.value;
	    	var title = this.addressform.controls.title.value;
	    	var firstname = this.addressform.controls.firstname.value;
	    	var lastname = this.addressform.controls.lastname.value;
	    	var street = this.addressform.controls.street.value;
	    	var streetnr = this.addressform.controls.streetnr.value;
	    	var company = this.addressform.controls.company.value;
	    	var zip = this.addressform.controls.zip.value;
	    	var city = this.addressform.controls.city.value;
	    	var country = this.addressform.controls.country.value;
	    	var phone = this.addressform.controls.phone.value;
	    	var email = this.addressform.controls.email.value;

	    	var item = { salutation: salutation, title: title, firstname: firstname, lastname: lastname, street: street, streetnr: streetnr, company: company, zip: zip, city: city, country: country, phone: phone, email: email };

	    	this.checkoutService.addressInfo = item;

    	}else if(this.checkout == '2')
    	{
    		alert(this.payment);
    		this.check1Active = 'disabled';
    		this.check2Active = 'disabled';
    		this.check3Active = 'active';
    		this.checkout = '3';

    	}else if(this.checkout == '3')
        {
            //$("#myModal").modal('show');
            this.checkoutService.showCheckout = false;
            this.transactionService.show = true;
            /*var data = new FormData();
            data.append("amount","10");
            data.append("payment_method_nonce","3ce904cc-7a77-4fff-8b1d-8630a33db3fc");//payment_method_nonce:3ce904cc-7a77-4fff-8b1d-8630a33db3fc
            
            // /checkout/checkout is should be called with this func.
            this.http.post('/checkout/checkout',data)
            .map((res: any) => res.json())
            .subscribe(
                (res: any) => {
                    console.log(res);
                    //console.log(this.response);
                },
                (error: any) => {
                    console.log(error);
                }
            );*/
        }

    }
    setPayment(){
    	this.payment = 'paypal';
    }
    setDebit(){
    	this.payment = 'debit';
    }
}
