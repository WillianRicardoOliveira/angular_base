import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {BlankComponent} from '@pages/blank/blank.component';

import {ProfileComponent} from '@pages/profile/profile.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';

import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {MainMenuComponent} from '@pages/main-menu/main-menu.component';
import {SubMenuComponent} from '@pages/main-menu/sub-menu/sub-menu.component';

import { DashboardEstoqueComponent } from '@pages/estoque/dashboard-estoque/dashboard-estoque.component';

import { HomeSiteComponent } from '@pages/site/home-site/home-site.component';

import { PerfilComponent } from '@pages/site/perfil/perfil.component';
import { AuthGuard } from '@guards/auth.guard';


/* Site */
import {LoginComponent} from '@pages/site/login/login.component';
import { CadastroComponent } from '@pages/site/cadastro/cadastro.component';

/* ESTOQUE */
import { FornecedorComponent } from '@pages/estoque/fornecedor/fornecedor.component';
import { ProdutoComponent } from '@pages/estoque/produto/produto.component';
import { CompraComponent } from '@pages/estoque/compra/compra.component';
import { CompraItemComponent } from '@pages/estoque/compra/compra-item/compra-item.component';
import { MovimentacaoComponent } from '@pages/estoque/movimentacao/movimentacao.component';


const routes: Routes = [
    {
        path: '',
        //redirectTo: "MainComponent",
        //pathMatch: "full"

        component: MainComponent,
        //component: HomeSiteComponent,
        //canActivate: [AuthGuard],
       // canActivateChild: [AuthGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'blank',
                component: BlankComponent
            },
            {
                path: 'sub-menu-1',
                component: SubMenuComponent
            },
          


            /* ESTOQUE */
            { path: 'fornecedor', component: FornecedorComponent },
            { path: 'produto', component: ProdutoComponent },
            { path: 'compra', component: CompraComponent },
            { path: 'compra-item/:id', component: CompraItemComponent },
            { path: 'movimentacao', component: MovimentacaoComponent },





            { path: 'dashboard-estoque', component: DashboardEstoqueComponent },


  



            {
                path: '',
                component: DashboardComponent
            }
        ]
    },


    /* Site */
    { path: "login", component: LoginComponent },
    { path: "cadastro", component: CadastroComponent },
    { path: "perfil", component: PerfilComponent, canActivate: [AuthGuard] },







/*
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },*/
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
