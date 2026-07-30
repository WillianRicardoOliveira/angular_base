export enum ChavePermissao {
    UsuarioCriar = 'ACESSO_USUARIO_CRIAR',
    UsuarioListar = 'ACESSO_USUARIO_LISTAR',
    UsuarioEditar = 'ACESSO_USUARIO_EDITAR',
    UsuarioExcluir = 'ACESSO_USUARIO_EXCLUIR',
    UsuarioDetalhar = 'ACESSO_USUARIO_DETALHAR',
    UsuarioSenhaEditar = 'ACESSO_USUARIO_SENHA_EDITAR',

    PerfilCriar = 'ACESSO_PERFIL_CRIAR',
    PerfilListar = 'ACESSO_PERFIL_LISTAR',
    PerfilEditar = 'ACESSO_PERFIL_EDITAR',
    PerfilExcluir = 'ACESSO_PERFIL_EXCLUIR',
    PerfilDetalhar = 'ACESSO_PERFIL_DETALHAR',

    PermissaoCriar = 'ACESSO_PERMISSAO_CRIAR',
    PermissaoListar = 'ACESSO_PERMISSAO_LISTAR',
    PermissaoEditar = 'ACESSO_PERMISSAO_EDITAR',
    PermissaoExcluir = 'ACESSO_PERMISSAO_EXCLUIR',
    PermissaoDetalhar = 'ACESSO_PERMISSAO_DETALHAR',

    PerfilPermissaoCriar =
        'ACESSO_PERFIL_PERMISSAO_CRIAR',
    PerfilPermissaoListar =
        'ACESSO_PERFIL_PERMISSAO_LISTAR',
    PerfilPermissaoExcluir =
        'ACESSO_PERFIL_PERMISSAO_EXCLUIR',
    PerfilPermissaoDetalhar =
        'ACESSO_PERFIL_PERMISSAO_DETALHAR',

    UsuarioPerfilCriar =
        'ACESSO_USUARIO_PERFIL_CRIAR',
    UsuarioPerfilListar =
        'ACESSO_USUARIO_PERFIL_LISTAR',
    UsuarioPerfilExcluir =
        'ACESSO_USUARIO_PERFIL_EXCLUIR',
    UsuarioPerfilDetalhar =
        'ACESSO_USUARIO_PERFIL_DETALHAR'
}