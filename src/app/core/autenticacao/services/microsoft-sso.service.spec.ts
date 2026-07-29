import {TestBed} from '@angular/core/testing';
import {MsalService} from '@azure/msal-angular';
import {
    AccountInfo,
    AuthenticationResult,
    IPublicClientApplication
} from '@azure/msal-browser';
import {of} from 'rxjs';

import {
    requisicaoLoginSso
} from '@/core/autenticacao/configuracoes/msal.config';

import {MicrosoftSsoService} from './microsoft-sso.service';

describe('MicrosoftSsoService', () => {
    let service: MicrosoftSsoService;
    let msalServiceMock: jasmine.SpyObj<MsalService>;
    let instanciaMsalMock:
        jasmine.SpyObj<IPublicClientApplication>;

    beforeEach(() => {
        instanciaMsalMock =
            jasmine.createSpyObj<IPublicClientApplication>(
                'IPublicClientApplication',
                [
                    'setActiveAccount',
                    'clearCache'
                ]
            );

        msalServiceMock =
            jasmine.createSpyObj<MsalService>(
                'MsalService',
                ['loginPopup'],
                {
                    instance: instanciaMsalMock
                }
            );

        TestBed.configureTestingModule({
            providers: [
                MicrosoftSsoService,
                {
                    provide: MsalService,
                    useValue: msalServiceMock
                }
            ]
        });

        service = TestBed.inject(MicrosoftSsoService);
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    it('deve autenticar e retornar o access token Microsoft', () => {
        const conta = {
            homeAccountId: 'home-account-id',
            environment: 'login.microsoftonline.com',
            tenantId: 'tenant-id',
            username: 'usuario@empresa.com',
            localAccountId: 'local-account-id',
            name: 'Usuário'
        } as AccountInfo;

        const resultado = {
            account: conta,
            accessToken: 'access-token-microsoft'
        } as AuthenticationResult;

        msalServiceMock.loginPopup.and.returnValue(
            of(resultado)
        );

        service.login().subscribe((token) => {
            expect(token).toBe('access-token-microsoft');
        });

        expect(
            msalServiceMock.loginPopup
        ).toHaveBeenCalledOnceWith(requisicaoLoginSso);

        expect(
            instanciaMsalMock.setActiveAccount
        ).toHaveBeenCalledOnceWith(conta);
    });

    it('deve limpar o cache local do MSAL', async () => {
        instanciaMsalMock.clearCache.and.returnValue(
            Promise.resolve()
        );

        await service.limparCacheLocal();

        expect(
            instanciaMsalMock.clearCache
        ).toHaveBeenCalledTimes(1);
    });
});