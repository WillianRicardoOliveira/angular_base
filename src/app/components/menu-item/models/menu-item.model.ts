import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

export interface MenuItem {
    name: string;
    iconClasses: string;
    path?: string[];
    children?: MenuItem[];
    permissao?: ChavePermissao;
}