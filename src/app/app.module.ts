/* ANGULAR */
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';
import {
    inject,
    LOCALE_ID,
    NgModule,
    provideAppInitializer
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* TERCEIROS */
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import {
    MSAL_INSTANCE,
    MsalService
} from '@azure/msal-angular';

/* STORE */
import { StoreModule } from '@ngrx/store';
import { uiReducer } from './store/ui/reducer';

/* ANGULAR MATERIAL */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

/* SECURITY */
import { AutenticacaoInterceptor } from './core/autenticacao/interceptors/autenticacao.interceptor';
import { LoginComponent } from '@modules/login/login.component';
import {
    criarInstanciaMsal
} from '@/core/autenticacao/configuracoes/msal.config';

/* DOMAIN ACESSO */
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
    UsuarioEmpresaComponent
} from '@/domain/acesso/usuario-empresa/usuario-empresa.component';

import {
    UsuarioEstabelecimentoComponent
} from '@/domain/acesso/usuario-estabelecimento/usuario-estabelecimento.component';

import {
    ConfiguracaoInicialComponent
} from '@/domain/configuracao/configuracao-inicial/configuracao-inicial.component';

/* APP */
import { AppRoutingModule } from '@/app-routing.module';
import { AppComponent } from './app.component';

/* LAYOUT ADMINLTE */
import { MainComponent } from '@modules/main/main.component';
import { HeaderComponent } from '@modules/main/header/header.component';
import {UserComponent} from '@modules/main/header/user/user.component';
import { FooterComponent } from '@modules/main/footer/footer.component';
import { MenuSidebarComponent } from '@modules/main/menu-sidebar/menu-sidebar.component';
import { ControlSidebarComponent } from './modules/main/control-sidebar/control-sidebar.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';

/* COMPONENTE BASE */
import { BaseModule } from './components/base/base.module';

/* COMPONENTE SHARED */
import { SharedModule } from './components/shared/shared.module';

/* COMPONENTE SITE */
import { BannerComponent } from './components/site/banner/banner.component';

/* PAGES ESTOQUE */

/* PAGES FINANCEIRO */

/* COMPONENTE OUTROS */

import {
    EmpresaComponent
} from '@/domain/configuracao/empresa/empresa.component';

import {
    EstabelecimentoComponent
} from '@/domain/configuracao/estabelecimento/estabelecimento.component';

import {
    SeletorOrganizacaoComponent
} from '@modules/main/header/seletor-organizacao/seletor-organizacao.component';

import {
    OrganizacaoPlataformaComponent
} from '@/domain/plataforma/organizacao/organizacao-plataforma.component';

import {
    ConviteOrganizacaoComponent
} from '@/domain/plataforma/organizacao/convite/convite-organizacao.component';

import {
    AceiteConviteOrganizacaoComponent
} from '@/domain/plataforma/organizacao/convite/aceite/aceite-convite-organizacao.component';

import { CabecalhoPaginaComponent } from './components/cabecalho-pagina/cabecalho-pagina.component';

import {
    GridComponent
} from './components/grid/grid.component';

registerLocaleData(localePt);

@NgModule({
    declarations: [
        AppComponent,

        MainComponent,
        HeaderComponent,
        SeletorOrganizacaoComponent,
        UserComponent,
        FooterComponent,
        MenuSidebarComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,

        LoginComponent,

        PerfilComponent,
        PerfilPermissaoComponent,
        PermissaoComponent,
        UsuarioComponent,
        UsuarioPerfilComponent,
        UsuarioEmpresaComponent,
        UsuarioEstabelecimentoComponent,
        OrganizacaoPlataformaComponent,
        ConviteOrganizacaoComponent,
        AceiteConviteOrganizacaoComponent,

        BannerComponent,

        CabecalhoPaginaComponent,
        GridComponent,

        ConfiguracaoInicialComponent,
        EmpresaComponent,
        EstabelecimentoComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CurrencyPipe,

        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        NgxMaskDirective,
        NgxMaskPipe,
        NgChartsModule,

        StoreModule.forRoot({
            ui: uiReducer
        }),

        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatButtonToggleModule,
        MatIconModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatDividerModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSelectModule,

        BaseModule,
        SharedModule
    ],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'pt-BR'
        },
        {
            provide: MSAL_INSTANCE,
            useFactory: criarInstanciaMsal
        },
        provideAppInitializer(() => {
            const instanciaMsal = inject(MSAL_INSTANCE);

            return instanciaMsal.initialize();
        }),
        MsalService,
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: AutenticacaoInterceptor
        },
        provideNgxMask(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule { }