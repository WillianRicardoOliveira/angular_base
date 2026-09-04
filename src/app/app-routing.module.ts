import {
    NgModule
} from '@angular/core';

import {
    RouterModule,
    Routes
} from '@angular/router';

import {
    AutenticacaoGuard
} from '@/core/autenticacao/guards/autenticacao.guard';

import {
    NaoAutenticadoGuard
} from '@/core/autenticacao/guards/nao-autenticado.guard';

import {
    PermissaoGuard
} from '@/core/autorizacao/guards/permissao.guard';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    ConfiguracaoInicialGuard
} from '@/domain/configuracao/configuracao-inicial/guards/configuracao-inicial.guard';

import {
    ConfiguracaoInicialPendenteGuard
} from '@/domain/configuracao/configuracao-inicial/guards/configuracao-inicial-pendente.guard';

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
    UsuarioEmpresaComponent
} from '@/domain/acesso/usuario-empresa/usuario-empresa.component';

import {
    UsuarioPerfilComponent
} from '@/domain/acesso/usuario-perfil/usuario-perfil.component';

import {
    UsuarioSubsidiariaComponent
} from '@/domain/acesso/usuario-subsidiaria/usuario-subsidiaria.component';

import {
    ConfiguracaoInicialComponent
} from '@/domain/configuracao/configuracao-inicial/configuracao-inicial.component';

import {
    EmpresaComponent
} from '@/domain/configuracao/empresa/empresa.component';

import {
    SubsidiariaComponent
} from '@/domain/configuracao/subsidiaria/subsidiaria.component';

import {
    AceiteConviteOrganizacaoComponent
} from '@/domain/plataforma/organizacao/convite/aceite/aceite-convite-organizacao.component';

import {
    ConviteOrganizacaoComponent
} from '@/domain/plataforma/organizacao/convite/convite-organizacao.component';

import {
    OrganizacaoPlataformaComponent
} from '@/domain/plataforma/organizacao/organizacao-plataforma.component';

import {
    LoginComponent
} from '@modules/login/login.component';

import {
    MainComponent
} from '@modules/main/main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [
            AutenticacaoGuard
        ],
        canActivateChild: [
            AutenticacaoGuard
        ],
        children: [
            {
                path: '',
                pathMatch: 'full',
                canActivate: [
                    ConfiguracaoInicialGuard
                ],
                children: []
            },
            {
                path: 'configuracao-inicial',
                component:
                    ConfiguracaoInicialComponent,
                canActivate: [
                    ConfiguracaoInicialPendenteGuard
                ]
            },
            {
                path:
                    'plataforma/organizacoes',
                component:
                    OrganizacaoPlataformaComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .PlataformaOrganizacaoListar
                }
            },
            {
                path:
                    'plataforma/organizacoes/convites',
                component:
                    ConviteOrganizacaoComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .PlataformaOrganizacaoListar
                }
            },
            {
                path: 'acesso/perfis',
                component: PerfilComponent,
                canActivate: [
                    ConfiguracaoInicialGuard,
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .PerfilListar
                }
            },
            {
                path:
                    'acesso/perfis/:idPerfil/permissoes',
                component:
                    PerfilPermissaoComponent,
                canActivate: [
                    ConfiguracaoInicialGuard,
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
                component:
                    PermissaoComponent,
                canActivate: [
                    ConfiguracaoInicialGuard,
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .PermissaoListar
                }
            },
            {
                path: 'acesso/usuarios',
                component:
                    UsuarioComponent,
                canActivate: [
                    ConfiguracaoInicialGuard,
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .UsuarioListar
                }
            },
            {
                path:
                    'acesso/usuarios/:idUsuario/perfis',
                component:
                    UsuarioPerfilComponent,
                canActivate: [
                    ConfiguracaoInicialGuard,
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
                    ConfiguracaoInicialGuard,
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .UsuarioEmpresaListar
                }
            },
            {
                path:
                    'acesso/usuarios/:idUsuario/empresas/:idUsuarioEmpresa/subsidiarias',
                component:
                    UsuarioSubsidiariaComponent,
                canActivate: [
                    ConfiguracaoInicialGuard,
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .UsuarioSubsidiariaListar
                }
            },
            {
                path: 'configuracao/empresas',
                component:
                    EmpresaComponent,
                canActivate: [
                    PermissaoGuard
                ],
                data: {
                    permissoes: [
                        ChavePermissao
                            .EmpresaCriar,
                        ChavePermissao
                            .EmpresaListar
                    ]
                }
            },
            {
                path:
                    'configuracao/subsidiarias',
                component:
                    SubsidiariaComponent,
                canActivate: [
                    ConfiguracaoInicialGuard,
                    PermissaoGuard
                ],
                data: {
                    permissao:
                        ChavePermissao
                            .SubsidiariaListar
                }
            }
        ]
    },
    {
        path: 'login',
        component:
            LoginComponent,
        canActivate: [
            NaoAutenticadoGuard
        ]
    },
    {
        path:
            'convites/organizacao/aceitar',
        component:
            AceiteConviteOrganizacaoComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            {}
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}