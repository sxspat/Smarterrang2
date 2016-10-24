import {Component,Input,OnChanges,Output,EventEmitter,NgZone} from '@angular/core';
import {RatingComponent} from '../rating/rating.component';
import { Http, Headers, RequestOptions } from "@angular/http";
import {commentFilter} from '../../pipes/filterpipe';
import {CommentsAllComponent} from '../commentsall/commentsall.component';
import { ShoppingCartService } from '../../service/shoppingCart-service';
import { Router } from '@angular/router';

@Component({

    selector: "comment",
    styleUrls:['/assets/css/bootstrap.css','/assets/css/styles.css'],
    templateUrl: 'client/components/comments/comments.component.html',
})

export class CommentsComponent implements OnChanges{

    rate:number;
    cartValue:number = 0;
    textValue:string='';
    alive:boolean = false;
    id:string;
    data:any;
    _id:string;
    nameMain:string;
    role:number;
    @Input() countCommentSum:any[];
    @Input() comments:any[];
    @Input() rec:any;
    @Input() isAlive:boolean;
    showComment:boolean = false;
    showComment2:boolean = false;
    @Output() commentStatus:EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() refreshComments:EventEmitter<boolean> = new EventEmitter<boolean>();

    // @Input showComment:boolean;
    constructor(private router: Router, public http: Http, private shoppingCartService: ShoppingCartService) {
        this.rate = 1;
    }

    hideComment(){
        this.showComment = false;
        this.commentStatus.emit(this.showComment);
    }

    hideDetails(){
        this.showComment2 = false;

    }
    addComments(){

        this.http.get('/user/getUser/'+this.id)
		.map((res: any) => res.json())
			.subscribe(
				(res: any) => {
				if(res.local!=undefined)
					this.nameMain = res.local.nameMain;
				else if(res.facebook!=undefined)
					this.nameMain = res.facebook.name;
				else if(res.twitter!=undefined)
					this.nameMain = res.twitter.displayName;
				else if(res.google!=undefined)
					this.nameMain = res.google.name;

                var formData = {
					namePerson : this.nameMain,
					star : this.rate,
					commentsData : this.textValue,
					token : this.id,
					objectID : this.rec._id
				};

                this.http.post('/api/comments/',formData)
                .map((res: any) => res.json())
                    .subscribe(
                        (res: any) => {
                            this.refreshComments.emit(true);
                            this.textValue='';
                            this.rate=1;
                        },(error: any) => {
				            console.log(error);
			    });

                this.http.post('/api/postReviewTotal/',formData)
                .map((res: any) => res.json())
                    .subscribe(
                        (res: any) => {

                        },(error: any) => {
				            console.log(error);
			    });

            },
			(error: any) => {
				console.log(error);
			}
		);

    }

    ngOnChanges() {
        console.log(this.cartValue);
        this.alive = this.isAlive

		this.http.get('/loginStatus',new RequestOptions({ body: '',
			headers: new Headers({"Content-Type": "application/json"})
		}))
		.map((res: any) => res.json())
			.subscribe(
				(res: any) => {
				this.data = res;

				if(this.data.role!=null && this.data.role!=undefined) {
					// console.log(this.role);
					this.isAlive = true;
					this.id=this.data.id;
				}
				else {
					this.role = null
					this.isAlive = false;
					this.id=null;
				}
					// console.log(this.isAlive+' testing alive status');
			},
			(error: any) => {
				console.log(error);
			}
		);

    }
    rateFunction(rating){
        return this.rate;
    }
    rateVal(val){
        this.rate = val;
        console.log('changed Rate: '+val);
    }
    valueChanges(rec){
        console.log(this.cartValue);
        if(this.cartValue < 0){
            this.cartValue = 0;
            return false;
        }
        if(this.cartValue > rec.amountProduct){
            this.cartValue = rec.amountProduct;
            return false;
        }
    }
    addToCart(rec) {
        if(this.cartValue<1){
            alert('Please enter amonut');
            return;
        }
        var item = { id: rec._id, title: rec.title, description: rec.description, quantity: this.cartValue, price: rec.price, currency: rec.currency };
        var existingItem = this.shoppingCartService.cartItems.find(p => p.id == item.id);
        if (existingItem){
            existingItem.quantity += this.cartValue;
        }
        else{
            this.shoppingCartService.cartItems.push(item);
        }
    }
}
