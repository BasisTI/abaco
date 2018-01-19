export class Authority {
    constructor(
        public name?: string,
        public artificialId?: number,
    ) {
        if ('ROLE_ADMIN' === name) {
            this.artificialId = 1;
        }
        if ('ROLE_USER' === name) {
            this.artificialId = 2;
        }
    }

}
