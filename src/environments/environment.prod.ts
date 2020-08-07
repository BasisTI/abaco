export const environment = {
    production: true,
    apiUrl: '/api',
    auth: {
        baseUrl: '',
        authUrl: '/login/',
        loginUrl: '/#/login',
        logoutUrl: '/#/logout',
        detailsUrl: '/api/user/details',
        tokenValidationUrl: '/api/token/validate',
        storage: localStorage,
        tokenStorageIndex: 'token',
        userStorageIndex: 'user',
        loginSuccessRoute: ''
    }
};
