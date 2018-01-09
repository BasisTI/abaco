import { BaseEntity } from './base-entity';
import { MappableEntities } from './mappable-entities';

fdescribe('MappableEntities', () => {

    let mappableEntities: MappableEntities<BaseEntity>;

    beforeEach(() => this.mappableEntities = new MappableEntities<BaseEntity>());

    describe('Valid push scenarios', () => {
        it('should add a BaseEntity with no artificialId nor id', () => {
            const entity = { name: 'entity', id: undefined, artificialId: undefined };
            this.mappableEntities.push(entity);
            const values = this.mappableEntities.values();
            expect(values).toContain(entity);
        });

        it(`should generate and assign (impure) a artificialId to a BaseEntity with no
        artificialId nor id`, () => {
                const entity = { name: 'entity', id: undefined, artificialId: undefined };
                this.mappableEntities.push(entity);
                expect(entity.artificialId).not.toBeUndefined();
            });

        it('should not generate an artificialId to a BaseEntity with an id', () => {
            const entity = { name: 'entity', id: 123, artificialId: undefined };
            this.mappableEntities.push(entity);
            expect(entity.artificialId).toBeUndefined();
        });

        it('should not change the id of BaseEntity with and id', () => {
            const id = 123;
            const entity = { name: 'entity', id: id, artificialId: undefined };
            this.mappableEntities.push(entity);
            expect(entity.id).toEqual(id);
        });
    });

});
