import {BrowserModule} from '@angular/platform-browser';
import {NgModule, LOCALE_ID } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';

import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ToastrModule} from 'ngx-toastr';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';

import {CommonModule, registerLocaleData} from '@angular/common';

import localePt from '@angular/common/locales/pt';

import {UserComponent} from '@modules/main/header/user/user.component';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {MainMenuComponent} from './pages/main-menu/main-menu.component';

import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {ControlSidebarComponent} from './modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {ProfabricComponentsModule} from '@profabric/angular-components';
import {SidebarSearchComponent} from './components/sidebar-search/sidebar-search.component';




import { CabecalhoPaginaComponent } from './components/cabecalho-pagina/cabecalho-pagina.component';
import { InformacaoComponent } from './components/dashboard/informacao/informacao.component';
import { SucessoComponent } from './components/dashboard/sucesso/sucesso.component';
import { AvisoComponent } from './components/dashboard/aviso/aviso.component';
import { PerigoComponent } from './components/dashboard/perigo/perigo.component';
import { CurrencyPipe } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';

/* MODULO DE ETOQUE */

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'

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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select'


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

import { DepoimentoSiteComponent } from './pages/site/depoimento-site/depoimento-site.component';
import { ConteudoSiteComponent } from './pages/site/conteudo-site/conteudo-site.component';
import { SeletorPassageiroComponent } from './components/site/seletor-passageiro/seletor-passageiro/seletor-passageiro.component';


import { PerfilComponent } from './pages/site/perfil/perfil.component';
import { AutenticacaoInterceptor } from './interceptors/autenticacao.interceptor';

/* Site */
import { LoginComponent } from './pages/site/login/login.component';
import { CadastroComponent } from './pages/site/cadastro/cadastro.component';
import { FormBasePerfilComponent } from './components/site/form-base-perfil/form-base-perfil.component';
import { interval, take } from 'rxjs';



/* ESTOQUE */
import { FornecedorComponent } from './pages/estoque/fornecedor/fornecedor.component';
import { ProdutoComponent } from './pages/estoque/produto/produto.component';
import { CompraComponent } from './pages/estoque/compra/compra.component';
import { CompraItemComponent } from './pages/estoque/compra/compra-item/compra-item.component';
import { MovimentacaoComponent } from './pages/estoque/movimentacao/movimentacao.component';

/* COMPONENTE */
import { GridComponent } from './components/grid/grid.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { SelectComponent } from './components/select/select.component';
import { BarchartComponent } from './components/barchart/barchart.component';
import { PiechartComponent } from './components/piechart/piechart.component';
import { ContasPagarComponent } from './pages/financeiro/contas-pagar/contas-pagar.component';
import { CategoriaContaComponent } from './pages/financeiro/contas-pagar/categoria-conta/categoria-conta.component';
import { SubCategoriaContaComponent } from './pages/financeiro/contas-pagar/categoria-conta/sub-categoria-conta/sub-categoria-conta.component';

registerLocaleData(localePt);

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        RegisterComponent,
        DashboardComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        ForgotPasswordComponent,
        RecoverPasswordComponent,
        LanguageComponent,
        MainMenuComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,


        GridComponent,

        
        CabecalhoPaginaComponent,
        InformacaoComponent,
        SucessoComponent,
        AvisoComponent,
        PerigoComponent,

       
        /* ESTOQUE */
        FornecedorComponent,
        ProdutoComponent,
        CompraComponent,
        CompraItemComponent,
        MovimentacaoComponent,

        /* COMPONENTE */
        DropdownComponent,
        SelectComponent,



        
        
        
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
       
     
        DepoimentoSiteComponent,
        ConteudoSiteComponent,
        SeletorPassageiroComponent,
        
        
        PerfilComponent,
        FormBasePerfilComponent,
        BarchartComponent,
        PiechartComponent,
        ContasPagarComponent,
        CategoriaContaComponent,
        SubCategoriaContaComponent,
        
        
       
        


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
        NgxMaskDirective, /* https://github.com/JsDaddy/ngx-mask */
        NgxMaskPipe,
        //.forRoot(
        //{
        //    dropSpecialCharacters: true
        //}
        //),



        // WillianOliveira
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
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
        MatCheckboxModule, 
        MatTooltipModule,
        MatPaginatorModule,
        MatSelectModule,

        
        CurrencyPipe,

        /* Graficos
        https://github.com/valor-software/ng2-charts
        https://www.npmjs.com/package/ng2-charts/v/4.1.1
        https://valor-software.com/ng2-charts
        https://www.chartjs.org/docs/4.4.1
        */        
        NgChartsModule
        

    ],
    providers: [ { provide: LOCALE_ID, useValue: 'pt-BR' },
        {
        provide: HTTP_INTERCEPTORS,
        multi: true,
        //useClass: () => {AutenticacaoInterceptor}

        useClass: AutenticacaoInterceptor,
        
    },
    provideNgxMask()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
