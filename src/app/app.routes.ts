import { Routes } from '@angular/router';
import { ProductsListComponent } from './Pages/products-list/products-list.component';
import { CartComponent } from './Pages/cart/cart.component';
import { SingleProductComponent } from './Pages/single-product/single-product.component';
import { NotFoundComponent } from './Erros/not-found/not-found.component';
import { ProductRouteActivatorService } from './Pages/single-product/product-route-activator.service';
import { AddProductComponent } from './Pages/addproduct/addproduct.component';
import { LoginGaurdService } from './Erros/login-gaurd.service';
import { WishlistComponent } from './Pages/wishlist/wishlist.component';
import { OrderhistoryComponent } from './Pages/orderhistory/orderhistory.component';
import { SignupComponent } from './Components/signup/signup.component';
import { LoginComponent } from './Components/login/login.component';
import { AdduserComponent } from './Pages/adduser/adduser.component';
import { AddressComponent } from './Pages/address/address.component';
import { InvoiceComponent } from './Pages/invoice/invoice.component';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';

export const routes: Routes = [{
    path:'',
    pathMatch:'full',
    component:ProductsListComponent,
},
{
    path:'single-product',
    component:SingleProductComponent,
    canActivate:[ProductRouteActivatorService]
},
{
    path:'single-product/:id',
    component:SingleProductComponent,
    canActivate:[ProductRouteActivatorService]
},
{
    path:'cart',
    pathMatch:'full',
    component:CartComponent,
    canActivate:[LoginGaurdService]
},
{
    path:'404',
    component:NotFoundComponent
},
{
    path:'login',
    component:LoginComponent
},
{
    path:'private',
    component:LoginComponent
},
{
    path:'addproduct',
    component:AddProductComponent,
    canActivate:[LoginGaurdService]
},
{
    path:'wishlist',
    component:WishlistComponent
},
{
    path:'add/:id',
    component:AddProductComponent
},
{
    path:'orderhistory',
    component:OrderhistoryComponent
},
{
    path:'signup',
    component:SignupComponent
},
{
    path:'adduser',
    component:AdduserComponent
},
{
    path:'address',
    component:AddressComponent
},
{
    path:'invoice',
    component:InvoiceComponent
},
{
    path:'profile',
    component:UserProfileComponent
}
];
