import { BaseEntity } from './base-entity';
import { MappableEntities } from './mappable-entities';

fdescribe('MappableEntities', () => {

    // tslint:disable-next-line:prefer-const
    let mappableEntities: MappableEntities<BaseEntity>;

    beforeEach(() => this.mappableEntities = new MappableEntities<BaseEntity>());

    describe('Instantiating with an initial list', () => {
        it('should add all values passed in the constructor', () => {
            const e = { name: 'entity', id: undefined, artificialId: undefined };
            const e2 = { name: 'entity2', id: 2, artificialId: undefined };
            const e3 = { name: 'entity3', id: undefined, artificialId: undefined };

            this.mappableEntities = new MappableEntities<BaseEntity>([e, e2, e3]);

            const values = this.mappableEntities.values();
            expect(values).toContain(e);
            expect(values).toContain(e2);
            expect(values).toContain(e3);
            expect(values.length).toEqual(3);
        });
    });

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

        it('should not change the id of a BaseEntity with and id', () => {
            const id = 123;
            const entity = { name: 'entity', id: id, artificialId: undefined };
            this.mappableEntities.push(entity);
            expect(entity.id).toEqual(id);
        });
    });

    describe('Invalid push scenarios', () => {
        it(`should throw error when adding BaseEntity with same id as an
         already added one`, () => {
                const id = 123;
                const e = { name: 'entity', id: id, artificialId: undefined };
                this.mappableEntities.push(e);

                const eWithSameId = { name: 'entity2', id: id, artificialId: undefined };
                expect(() => {
                    this.mappableEntities.push(eWithSameId);
                }).toThrowError(RangeError);

                const values = this.mappableEntities.values();
                expect(values.length).toEqual(1);
                expect(values).toContain(e);
                expect(values).not.toContain(eWithSameId);
            });
    });

});
