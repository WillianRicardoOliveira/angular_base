
export interface Conteudo {

    id: number,
    destino: string,
    imagem: string,
    preco: number

}

export interface Depoimento {
    id: number;
    imagem: string
    texto: string;
    autor: string;
}

export interface PessoaUsuario {
    id: number,
    nome: string;
    nascimento: string;
    genero: string,
    cpf: string;
    telefone: string;
    endereco: Endereco,
    usuario: Usuario
    aceiteTermo: boolean,
    tipoPessoa: string
}
  
export interface Endereco {
    cep: string,
    logradouro: string,
    complemento: string    
    bairro: string,    
    localidade: string,
    uf: string,
    numero: string
}
/*
export interface Estado {
    id: number;
    nome: string;
    sigla: string;
}
*/
export interface Usuario {
    email: string,
    senha: string
}