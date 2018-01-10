import { BaseEntity } from './base-entity';
import { MappableEntities } from './mappable-entities';

import * as _ from 'lodash';

class TestBaseEntity implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public artificialId?: number,
    ) { }
}

fdescribe('MappableEntities', () => {

    let mappableEntities: MappableEntities<TestBaseEntity>;
    let entityWithNoIds;

    // push() is impure (modifies the argument). reinstantiating entityWithNoIds before each test case
    beforeEach(() => {
        mappableEntities = new MappableEntities<TestBaseEntity>();
        entityWithNoIds = { name: 'entity', id: undefined, artificialId: undefined };
    });


    describe('Instantiating with an initial list', () => {
        it('should add all values passed in the constructor', () => {
            const e2 = { name: 'entity2', id: 2, artificialId: undefined };
            const e3 = _.clone(entityWithNoIds);
            e3.artificialId = 3;

            mappableEntities = new MappableEntities<BaseEntity>([entityWithNoIds, e2, e3]);

            const values = mappableEntities.values();
            expectToContainExactly(values, entityWithNoIds, e2, e3);
        });
    });

    function expectToContainExactly(arr, ...values) {
        expect(arr.length).toEqual(values.length);
        doExpectToContain(arr, values);
    }

    function doExpectToContain(arr, values) {
        for (const value of values) {
            expect(arr).toContain(value);
        }
    }

    function expectToContain(arr, ...values) {
        doExpectToContain(arr, values);
    }

    describe('push()', () => {
        let entity;

        beforeEach(() => entity = entityWithNoIds);

        it('should add a BaseEntity with no artificialId nor id', () => {
            mappableEntities.push(entity);
            const values = mappableEntities.values();
            expect(values).toContain(entity);
        });

        it(`should generate and assign (impure) a artificialId to a BaseEntity with no
            artificialId nor id`, () => {
                mappableEntities.push(entity);
                expect(entity.artificialId).not.toBeUndefined();
            });

        it('should not generate an artificialId to a BaseEntity with an id', () => {
            entity.id = 123;
            mappableEntities.push(entity);
            expect(entity.artificialId).toBeUndefined();
        });

        it('should not generate an artificialId to a BaseEntity with id 0', () => {
            entity.id = 0;
            mappableEntities.push(entity);
            expect(entity.artificialId).toBeUndefined();
        });

        it('should not change the id of a BaseEntity with and id', () => {
            const id = 123;
            entity.id = id;
            mappableEntities.push(entity);
            expect(entity.id).toEqual(id);
        });

        it(`should throw error when adding BaseEntity with same id as an
         already added one`, () => {
                const id = 123;
                entity.id = id;
                mappableEntities.push(entity);

                const eWithSameId = { name: 'entity2', id: id, artificialId: undefined };
                expect(() => {
                    mappableEntities.push(eWithSameId);
                }).toThrowError(RangeError);

                const values = mappableEntities.values();
                expectToContainExactly(values, entity);
                expect(values).not.toContain(eWithSameId);
            });

        it(`should not generate an Id that already exists as a key`, () => {
            // Given that an entity 'entity1' is added with an ID that was going to be generated next
            const nextId: number = mappableEntities.nextGeneratedId();

            entity.id = nextId;
            mappableEntities.push(entity);

            // When an entity 'entity2' is added
            const e2 = { name: 'entity2', id: undefined, artificialId: undefined };
            mappableEntities.push(e2);

            // Then the id of 'entity2' should not be the same as 'entity1'
            // And both entities should be in values()
            expect(e2.artificialId).not.toEqual(nextId);
            expect(e2.artificialId).not.toBeUndefined();

            const values = mappableEntities.values();
            expectToContainExactly(values, entity, e2);
        });
    });

    describe('get()', () => {

        it('should throw error if the BaseEntity is not indexed', () => {
            expect(() => {
                mappableEntities.get(entityWithNoIds);
            }).toThrowError(Error);
        });

        describe('indexed by id', () => {

            let entityWithId;
            beforeEach(() => {
                entityWithId = entityWithNoIds;
                entityWithId.id = 123;
                mappableEntities.push(entityWithId);
            });

            it('should return BaseEntity with the same id', () => {
                const gottenEntity = mappableEntities.get(entityWithId);
                expect(gottenEntity.id).toEqual(entityWithId.id);
            });

            it('should not change the entity', () => {
                expectNotToChangeAfterAGet(entityWithId);
            });
        });

        // TODO test if get() does not change the values, same length, same content

        function expectNotToChangeAfterAGet(entity) {
            const entityBeforeGet = _.clone(entity);
            const gottenEntity = mappableEntities.get(entity);
            expect(gottenEntity).toEqual(entityBeforeGet);
        }

        describe('indexed by artificialId', () => {

            let entityWithArtificialId;
            beforeEach(() => {
                entityWithArtificialId = entityWithNoIds;
                entityWithArtificialId.artificialId = 10;
                mappableEntities.push(entityWithArtificialId);
            });

            it('should return BaseEntity with the same artificialId', () => {
                const gottenEntity = mappableEntities.get(entityWithArtificialId);
                expect(gottenEntity.artificialId).toEqual(entityWithArtificialId.artificialId);
            });

            it('should not change the entity', () => {
                expectNotToChangeAfterAGet(entityWithArtificialId);
            });

        });

    });

    describe('update()', () => {
        it('should throw an error if the BaseEntity is not indexed', () => {
            expect(() => {
                mappableEntities.update(entityWithNoIds);
            }).toThrowError(Error);
        });

        it(`should update a BaseEntity if its reference changes, without calling update()
            [ EXPECTED BEHAVIOR - the class does not work with immutability ]`, () => {
                const entityWithId = _.clone(entityWithNoIds);
                entityWithId.id = 123;
                mappableEntities.push(entityWithId);

                entityWithId.name = 'updated';
                const gotten = mappableEntities.get(entityWithId);

                expect(gotten.name).toEqual(entityWithId.name);
            });

        it('should not update old object reference when updating', () => {
            const entityWithId = _.clone(entityWithNoIds);
            entityWithId.id = 123;
            mappableEntities.push(entityWithId);

            const clone = _.clone(entityWithId);
            clone.name = 'updated';

            mappableEntities.update(clone);
            const gotten = mappableEntities.get(clone);

            expect(gotten).not.toEqual(entityWithNoIds);
        });

        it('should update the indexed value when value with the same id is given', () => {
            const entityWithId = _.clone(entityWithNoIds);
            entityWithId.id = 123;
            mappableEntities.push(entityWithId);

            const clone = _.clone(entityWithId);
            clone.name = 'updated';

            mappableEntities.update(clone);
            const gotten = mappableEntities.get(clone);

            expect(gotten).toEqual(clone);
        });

        it('should update the indexed value when value with the same artificialId is given', () => {
            const entityWithId = _.clone(entityWithNoIds);
            entityWithId.artificialId = 10;
            mappableEntities.push(entityWithId);

            const clone = _.clone(entityWithId);
            clone.name = 'updated';

            mappableEntities.update(clone);
            const gotten = mappableEntities.get(clone);

            expect(gotten).toEqual(clone);
        });
    });

    describe('delete()', () => {
        it('should throw an error if the BaseEntity is not indexed', () => {
            expect(() => {
                mappableEntities.delete(entityWithNoIds);
            }).toThrowError(Error);
        });
    });

});
