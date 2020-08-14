export const environment = {
    production: true,
    apiUrl: '/api',
    auth: {
        detailsUrl: '/api/user/details',
        loginUrl: '/#/login',
        logoutUrl: '/',
        userStorage: localStorage,
        userStorageIndex: 'user',
        publicUrls: ['/api/authenticate'],
        baseUrl: '',
        tokenValidationUrl: '/api/token/validate',
        storage: localStorage,
        loginSuccessRoute: '/#/login-success'
    }
};
