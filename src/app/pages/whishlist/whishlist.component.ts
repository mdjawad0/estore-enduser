import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-whishlist',
  templateUrl: './whishlist.component.html',
  styleUrls: ['./whishlist.component.css']
})
export class WhishlistComponent implements OnInit {

  wishlists: any[] = [];
  constructor(
    public db: DbService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.db.wishlistsSub.subscribe((list) => {
      if(list.length !== 0)  this.wishlists = list;    
    })
  }

  removeItem(id: any) {
    this.db.removeItemFromList(id, false);
    this.db.getUserWishlist();
    this.db.wishlistsSub.next(this.wishlists.splice(this.wishlists.findIndex(x => x['wishListId'] === id), 1))
  }
}
