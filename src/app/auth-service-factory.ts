import { HttpService, AuthConfig, AuthService } from '@basis/angular-components';
import { User } from './user/';

export function authServiceFactory(http: HttpService) {
    const config: AuthConfig = {
        detailsUrl: '/api/users/details',
        loginUrl: '/api/login',
        logoutUrl: '/api/logout',
        userStorage: localStorage,
        userStorageIndex: 'user'
    };

    return new AuthService<User>(http, config);
}