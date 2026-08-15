export type Status =
    | 'ATIVO'
    | 'INATIVO'
    | 'REMOVIDO';

export interface Usuario {
    id?: number;
    email: string;
    senha?: string;
    status?: Status;
}

export interface Empresa {
    id?: number;
    nome: string;
    status?: Status;
}

export interface Subsidiaria {
    id?: number;
    idEmpresa: number;
    empresa?: string;
    nome: string;
    status?: Status;
}

export interface UsuarioEmpresa {
    id?: number;
    idUsuario: number;
    usuario?: string;
    idEmpresa: number;
    empresa?: string;
    todasSubsidiarias: boolean;
    status?: Status;
}

export interface Perfil {
    id?: number;
    nome: string;
    descricao?: string;
    status?: Status;
}

export interface Permissao {
    id?: number;
    nome: string;
    chave: string;
    descricao?: string;
    status?: Status;
}

export interface PerfilPermissao {
    id?: number;
    idPerfil?: number;
    perfil?: string;
    idPermissao: number;
    permissao?: string;
    chave?: string;
    status?: Status;
}

export interface UsuarioPerfil {
    id?: number;
    idUsuario?: number;
    usuario?: string;
    idPerfil: number;
    perfil?: string;
    status?: Status;
}






export interface Fornecedor {
    id?: number,
    cnpj: string,
    nome: string,
    telefone: string,
    descricao: string,
    ativo?: boolean
}

export interface Produto {
    id?: number,
    nome: string,
    descricao:string,
    quantidade?: number,
    minimo: number,
    maximo: number,
    ativo?: boolean
}

export interface Compra {
    id?: number,
    nome: string,
    descricao: string,
    status?: string,
    data?: string,
    ativo?: boolean
}

export interface CompraItem {
    id?: number,
    compra: number,
    fornecedor: Fornecedor,
    produto: Produto,
    quantidade: number,
    valor: String,
    total: String,
    ativo?: boolean
}  

export interface Movimentacao {
    id?: number,
    tipoMovimentacao: TipoMovimentacao
    compra: number,
    produto: Produto,
    quantidade: number,
    total?: number,
    data?: string,
    ativo?: boolean
}
  
export interface TipoMovimentacao {
    id?: number,
    nome: string
}

export interface CategoriaConta {
    id?: number,
    nome: string
}

export interface SubCategoriaConta {
    id?: number,
    nome: string,
    categoriaConta: number,
    ativo?: boolean
}  

export interface ContasApagar {
    id?: number,
    fornecedor: Fornecedor,
    categoriaConta : CategoriaConta
    subCategoriaConta: SubCategoriaConta,
    descricao: string,
    valor: String,
    parcelas: number, 
    statusPagamento: StatusPagamento,
    formaPagamento: FormaPagamento,
    ativo?: boolean
}  

export interface FormaPagamento {
    id?: number,
    nome: string,
    ativo?: boolean  
}  

export interface StatusPagamento {
    id?: number,
    nome: string,
    ativo?: boolean  
}  














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
    nome: string;
    nascimento: string;
    genero: string;
    cpf: string;
    telefone: string;
    endereco: Endereco;
    usuario: Usuario;
    aceitarTermos: boolean;
    tipoPessoa: string;
}
  
export interface Endereco {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    numero: string;
}
/*
export interface Estado {
    id: number;
    nome: string;
    sigla: string;
}
*/
