import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/customer-list/customer-list.component').then(
                (m) => m.CustomerListComponent
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./components/customer-form/customer-form.component').then(
                (m) => m.CustomerFormComponent
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./components/customer-form/customer-form.component').then(
                (m) => m.CustomerFormComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './components/customer-detail/customer-detail.component'
              ).then((m) => m.CustomerDetailComponent),
          },
        ],
      },
      {
        path: 'opportunities',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './components/opportunities/opportunity-list/opportunity-list.component'
              ).then((m) => m.OpportunityListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './components/opportunities/opportunity-form/opportunity-form.component'
              ).then((m) => m.OpportunityFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import(
                './components/opportunities/opportunity-form/opportunity-form.component'
              ).then((m) => m.OpportunityFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './components/opportunities/opportunity-detail/opportunity-detail.component'
              ).then((m) => m.OpportunityDetailComponent),
          },
        ],
      },
      {
        path: 'proposals',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './components/proposals/proposal-list/proposal-list.component'
              ).then((m) => m.ProposalListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './components/proposals/proposal-form/proposal-form.component'
              ).then((m) => m.ProposalFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import(
                './components/proposals/proposal-form/proposal-form.component'
              ).then((m) => m.ProposalFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './components/proposals/proposal-detail/proposal-detail.component'
              ).then((m) => m.ProposalDetailComponent),
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './components/orders/order-list/order-list.component'
              ).then((m) => m.OrderListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './components/orders/order-form/order-form.component'
              ).then((m) => m.OrderFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import(
                './components/orders/order-form/order-form.component'
              ).then((m) => m.OrderFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './components/orders/order-detail/order-detail.component'
              ).then((m) => m.OrderDetailComponent),
          },
        ],
      },
      {
        path: 'payments',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './components/payments/payment-list/payment-list.component'
              ).then((m) => m.PaymentListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './components/payments/payment-form/payment-form.component'
              ).then((m) => m.PaymentFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import(
                './components/payments/payment-form/payment-form.component'
              ).then((m) => m.PaymentFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './components/payments/payment-detail/payment-detail.component'
              ).then((m) => m.PaymentDetailComponent),
          },
        ],
      },
    ],
  },
];
