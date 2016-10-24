import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommentsAllComponent } from '../commentsall/commentsall.component';
import { ShoppingCartService } from '../../service/shoppingCart-service'
import { CheckOutService } from '../../service/checkoutService'

@Component({
    selector: "shopping-cart",
    templateUrl: 'client/components/shoppingCart/shoppingCart.component.html',
})
export class ShoppingCartComponent {
    constructor(private shoppingCartService: ShoppingCartService, private checkoutService: CheckOutService) { }
    deleteItem(id) {
        this.shoppingCartService.cartItems.splice(id, 1);
    }
    calculateTotal() {
        if(this.shoppingCartService.cartItems.length == 0){
            return;
        }
        var totalAmount = 0;
        for (var index = 0; index < this.shoppingCartService.cartItems.length; index++) {
            var currentItem = this.shoppingCartService.cartItems[index];
            totalAmount +=  currentItem.price * currentItem.quantity;
        }
        return 'Total Amount:'+ this.shoppingCartService.cartItems[0].currency + totalAmount;
    }
    onCheckout(){
        for (var index = 0; index < this.shoppingCartService.cartItems.length; index++) {
            var currentItem = this.shoppingCartService.cartItems[index];
            this.checkoutService.cartItems.push(currentItem);
        }
        this.shoppingCartService.showCart=false; 
        this.checkoutService.showCheckout=true
    }
}
