import { BaseEntity } from './base-entity';
export class EntityToJSON {

    static convert<T extends BaseEntity>(entity: T): T {
        const json: string = JSON.stringify(entity, this.replacer);
        return JSON.parse(json);
    }

    static convertWithReplacer<T extends BaseEntity>(entity: T,
        replacerFunction: (k: string, v: any) => any): T {
        const json: string = JSON.stringify(entity, replacerFunction);
        return JSON.parse(json);
    }

    private static replacer(key, value) {
        if (key === 'artificialId') {
            return undefined;
        } else {
            return value;
        }
    }

}
