import { Component,Input,OnChanges } from "@angular/core";
import { SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES } from "ng-semantic";
import { Http, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map'

@Component({
    selector: "advertise",
	styleUrls:['/assets/css/bootstrap.css','/assets/css/styles.css'],
	templateUrl: 'client/components/advertise/advertise.component.html'

})

export class advertiseComponent implements OnChanges{
	experiences_days_shuffle:any[] = [{}] ;
	response: any;
	data: any;
	error: any;
    category_search:string='';
	@Input() catSearch:string='';
    @Input() expDays:any[];

	constructor(public http: Http) {

	}
	ngOnChanges() {
		this.category_search = this.catSearch;
        this.experiences_days_shuffle = this.expDays;
	}
}
