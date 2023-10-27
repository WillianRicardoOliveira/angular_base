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

import { ListarFornecedorComponent } from '@pages/estoque/cadastro/fornecedor/listar-fornecedor/listar-fornecedor.component';
import { CriarFornecedorComponent } from '@pages/estoque/cadastro/fornecedor/criar-fornecedor/criar-fornecedor.component';
import { EditarFornecedorComponent } from '@pages/estoque/cadastro/fornecedor/editar-fornecedor/editar-fornecedor.component';
import { EditarProdutoComponent } from '@pages/estoque/cadastro/produto/editar-produto/editar-produto.component';
import { CriarProdutoComponent } from '@pages/estoque/cadastro/produto/criar-produto/criar-produto.component';
import { ListarProdutoComponent } from '@pages/estoque/cadastro/produto/listar-produto/listar-produto.component';
import { EditarMovimentacaoComponent } from '@pages/estoque/movimentacao/editar-movimentacao/editar-movimentacao.component';
import { CriarMovimentacaoComponent } from '@pages/estoque/movimentacao/criar-movimentacao/criar-movimentacao.component';
import { ListarMovimentacaoComponent } from '@pages/estoque/movimentacao/listar-movimentacao/listar-movimentacao.component';
import { DashboardEstoqueComponent } from '@pages/estoque/dashboard-estoque/dashboard-estoque.component';

import { HomeSiteComponent } from '@pages/site/home-site/home-site.component';

import { PerfilComponent } from '@pages/site/perfil/perfil.component';
import { AuthGuard } from '@guards/auth.guard';


/* Site */
import {LoginComponent} from '@pages/site/login/login.component';
import { CadastroComponent } from '@pages/site/cadastro/cadastro.component';

const routes: Routes = [
    {
        path: '',
        //component: MainComponent,
        component: HomeSiteComponent,
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
          


            /* MODULO ESTOQUE */
            { path: 'dashboard-estoque', component: DashboardEstoqueComponent },

            { path: 'listar-fornecedor', component: ListarFornecedorComponent },
            { path: 'criar-fornecedor', component: CriarFornecedorComponent },
            { path: 'editar-fornecedor/:id', component: EditarFornecedorComponent },

            { path: 'listar-produto', component: ListarProdutoComponent },
            { path: 'criar-produto', component: CriarProdutoComponent },
            { path: 'editar-produto/:id', component: EditarProdutoComponent },
            
            { path: 'listar-movimentacao', component: ListarMovimentacaoComponent },
            { path: 'criar-movimentacao', component: CriarMovimentacaoComponent },
            { path: 'editar-movimentacao/:id', component: EditarMovimentacaoComponent },




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
