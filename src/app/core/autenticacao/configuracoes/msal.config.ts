import {
    BrowserCacheLocation,
    IPublicClientApplication,
    PopupRequest,
    PublicClientApplication
} from '@azure/msal-browser';

import {environment} from 'environments/environment';

export function criarInstanciaMsal(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: environment.sso.clientId,
            authority:
                `https://login.microsoftonline.com/${environment.sso.tenantId}`,
            redirectUri: window.location.origin,
            postLogoutRedirectUri: window.location.origin
        },
        cache: {
            cacheLocation: BrowserCacheLocation.SessionStorage
        }
    });
}

export const requisicaoLoginSso: PopupRequest = {
    scopes: [
        environment.sso.apiScope
    ]
};