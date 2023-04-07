import { Component ,OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products:Array<Product>|undefined;
  currentPage:number=0;
  pageSize:number=5;
  totalPages:number=0;
  errorMessage!:string;
  searchFormGroup!:FormGroup;
  currentAction: string="all";
  constructor( private productService : ProductService ,
                 private router:Router,
              private fb:FormBuilder ,
               public authService:AuthService ){}

   ngOnInit(): void {

    this.searchFormGroup=this.fb.group({
      keyword: this.fb.control(null)
    });
    this.handleGetPageProducts();
     
   }
   handleGetPageProducts(){
    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe(
      {next : (data)=>{
        this.products=data.products;
        this.totalPages=data.totalPages;
      },
      error:(err)=>{
        this.errorMessage=err;
      }
    }
    )
   }

   handleGetAllProducts(){
    this.productService.getAllProducts().subscribe(
      {next : (data)=>{
        this.products=data;
      },
      error:(err)=>{
        this.errorMessage=err;
      }
    }
    )
   }
   handleDeleteProduct(prod:Product){
    let conf=confirm("Are you sure?")

    if (conf==false) return;

    this.productService.deleteProduct(prod.id).subscribe({
      next: (data)=>{
        //this.handleGetAllProducts();
        let index = this.products?.indexOf(prod);
        this.products?.splice(index!,1)
      }
    })
   }
   handlePromotion(prod:Product){
    let promo=prod.promotion
    this.productService.setPromotion(prod.id).subscribe({
      next:(data:boolean)=>{
        prod.promotion=!promo;
      },
      error : err =>{
        this.errorMessage=err
      }
    })

   }
   handleSearchProducts(){
    this.currentAction="search";
    let keyword=this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword,this.currentPage,this.pageSize).subscribe({
      next:(data)=>{
        this.products=data.products;
        this.totalPages=data.totalPages;
      }
    })
   }
   goToPage(i:number){
    this.currentPage=i;
    if(this.currentAction==='all')
    this.handleGetPageProducts()
    else 
    this.handleSearchProducts()
   }

   handleNewProduct(){
    this.router.navigateByUrl("/admin/newproduct");


   }
}
