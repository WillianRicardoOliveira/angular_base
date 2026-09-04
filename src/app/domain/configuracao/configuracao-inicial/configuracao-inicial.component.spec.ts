import {
    NO_ERRORS_SCHEMA
} from '@angular/core';

import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    RouterTestingModule
} from '@angular/router/testing';

import {
    Observable,
    of,
    Subject,
    throwError
} from 'rxjs';

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

import {
    ConfiguracaoInicialComponent
} from './configuracao-inicial.component';

describe('ConfiguracaoInicialComponent', () => {

    let component:
        ConfiguracaoInicialComponent;

    let fixture:
        ComponentFixture<
            ConfiguracaoInicialComponent
        >;

    let service:
        jasmine.SpyObj<
            ConfiguracaoInicialService
        >;

    let autorizacaoService:
        jasmine.SpyObj<
            AutorizacaoService
        >;

    beforeEach(async () => {
        service =
            jasmine.createSpyObj<
                ConfiguracaoInicialService
            >(
                'ConfiguracaoInicialService',
                [
                    'consultar',
                    'recarregar'
                ]
            );

        autorizacaoService =
            jasmine.createSpyObj<
                AutorizacaoService
            >(
                'AutorizacaoService',
                [
                    'possuiPermissao'
                ]
            );

        autorizacaoService
            .possuiPermissao
            .and
            .returnValue(true);

        await TestBed
            .configureTestingModule({
                declarations: [
                    ConfiguracaoInicialComponent
                ],
                imports: [
                    RouterTestingModule
                ],
                providers: [
                    {
                        provide:
                            ConfiguracaoInicialService,
                        useValue:
                            service
                    },
                    {
                        provide:
                            AutorizacaoService,
                        useValue:
                            autorizacaoService
                    }
                ],
                schemas: [
                    NO_ERRORS_SCHEMA
                ]
            })
            .compileComponents();
    });

    it(
        'deve consultar o estado ao iniciar',
        () => {

            const resposta =
                new Subject<
                    EstadoConfiguracaoInicial
                >();

            criarComponente(
                resposta.asObservable()
            );

            expect(
                service.consultar
            ).toHaveBeenCalledTimes(1);

            expect(
                service.recarregar
            ).not.toHaveBeenCalled();

            expect(
                component.carregando
            ).toBeTrue();

            expect(
                textoRenderizado()
            ).toContain(
                'Carregando configuração'
            );
        }
    );

    it(
        'deve apresentar o cadastro da primeira empresa',
        () => {

            criarComponente(
                estadoEmpresaPendente()
            );

            expect(
                component.carregando
            ).toBeFalse();

            expect(
                component
                    .deveCadastrarEmpresa
            ).toBeTrue();

            expect(
                component
                    .empresaCadastrada
            ).toBeFalse();

            expect(
                textoRenderizado()
            ).toContain(
                'Cadastre sua primeira empresa'
            );

            expect(
                textoRenderizado()
            ).toContain(
                'Cadastrar empresa'
            );
        }
    );

    it(
        'deve permitir o cadastro quando possuir EmpresaCriar',
        () => {

            autorizacaoService
                .possuiPermissao
                .and
                .callFake(
                    (permissao) =>
                        permissao ===
                        ChavePermissao
                            .EmpresaCriar
                );

            criarComponente(
                estadoEmpresaPendente()
            );

            expect(
                component.podeCriarEmpresa
            ).toBeTrue();

            expect(
                textoRenderizado()
            ).toContain(
                'Cadastrar empresa'
            );

            expect(
                textoRenderizado()
            ).not.toContain(
                'Você não possui permissão'
            );
        }
    );

    it(
        'deve orientar o usuario sem permissao de criar empresa',
        () => {

            autorizacaoService
                .possuiPermissao
                .and
                .returnValue(false);

            criarComponente(
                estadoEmpresaPendente()
            );

            expect(
                component.podeCriarEmpresa
            ).toBeFalse();

            expect(
                textoRenderizado()
            ).not.toContain(
                'Cadastrar empresa'
            );

            expect(
                textoRenderizado()
            ).toContain(
                'Você não possui permissão'
            );
        }
    );

    it(
        'deve apresentar empresa cadastrada',
        () => {

            criarComponente(
                of({
                    empresaCadastrada:
                        true,
                    proximaEtapa:
                        null
                })
            );

            expect(
                component.carregando
            ).toBeFalse();

            expect(
                component
                    .empresaCadastrada
            ).toBeTrue();

            expect(
                component
                    .deveCadastrarEmpresa
            ).toBeFalse();

            expect(
                textoRenderizado()
            ).toContain(
                'Primeira empresa cadastrada'
            );

            expect(
                textoRenderizado()
            ).toContain(
                'Acessar empresas'
            );
        }
    );

    it(
        'nao deve apresentar acesso as empresas sem EmpresaListar',
        () => {

            autorizacaoService
                .possuiPermissao
                .and
                .callFake(
                    (permissao) =>
                        permissao ===
                        ChavePermissao
                            .EmpresaCriar
                );

            criarComponente(
                of({
                    empresaCadastrada:
                        true,
                    proximaEtapa:
                        null
                })
            );

            expect(
                component.podeListarEmpresa
            ).toBeFalse();

            expect(
                textoRenderizado()
            ).not.toContain(
                'Acessar empresas'
            );
        }
    );

    it(
        'deve apresentar erro ao falhar a consulta',
        () => {

            criarComponente(
                throwError(
                    () => new Error(
                        'Falha na consulta'
                    )
                )
            );

            expect(
                component.carregando
            ).toBeFalse();

            expect(
                component.erroCarregamento
            ).toBeTrue();

            expect(
                component.estado
            ).toBeNull();

            expect(
                textoRenderizado()
            ).toContain(
                'Não foi possível carregar a configuração'
            );
        }
    );

    it(
        'deve forcar uma nova consulta ao tentar novamente',
        () => {

            service.consultar
                .and
                .returnValue(
                    throwError(
                        () => new Error(
                            'Falha na consulta'
                        )
                    )
                );

            service.recarregar
                .and
                .returnValue(
                    estadoEmpresaPendente()
                );

            fixture =
                TestBed.createComponent(
                    ConfiguracaoInicialComponent
                );

            component =
                fixture.componentInstance;

            fixture.detectChanges();

            const botao:
                HTMLButtonElement | null =
                    fixture.nativeElement
                        .querySelector(
                            'button'
                        );

            expect(botao)
                .not.toBeNull();

            botao?.click();

            fixture.detectChanges();

            expect(
                service.consultar
            ).toHaveBeenCalledTimes(1);

            expect(
                service.recarregar
            ).toHaveBeenCalledTimes(1);

            expect(
                component.erroCarregamento
            ).toBeFalse();

            expect(
                component
                    .deveCadastrarEmpresa
            ).toBeTrue();

            expect(
                textoRenderizado()
            ).toContain(
                'Cadastre sua primeira empresa'
            );
        }
    );

    function criarComponente(
        resposta:
            Observable<
                EstadoConfiguracaoInicial
            >
    ): void {

        service.consultar
            .and
            .returnValue(
                resposta
            );

        fixture =
            TestBed.createComponent(
                ConfiguracaoInicialComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    }

    function estadoEmpresaPendente():
        Observable<
            EstadoConfiguracaoInicial
        > {

        return of({
            empresaCadastrada:
                false,
            proximaEtapa:
                ProximaEtapaConfiguracao
                    .Empresa
        });
    }

    function textoRenderizado(): string {
        return (
            fixture
                .nativeElement
                .textContent ?? ''
        );
    }
});