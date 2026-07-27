export interface ErroCampo {
    campo: string;
    mensagem: string;
}

export interface ErroApi {
    status: number;
    erro: string;
    mensagem: string;
    campos?: ErroCampo[];
}