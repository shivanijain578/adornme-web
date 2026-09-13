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
import { Wishlist } from './features/wishlist/wishlist';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';
import { Orders } from './features/orders/orders';
import { CategoryForm } from './features/categories/category-form/category-form';

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
        path: 'about',
        loadComponent: () => import('./features/about/about').then(m => m.About)
    },

    {
        path: 'support',
        loadComponent: () => import('./features/support/support').then(m => m.Support)
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
        path: 'admin/dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [adminGuard]
    },

    {
        path: 'admin/products',
        component: AdminProductList,
        canActivate: [adminGuard]
    },

    {
        path: 'admin/offers',
        loadComponent: () => import('./features/admin/offers/offers').then(m => m.Offers),
        canActivate: [adminGuard]
    },

    {
        path: 'admin/banners',
        loadComponent: () => import('./features/admin/banners/banners').then(m => m.Banners),
        canActivate: [adminGuard]
    },

    {
        path: 'admin/inventory',
        loadComponent: () => import('./features/admin/inventory/inventory').then(m => m.Inventory),
        canActivate: [adminGuard]
    },

    {
        path: 'admin/orders',
        loadComponent: () => import('./features/admin/orders/orders').then(m => m.AdminOrders),
        canActivate: [adminGuard]
    },

    {
        path: 'admin/orders/:id',
        loadComponent: () => import('./features/admin/orders-details/order-detail').then(m => m.AdminOrderDetail),
        canActivate: [adminGuard]
    },

    {
        path: 'admin/categories',
        component: CategoryList,
        canActivate: [adminGuard]
    },

    {
        path: 'admin/categories/new',
        component: CategoryForm,
        canActivate: [adminGuard]
    },

    {
        path: 'admin/categories/:id/edit',
        component: CategoryForm,
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
        path: 'orders/:id/invoice',
        loadComponent: () => import('./features/invoice/invoice').then(m => m.InvoicePage),
        canActivate: [authGuard]
    },

    {
        path: 'orders/:id',
        loadComponent: () => import('./features/order-detail/order-detail').then(m => m.OrderDetail),
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