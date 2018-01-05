import { BaseEntity } from './base-entity';

export class MappableEntities<T extends BaseEntity> {

    private generatedArtificialId = 0;

    private entitiesToIdKey: Map<number, T> = new Map<number, T>();

    constructor(private entitiesArr?: Array<T>) {
        if (entitiesArr) {
            entitiesArr.forEach(e => this.push(e));
        }
    }

    push(entity: T) {
        const idKey: number = this.figureId(entity);
        this.entitiesToIdKey.set(idKey, entity);
    }

    private figureId(entity: T): number {
        return entity.id ? entity.id : this.figureArtificialId(entity);
    }

    /** Modifies entity if there is no artificialId */
    private figureArtificialId(entity: T): number {
        if (!entity.artificialId) {
            const artificialId = this.generateAndIncrementArtificialId();
            entity.artificialId = artificialId;
            return artificialId;
        }
        return entity.artificialId;
    }

    private generateAndIncrementArtificialId(): number {
        const artificialId = this.generatedArtificialId;
        this.generatedArtificialId += 1;
        return artificialId;
    }

    delete(entity: T) {
        const idKey: number = this.safeFigureId(entity);
        this.entitiesToIdKey.delete(idKey);
    }

    private safeFigureId(entity: T): number {
        return entity.id ? entity.id : entity.artificialId;
    }

    update(entity: T) {
        const idKey: number = this.safeFigureId(entity);
        this.entitiesToIdKey.set(idKey, entity);
    }

    get(entity: T) {
        const idKey: number = this.safeFigureId(entity);
        return this.entitiesToIdKey.get(idKey);
    }

    values(): Array<T> {
        return Array.from(this.entitiesToIdKey.values());
    }

}
