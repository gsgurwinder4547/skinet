import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService)
  
  // init() {
  //   const cartId = localStorage.getItem('cart_id');
  //   const cart$ = cartId ? this.cartService.getCart(cartId) : of(null)

  //   return cart$;
  // }
  init() {
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) return of(null);

    return this.cartService.getCart(cartId).pipe(
      catchError(err => {
        console.error('Init: getCart failed; clearing cart_id', err);
        localStorage.removeItem('cart_id');
        return of(null); // <-- never reject
      })
    );
  }
}
