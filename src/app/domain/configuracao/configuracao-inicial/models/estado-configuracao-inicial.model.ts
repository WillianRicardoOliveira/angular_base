export enum ProximaEtapaConfiguracao {
    Empresa = 'EMPRESA'
}

export interface EstadoConfiguracaoInicial {
    empresaCadastrada: boolean;

    proximaEtapa:
        ProximaEtapaConfiguracao | null;
}

export interface ContextoConfiguracaoInicial {
    idOrganizacao: number | null;

    carregando: boolean;

    erro: boolean;

    estado:
        EstadoConfiguracaoInicial | null;
}