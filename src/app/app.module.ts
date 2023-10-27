import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';

import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ProfileComponent} from '@pages/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ToastrModule} from 'ngx-toastr';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';

import {CommonModule, registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserComponent} from '@modules/main/header/user/user.component';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {MainMenuComponent} from './pages/main-menu/main-menu.component';
import {SubMenuComponent} from './pages/main-menu/sub-menu/sub-menu.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {ControlSidebarComponent} from './modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {ProfabricComponentsModule} from '@profabric/angular-components';
import {SidebarSearchComponent} from './components/sidebar-search/sidebar-search.component';

import { GridComponent } from './components/grid/grid.component';

import { FormularioValidacaoComponent } from './components/formulario-validacao/formulario-validacao.component';
import { EditarComponent } from './components/editar/editar.component';
import { CabecalhoPaginaComponent } from './components/cabecalho-pagina/cabecalho-pagina.component';
import { InformacaoComponent } from './components/dashboard/informacao/informacao.component';
import { SucessoComponent } from './components/dashboard/sucesso/sucesso.component';
import { AvisoComponent } from './components/dashboard/aviso/aviso.component';
import { PerigoComponent } from './components/dashboard/perigo/perigo.component';



/* MODULO DE ETOQUE */
import { CriarProdutoComponent } from './pages/estoque/cadastro/produto/criar-produto/criar-produto.component';
import { EditarProdutoComponent } from './pages/estoque/cadastro/produto/editar-produto/editar-produto.component';
import { ListarProdutoComponent } from './pages/estoque/cadastro/produto/listar-produto/listar-produto.component';
import { CriarFornecedorComponent } from './pages/estoque/cadastro/fornecedor/criar-fornecedor/criar-fornecedor.component';
import { EditarFornecedorComponent } from './pages/estoque/cadastro/fornecedor/editar-fornecedor/editar-fornecedor.component';
import { ListarFornecedorComponent } from './pages/estoque/cadastro/fornecedor/listar-fornecedor/listar-fornecedor.component';
import { CriarMovimentacaoComponent } from './pages/estoque/movimentacao/criar-movimentacao/criar-movimentacao.component';
import { EditarMovimentacaoComponent } from './pages/estoque/movimentacao/editar-movimentacao/editar-movimentacao.component';
import { ListarMovimentacaoComponent } from './pages/estoque/movimentacao/listar-movimentacao/listar-movimentacao.component';
import { DashboardEstoqueComponent } from './pages/estoque/dashboard-estoque/dashboard-estoque.component';
import { InputTextComponent } from './components/formulario/input-text/input-text.component';


/* Angular Material */
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
import { MatRadioModule  } from '@angular/material/radio' 
import { MatDividerModule } from '@angular/material/divider'
import { MatCheckboxModule } from '@angular/material/checkbox'



import { ContainerComponent } from './components/site/container/container.component';

import { BannerComponent } from './components/site/banner/banner.component';
import { HeaderSiteComponent } from './components/site/header-site/header-site.component';
import { FooterSiteComponent } from './components/site/footer-site/footer-site.component';
import { HomeSiteComponent } from './pages/site/home-site/home-site.component';
import { CardComponent } from './components/site/card/card.component';
import { CardBuscaComponent } from './components/site/card-busca/card-busca.component';
import { CardDepoimentoComponent } from './components/site/card-depoimento/card-depoimento.component';
import { FormBuscaComponent } from './components/site/form-busca/form-busca.component';
import { ModalComponent } from './components/site/modal/modal.component';
import { BotaoControleComponent } from './components/site/botao-controle/botao-controle.component';

import { DropdownUfComponent } from './components/dropdown-uf/dropdown-uf.component';
import { DepoimentoSiteComponent } from './pages/site/depoimento-site/depoimento-site.component';
import { ConteudoSiteComponent } from './pages/site/conteudo-site/conteudo-site.component';
import { SeletorPassageiroComponent } from './components/site/seletor-passageiro/seletor-passageiro/seletor-passageiro.component';


import { PerfilComponent } from './pages/site/perfil/perfil.component';
import { AutenticacaoInterceptor } from './interceptors/autenticacao.interceptor';

/* Site */
import { LoginComponent } from './pages/site/login/login.component';
import { CadastroComponent } from './pages/site/cadastro/cadastro.component';
import { FormBasePerfilComponent } from './components/site/form-base-perfil/form-base-perfil.component';


registerLocaleData(localeEn, 'en-EN');

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        BlankComponent,
        ProfileComponent,
        RegisterComponent,
        DashboardComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        ForgotPasswordComponent,
        RecoverPasswordComponent,
        LanguageComponent,
        MainMenuComponent,
        SubMenuComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,


        GridComponent,

        FormularioValidacaoComponent,
        EditarComponent,
        CabecalhoPaginaComponent,
        InformacaoComponent,
        SucessoComponent,
        AvisoComponent,
        PerigoComponent,

       
        /* MODULO DE ETOQUE */
        CriarProdutoComponent,
        EditarProdutoComponent,
        ListarProdutoComponent,
        CriarFornecedorComponent,
        EditarFornecedorComponent,
        ListarFornecedorComponent,
        CriarMovimentacaoComponent,
        EditarMovimentacaoComponent,
        ListarMovimentacaoComponent,
        DashboardEstoqueComponent,
        
        InputTextComponent,
                  BannerComponent,
                  ContainerComponent,
                  
        /* Site */
        LoginComponent,
        CadastroComponent,
        FormBasePerfilComponent,



        HeaderSiteComponent,
        FooterSiteComponent,
        HomeSiteComponent,
        CardComponent,
        CardBuscaComponent,
        CardDepoimentoComponent,
        FormBuscaComponent,
        ModalComponent,
        BotaoControleComponent,
       
        DropdownUfComponent,
        DepoimentoSiteComponent,
        ConteudoSiteComponent,
        SeletorPassageiroComponent,
        
        
        PerfilComponent,
        FormBasePerfilComponent,
        
                 


    ],
    imports: [
        ProfabricComponentsModule,
        CommonModule,
        BrowserModule,
        StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),



        // WillianOliveira
        HttpClientModule,
        ReactiveFormsModule,
       // MatFormFieldModule,
       // MatInputModule

        /* Angular Material */
        MatToolbarModule, /* https://material.angular.io/components/toolbar/overview */
        MatButtonModule, /* https://material.angular.io/components/button/overview */
        MatCardModule,
        MatButtonToggleModule,
        MatIconModule, /* https://fonts.google.com/icons?hl=pt-br */
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatDividerModule,
        MatCheckboxModule 

    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AutenticacaoInterceptor,
        multi: true
    }],
    bootstrap: [AppComponent]
})
export class AppModule {}
