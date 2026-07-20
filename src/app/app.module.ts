/* ANGULAR */
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* TERCEIROS */
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

/* STORE */
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/reducer';
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
import { AutenticacaoInterceptor } from './interceptors/autenticacao.interceptor';
import { LoginComponent } from '@modules/login/login.component';

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



//import {MainMenuComponent} from './pages/main-menu/main-menu.component';
//import { interval, take } from 'rxjs';
//import {RegisterComponent} from '@modules/register/register.component';
//import {DashboardComponent} from '@pages/dashboard/dashboard.component';



//import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
//import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';

//import { CabecalhoPaginaComponent } from './components/cabecalho-pagina/cabecalho-pagina.component';
//import { InformacaoComponent } from './components/dashboard/informacao/informacao.component';
//import { SucessoComponent } from './components/dashboard/sucesso/sucesso.component';
//import { AvisoComponent } from './components/dashboard/aviso/aviso.component';
//import { PerigoComponent } from './components/dashboard/perigo/perigo.component';
//import { ContainerComponent } from './components/site/container/container.component';
//import { HeaderSiteComponent } from './components/site/header-site/header-site.component';
//import { FooterSiteComponent } from './components/site/footer-site/footer-site.component';
//import { HomeSiteComponent } from './pages/site/home-site/home-site.component';
//import { CardComponent } from './components/site/card/card.component';
//import { CardBuscaComponent } from './components/site/card-busca/card-busca.component';
//import { CardDepoimentoComponent } from './components/site/card-depoimento/card-depoimento.component';
//import { FormBuscaComponent } from './components/site/form-busca/form-busca.component';
//import { ModalComponent } from './components/site/modal/modal.component';
//import { BotaoControleComponent } from './components/site/botao-controle/botao-controle.component';
//import { DepoimentoSiteComponent } from './pages/site/depoimento-site/depoimento-site.component';
//import { ConteudoSiteComponent } from './pages/site/conteudo-site/conteudo-site.component';
//import { SeletorPassageiroComponent } from './components/site/seletor-passageiro/seletor-passageiro/seletor-passageiro.component';
//import { PerfilComponent } from './pages/site/perfil/perfil.component';
//import { CadastroComponent } from './pages/site/cadastro/cadastro.component';
//import { FormBasePerfilComponent } from './components/site/form-base-perfil/form-base-perfil.component';
//import { FornecedorComponent } from './pages/estoque/fornecedor/fornecedor.component';
//import { ProdutoComponent } from './pages/estoque/produto/produto.component';
//import { CompraComponent } from './pages/estoque/compra/compra.component';
//import { CompraItemComponent } from './pages/estoque/compra/compra-item/compra-item.component';
//import { MovimentacaoComponent } from './pages/estoque/movimentacao/movimentacao.component';
//import { GridComponent } from './components/grid/grid.component';
//import { DropdownComponent } from './components/dropdown/dropdown.component';
//import { BarchartComponent } from './components/barchart/barchart.component';
//import { PiechartComponent } from './components/piechart/piechart.component';
//import { ContasPagarComponent } from './pages/financeiro/contas-pagar/contas-pagar.component';
//import { CategoriaContaComponent } from './pages/financeiro/contas-pagar/categoria-conta/categoria-conta.component';
//import { SubCategoriaContaComponent } from './pages/financeiro/contas-pagar/categoria-conta/sub-categoria-conta/sub-categoria-conta.component';
//import { StatusPagamentoComponent } from './pages/financeiro/contas-pagar/status-pagamento/status-pagamento.component';
//import { FormaPagamentoComponent } from './pages/financeiro/contas-pagar/forma-pagamento/forma-pagamento.component';

registerLocaleData(localePt);

@NgModule({
    declarations: [

        /* APP */
        AppComponent,

        /* LAYOUT ADMINLTE */
        MainComponent,
        HeaderComponent,
        UserComponent,
        FooterComponent,
        MenuSidebarComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,

        /* SECURITY */
        LoginComponent,

        /* COMPONENTE SITE */
        BannerComponent,

        /* PAGES ESTOQUE */

        /* PAGES FINANCEIRO */

        /* COMPONENTE OUTROS */

        //MainMenuComponent,
        //RegisterComponent,
        //DashboardComponent,
        
        
        
        //ForgotPasswordComponent,
        //RecoverPasswordComponent,
        
        //GridComponent,
        //CabecalhoPaginaComponent,
        //InformacaoComponent,
        //SucessoComponent,
        //AvisoComponent,
        //PerigoComponent,
        //FornecedorComponent,
        //ProdutoComponent,
        //CompraComponent,
        //CompraItemComponent,
        //MovimentacaoComponent,
        //DropdownComponent,
        //ContainerComponent,
        //CadastroComponent,
        //FormBasePerfilComponent,
        //HeaderSiteComponent,
        //FooterSiteComponent,
        //HomeSiteComponent,
        //CardComponent,
        //CardBuscaComponent,
        //CardDepoimentoComponent,
        //FormBuscaComponent,
        //ModalComponent,
        //BotaoControleComponent,
        //DepoimentoSiteComponent,
        //ConteudoSiteComponent,
        //SeletorPassageiroComponent,
        //PerfilComponent,
        //BarchartComponent,
        //PiechartComponent,
        //ContasPagarComponent,
        //CategoriaContaComponent,
        //SubCategoriaContaComponent,
        //StatusPagamentoComponent,
        //FormaPagamentoComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        /* ANGULAR */
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CurrencyPipe,

        /* TERCEIROS */
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        NgxMaskDirective,
        NgxMaskPipe,
        NgChartsModule,

        /* STORE */
        StoreModule.forRoot({ auth: authReducer, ui: uiReducer }),

        /* ANGULAR MATERIAL */
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

        /* SECURITY */

        /* APP */

        /* LAYOUT ADMINLTE */

        /* COMPONENTE BASE */
        BaseModule,

        /* COMPONENTE SHARED */
        SharedModule,

        /* COMPONENTE SITE */

        /* PAGES SITE */

        /* PAGES ESTOQUE */

        /* PAGES FINANCEIRO */

        /* COMPONENTE OUTROS */
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: AutenticacaoInterceptor,
        },
        provideNgxMask(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule { }
