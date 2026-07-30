import {
    Directive,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import {Subscription} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';
import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

@Directive({
    selector: '[appTemPermissao]',
    standalone: true
})
export class TemPermissaoDirective
    implements OnInit, OnDestroy {
    private permissao?: ChavePermissao;
    private viewCriada = false;

    private readonly subscription =
        new Subscription();

    constructor(
        private templateRef:
            TemplateRef<unknown>,
        private viewContainerRef:
            ViewContainerRef,
        private autorizacaoService:
            AutorizacaoService
    ) {}

    @Input({
        required: true
    })
    set appTemPermissao(
        permissao: ChavePermissao
    ) {
        this.permissao = permissao;
        this.atualizarView();
    }

    ngOnInit(): void {
        this.subscription.add(
            this.autorizacaoService
                .retornarEstado()
                .subscribe(() => {
                    this.atualizarView();
                })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private atualizarView(): void {
        const podeExibir =
            !!this.permissao &&
            this.autorizacaoService
                .permissoesCarregadas() &&
            this.autorizacaoService
                .possuiPermissao(
                    this.permissao
                );

        if (podeExibir && !this.viewCriada) {
            this.viewContainerRef
                .createEmbeddedView(
                    this.templateRef
                );

            this.viewCriada = true;
            return;
        }

        if (!podeExibir && this.viewCriada) {
            this.viewContainerRef.clear();
            this.viewCriada = false;
        }
    }
}