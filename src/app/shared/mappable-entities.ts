import { BaseEntity } from './base-entity';

// TODO write tests considering edge cases
// one such case is adding a BaseEntity with an ID that is already indexed
// FIXME might add a BaseEntity with and ID already generated
// FIXME might generate and ID that is already indexed
// working with negative IDs might work. databases don't use negative IDs
export class MappableEntities<T extends BaseEntity> {

    private currentArtificialId = -1;

    private entitiesByIdKey: Map<number, T> = new Map<number, T>();

    constructor(entitiesArr?: Array<T>) {
        if (entitiesArr) {
            entitiesArr.forEach(e => this.push(e));
        }
    }

    push(entity: T) {
        const idKey: number = this.figureId(entity);
        if (this.entitiesByIdKey.has(idKey)) {
            throw new RangeError(`id or artificialId '${idKey}' already exists. Not pushing the entity to avoid inconsistent state.`);
        }
        this.entitiesByIdKey.set(idKey, entity);
    }

    private figureId(entity: T): number {
        const numberId: number = entity.id;
        if (numberId || numberId === 0) {
            return numberId;
        }
        return this.figureArtificialId(entity);
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
        const artificialId = this.currentArtificialId;
        this.currentArtificialId -= 1;
        return artificialId;
    }

    protected nextGeneratedId(): number {
        return this.currentArtificialId;
    }

    delete(entity: T) {
        const idKey: number = this.safeFigureId(entity);
        this.entitiesByIdKey.delete(idKey);
    }

    private safeFigureId(entity: T): number {
        const numberId: number = entity.id;
        if (numberId || numberId === 0) {
            return numberId;
        }
        return entity.artificialId;
    }

    update(entity: T) {
        const idKey: number = this.safeFigureId(entity);
        this.entitiesByIdKey.set(idKey, entity);
    }

    get(entity: T): T {
        const idKey: number = this.safeFigureId(entity);
        return this.entitiesByIdKey.get(idKey);
    }

    values(): Array<T> {
        return Array.from(this.entitiesByIdKey.values());
    }

}
