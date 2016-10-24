import {Component, Input,OnInit, Output, EventEmitter} from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import {  Router } from '@angular/router';
import {DatepickerComponent} from '../datepicker/my-date-range-picker.component';
declare var $:any;
@Component({
styleUrls:['/assets/css/bootstrap.css', '/assets/css/profile.css'],
	selector: "profile",
	templateUrl: `client/components/profile/profile.component.html`

})

export class ProfileComponent implements OnInit {
	Id:string ='';
	data:any;
	Name:String='';
	files:any;
	daterange:any;
	experienceOwn:any;
	@Input() dataRecords:any[];
  @Input() userId:string;
	@Output() refreshPage:EventEmitter<boolean> = new EventEmitter<boolean>();


	constructor(public http: Http,private router:Router){}

	ngOnChanges() {
		this.experienceOwn = this.dataRecords;
		this.Id = this.userId;
	}
	ngOnInit() {
		this.http.get('/isUserLogin').map((res: any) => res.json())
			.subscribe(
				(res: any) => {
				 this.data = res;
					if(res=='notLoggedIn'){
						this.router.navigate(['/']);
					}else{
						//logged in user object available here

							this.Id=this.data._id;
						  this.Name = this.data.local.nameMain.toUpperCase();
							console.log(this.data+ ' Aliiii');
						console.log(res);
					}

				});
	}



myOptions: any = {
activateWeekend: true // or false
}
dateRangeChanged($event) {
this.daterange = $event;
console.log(this.daterange.formatted); // includes ranges changed
}


	profileRemove(){
		//alert('Removed');
		this.http.get('/image/removeProfileImage/'+this.Id,new RequestOptions({ body: '',
			headers: new Headers({"Content-Type": "application/json"})
		}))
		.map((res: any) => res.json())
			.subscribe(
				(res: any) => {
					if(res=='success') {
						alert('Removed Profile Image successully.');
						this.refreshPage.emit(true);
					}

				},
				(error: any) => {
					console.log(error);
				}
			);
	}

	onFileSelect(event){
		this.files = event.srcElement.files[0];
		if ((this.files.type === 'image/jpeg') || (this.files.type === 'image/png')) {
			console.log('profile image name: ' + this.files.name);
				if (this.files.size > 200000) {
					alert(this.files.name + ' size exceeds more than 200 KB ');
					return;
				}
			} else {
				alert(this.files.name + ' invalid image');
				return;
			}
		var data = new FormData();
		data.append("file",this.files);

		data.append("userid",this.Id);
		data.append("type",this.files.type);
		$.ajax({
						url: './image/addprofileimage',
						type: 'POST',
						data: data,
						contentType: false,
						processData: false,
						success: function(data) {
				alert('Profile Image replaced')
								console.log(JSON.stringify(data));
						},error: function (error) {
							alert("error in ajax form submission");
							console.log(error);
					}
				});
	}


}
