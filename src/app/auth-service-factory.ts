import { HttpService, AuthConfig, AuthService } from '@basis/angular-components';
import { User } from './user/';

export function authServiceFactory(http: HttpService, config: AuthConfig) {
    return new AuthService<User>(http, config);
}
