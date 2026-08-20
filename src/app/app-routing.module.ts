/* ANGULAR */

/* TERCEIROS */

/* STORE */

/* ANGULAR MATERIAL */

/* SECURITY */

/* APP */

/* LAYOUT ADMINLTE */

/* COMPONENTE BASE */

/* COMPONENTE SHARED */

/* COMPONENTE SITE */

/* PAGES SITE */

/* PAGES ESTOQUE */

/* PAGES FINANCEIRO */

/* COMPONENTE OUTROS */



import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';

import {NaoAutenticadoGuard} from '@/core/autenticacao/guards/nao-autenticado.guard';

import { AutenticacaoGuard } from '@/core/autenticacao/guards/autenticacao.guard';

import { LoginComponent } from '@modules/login/login.component';


import {
    PerfilComponent
} from '@/domain/acesso/perfil/perfil.component';

import {
    PerfilPermissaoComponent
} from '@/domain/acesso/perfil-permissao/perfil-permissao.component';

import {
    PermissaoComponent
} from '@/domain/acesso/permissao/permissao.component';

import {
    UsuarioComponent
} from '@/domain/acesso/usuario/usuario.component';

import {
    UsuarioPerfilComponent
} from '@/domain/acesso/usuario-perfil/usuario-perfil.component';

import {
    PermissaoGuard
} from '@/core/autorizacao/guards/permissao.guard';
import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    EmpresaComponent
} from '@/domain/configuracao/empresa/empresa.component';

import {
    SubsidiariaComponent
} from '@/domain/configuracao/subsidiaria/subsidiaria.component';

import {
    UsuarioEmpresaComponent
} from '@/domain/acesso/usuario-empresa/usuario-empresa.component';

//import {RegisterComponent} from '@modules/register/register.component';
//import {DashboardComponent} from '@pages/dashboard/dashboard.component';
//import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
//import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
//import {MainMenuComponent} from '@pages/main-menu/main-menu.component';
//import { HomeSiteComponent } from '@pages/site/home-site/home-site.component';
//import { PerfilComponent } from '@pages/site/perfil/perfil.component';
//import { CadastroComponent } from '@pages/site/cadastro/cadastro.component';
//import { FornecedorComponent } from '@pages/estoque/fornecedor/fornecedor.component';
//import { ProdutoComponent } from '@pages/estoque/produto/produto.component';
//import { CompraComponent } from '@pages/estoque/compra/compra.component';
//import { CompraItemComponent } from '@pages/estoque/compra/compra-item/compra-item.component';
//import { MovimentacaoComponent } from '@pages/estoque/movimentacao/movimentacao.component';
//import { CategoriaContaComponent } from '@pages/financeiro/contas-pagar/categoria-conta/categoria-conta.component';
//import { SubCategoriaContaComponent } from '@pages/financeiro/contas-pagar/categoria-conta/sub-categoria-conta/sub-categoria-conta.component';
//import { ContasPagarComponent } from '@pages/financeiro/contas-pagar/contas-pagar.component';
//import { FormaPagamentoComponent } from '@pages/financeiro/contas-pagar/forma-pagamento/forma-pagamento.component';
//import { StatusPagamentoComponent } from '@pages/financeiro/contas-pagar/status-pagamento/status-pagamento.component';

const routes: Routes = [
    {
        path: '',
        //redirectTo: "MainComponent",
        //pathMatch: "full"

        component: MainComponent,
        canActivate: [
            AutenticacaoGuard
        ],
        canActivateChild: [
            AutenticacaoGuard
        ],
        children: [
            {
                path: 'acesso/perfis',
                component: PerfilComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao.PerfilListar
                }
            },
            {
                path:
                    'acesso/perfis/:idPerfil/permissoes',
                component:
                    PerfilPermissaoComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .PerfilPermissaoListar
                }
            },
            {
                path: 'acesso/permissoes',
                component: PermissaoComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao.PermissaoListar
                }
            },
            {
                path: 'acesso/usuarios',
                component: UsuarioComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao.UsuarioListar
                }
            },
            {
                path:
                    'acesso/usuarios/:idUsuario/perfis',
                component:
                    UsuarioPerfilComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .UsuarioPerfilListar
                }
            },
            {
                path:
                    'acesso/usuarios/:idUsuario/empresas',
                component:
                    UsuarioEmpresaComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .UsuarioEmpresaListar
                }
            },
            {
                path: 'configuracao/empresas',
                component: EmpresaComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao.EmpresaListar
                }
            },
            {
                path: 'configuracao/subsidiarias',
                component: SubsidiariaComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .SubsidiariaListar
                }
            },

            //{ path: ''                  , component: DashboardComponent },
            /* ESTOQUE */
            //{ path: 'fornecedor'        , component: FornecedorComponent },
            //{ path: 'produto'           , component: ProdutoComponent },
            //{ path: 'compra'            , component: CompraComponent },
            //{ path: 'compra-item/:id'   , component: CompraItemComponent },
            //{ path: 'movimentacao'      , component: MovimentacaoComponent },
            //{ path: 'categoria-conta'           , component: CategoriaContaComponent },
            //{ path: 'sub-categoria-conta/:id'   , component: SubCategoriaContaComponent },
            //{ path: 'contas-pagar'              , component: ContasPagarComponent },
            //{ path: 'forma-pagamento'          , component: FormaPagamentoComponent },
            //{ path: 'status-pagamento'          , component: StatusPagamentoComponent },            
        ]
    },

    
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NaoAutenticadoGuard]
    },
    //{ path: "cadastro"  , component: CadastroComponent },
    //{ path: "perfil"    , component: PerfilComponent },
    //{ path: "site"      , component: HomeSiteComponent },

    //{ path: 'register'          , component: RegisterComponent          , canActivate: [NaoAutenticadoGuard] },
    //{ path: 'forgot-password'   , component: ForgotPasswordComponent    , canActivate: [NaoAutenticadoGuard] },
    //{ path: 'recover-password'  , component: RecoverPasswordComponent   , canActivate: [NaoAutenticadoGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
