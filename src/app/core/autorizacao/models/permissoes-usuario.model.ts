import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

export interface PermissoesUsuario {
    permissoes: ChavePermissao[];
}