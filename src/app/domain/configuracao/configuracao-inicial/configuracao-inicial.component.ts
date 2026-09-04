import {
    Component,
    DestroyRef,
    inject,
    OnInit
} from '@angular/core';

import {
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
    ItemBreadcrumbPagina
} from '@/components/cabecalho-pagina/cabecalho-pagina.component';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    EstadoConfiguracaoInicial,
    ProximaEtapaConfiguracao
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

@Component({
    selector: 'app-configuracao-inicial',
    templateUrl:
        './configuracao-inicial.component.html',
    styleUrls: [
        './configuracao-inicial.component.scss'
    ],
    standalone: false
})
export class ConfiguracaoInicialComponent
    implements OnInit {

    private readonly service =
        inject(
            ConfiguracaoInicialService
        );

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    private readonly destroyRef =
        inject(
            DestroyRef
        );

    readonly pagina =
        'Configuração inicial';

    readonly descricao =
        'Prepare sua organização para começar a utilizar o ERP';

    readonly breadcrumb:
        ItemBreadcrumbPagina[] = [];

    estado:
        EstadoConfiguracaoInicial | null =
            null;

    carregando = true;

    erroCarregamento = false;

    get deveCadastrarEmpresa(): boolean {
        return (
            !this.carregando &&
            !this.erroCarregamento &&
            !this.estado?.empresaCadastrada &&
            this.estado?.proximaEtapa ===
                ProximaEtapaConfiguracao
                    .Empresa
        );
    }

    get empresaCadastrada(): boolean {
        return (
            !this.carregando &&
            !this.erroCarregamento &&
            this.estado?.empresaCadastrada ===
                true
        );
    }

    get podeCriarEmpresa(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .EmpresaCriar
            );
    }

    get podeListarEmpresa(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .EmpresaListar
            );
    }

    ngOnInit(): void {
        this.carregarEstado();
    }

    carregarEstado(
        forcarAtualizacao = false
    ): void {
        this.carregando = true;
        this.erroCarregamento = false;

        const consulta =
            forcarAtualizacao
                ? this.service.recarregar()
                : this.service.consultar();

        consulta
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: (estado) => {
                    this.estado = estado;
                    this.carregando = false;
                },
                error: () => {
                    this.estado = null;
                    this.carregando = false;
                    this.erroCarregamento = true;
                }
            });
    }
}