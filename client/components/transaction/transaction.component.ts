import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { TransactionService } from '../../service/transactionService';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import 'rxjs/add/operator/map';

@Component({
    selector: 'transaction',
    templateUrl: 'client/components/transaction/transaction.component.html',
    styleUrls:['/assets/css/bootstrap.css','/assets/css/checkout.css'],
})

export class TransactionComponent {
	paymentform:FormGroup;
	constructor(public transactionService: TransactionService){
		
	}
}