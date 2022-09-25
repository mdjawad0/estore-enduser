import { Category } from "./category";

export class Products {
  productId: any;
  productTitle?: string;
  productCode?: string;
  productDescription?: string;
  price: any;
  categoryId: any;
  images: string[] = [];
  thumbnailImage: number = 0;
  active?: boolean;
  addedOn?: Date;
  rating: any;
}
