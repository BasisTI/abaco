export class ElasticQuery {

    static wildcard: string = '*';

    value: string;

    private readonly _query: string;

    get query(): string {
        return this.value ? this.value : ElasticQuery.wildcard;
    }

    reset() {
        this.value = '';
    }


}