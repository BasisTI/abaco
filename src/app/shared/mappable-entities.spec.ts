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

describe('MappableEntities', () => {

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
        entityWithId = createEntityWithOnlyId();
        mappableEntities.push(entityWithId);
      });

      it('should return BaseEntity with the same id', () => {
        const gottenEntity = mappableEntities.get(entityWithId);
        expect(gottenEntity.id).toEqual(entityWithId.id);
      });

      it('should not change the entity', () => {
        expectEntityNotToChangeAfterAGet(entityWithId);
      });

      it('should not change the indexed values', () => {
        expectValuesNotToChangeAfterAGet(entityWithId);
      });
    });

    function expectValuesNotToChangeAfterAGet(entity) {
      const valuesBeforeGet = _.cloneDeep(mappableEntities.values());
      const gottenEntity = mappableEntities.get(entity);
      expect(valuesBeforeGet).toEqual(mappableEntities.values());
    }

    function expectEntityNotToChangeAfterAGet(entity) {
      const entityBeforeGet = _.clone(entity);
      const gottenEntity = mappableEntities.get(entity);
      expect(gottenEntity).toEqual(entityBeforeGet);
    }

    describe('indexed by artificialId', () => {

      let entityWithArtificialId;
      beforeEach(() => {
        entityWithArtificialId = createEntityWithOnlyArtificialId();
        mappableEntities.push(entityWithArtificialId);
      });

      it('should return BaseEntity with the same artificialId', () => {
        const gottenEntity = mappableEntities.get(entityWithArtificialId);
        expect(gottenEntity.artificialId).toEqual(entityWithArtificialId.artificialId);
      });

      it('should not change the entity', () => {
        expectEntityNotToChangeAfterAGet(entityWithArtificialId);
      });

      it('should not change the indexed values', () => {
        expectValuesNotToChangeAfterAGet(entityWithArtificialId);
      });

    });

  });

  function createEntityWithOnlyId(): TestBaseEntity {
    const e = _.clone(entityWithNoIds);
    e.id = 123;
    return e;
  }

  function createEntityWithOnlyArtificialId(): TestBaseEntity {
    const e = _.clone(entityWithNoIds);
    e.artificialId = 10;
    return e;
  }

  describe('updating', () => {
    it('should throw an error if the BaseEntity is not indexed', () => {
      expect(() => {
        mappableEntities.update(entityWithNoIds);
      }).toThrowError(Error);
    });

    it(`should update a BaseEntity if its reference changes, without calling update()
            [ EXPECTED BEHAVIOR - the class does not work with immutability ]`, () => {
        const entityWithId = createEntityWithOnlyId();
        mappableEntities.push(entityWithId);

        entityWithId.name = 'updated';
        const gotten = mappableEntities.get(entityWithId);

        expect(gotten.name).toEqual(entityWithId.name);
      });

    describe('update()', () => {

      describe('indexed by id', () => {

        let entityWithId;
        let clone;
        let gotten;

        beforeEach(() => {
          entityWithId = createEntityWithOnlyId();
          mappableEntities.push(entityWithId);

          clone = createAndUpdateClone(entityWithId);
          gotten = mappableEntities.get(clone);
        });

        it('should not update old object reference when updating', () => {
          expect(gotten).not.toEqual(entityWithId);
        });

        it('should update the indexed value when value with the same id is given', () => {
          expect(gotten).toEqual(clone);
        });
      });

      function createAndUpdateClone(entity): TestBaseEntity {
        const clone = _.clone(entity);
        clone.name = 'updated';
        mappableEntities.update(clone);
        return clone;
      }

      describe('indexed by artificialId', () => {
        it('should update the indexed value when value with the same artificialId is given', () => {
          const entityWithArtificialId = createEntityWithOnlyArtificialId();
          mappableEntities.push(entityWithArtificialId);

          const clone = createAndUpdateClone(entityWithArtificialId);
          const gotten = mappableEntities.get(clone);

          expect(gotten).toEqual(clone);
        });
      });
    });
  });

  describe('delete()', () => {
    it('should throw an error if the BaseEntity is not indexed', () => {
      expect(() => {
        mappableEntities.delete(entityWithNoIds);
      }).toThrowError(Error);
    });

    it('should delete the ID indexed value', () => {
      const entityWithId = createEntityWithOnlyId();
      pushEntityAndDeleteIt(entityWithId);
      expectEntityToNotBeInValues(entityWithId);
    });

    function pushEntityAndDeleteIt(entity) {
      mappableEntities.push(entity);
      mappableEntities.delete(entity);
    }

    function expectEntityToNotBeInValues(entity) {
      const values = mappableEntities.values();
      expect(values).not.toContain(entity);
    }

    it('should delete the artificialId indexed value', () => {
      const entityWithArtificialId = createEntityWithOnlyArtificialId();
      pushEntityAndDeleteIt(entityWithArtificialId);
      expectEntityToNotBeInValues(entityWithArtificialId);
    });
  });

});
