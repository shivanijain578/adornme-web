import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { Login } from './features/auth/login/login/login';
import { Register } from './features/auth/register/register';
import { UserProductList } from './features/products/user-product-list/user-product-list';
import { AdminProductList } from './features/products/admin-product-list/admin-product-list';
import { ProductDetails } from './features/products/product-details/product-details';
import { Profile } from './features/profile/profile';
import { ProductForm } from './features/products/product-form/product-form';
import { CategoryList } from './features/categories/category-list/category-list';
import { CategoryAdd } from './features/categories/category-add/category-add';
import { CategoryEdit } from './features/categories/category-edit/category-edit';
import { Wishlist } from './features/wishlist/wishlist';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';
import { Orders } from './features/orders/orders';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },

    {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(m => m.Home)
    },

    {
        path: 'products',
        component: UserProductList
    },

    {
        path: 'admin/products/new',
        component: ProductForm,
        canActivate: [adminGuard]
    },

    {
        path: 'admin/products',
        component: AdminProductList,
        canActivate: [adminGuard]
    },

    {
        path: 'admin/categories',
        component: CategoryList,
        canActivate: [adminGuard]
    },

    {
        path: 'admin/categories/new',
        component: CategoryAdd,
        canActivate: [adminGuard]
    },

    {
        path: 'admin/categories/:id/edit',
        component: CategoryEdit,
        canActivate: [adminGuard]
    },

    {
        path: 'login',
        component: Login
    },

    {
        path: 'register',
        component: Register
    },

    {
        path: 'wishlist',
        component: Wishlist,
        canActivate: [authGuard]
    },

    {
        path: 'cart',
        component: Cart,
        canActivate: [authGuard]
    },

    {
        path: 'orders',
        component: Orders,
        canActivate: [authGuard]
    },

    {
        path: 'checkout',
        component: Checkout,
        canActivate: [authGuard]
    },
    {
        path: 'products/:id',
        component: ProductDetails
    },
    {
        path: 'admin/products/:id/edit',
        component: ProductForm,
        canActivate: [adminGuard]
    },
    {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'products'
    }

];