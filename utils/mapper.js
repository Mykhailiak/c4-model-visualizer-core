const innerLevels = ['container', 'component', 'class'];

const findParentEntity = (entity, lookingKey, parent) => {
  return Object.entries(entity).reduce((acc, [key, entity]) => {
    const existOnContextLevel = key === lookingKey;
    const computedKey = parent || key;

    if (existOnContextLevel) {
      return computedKey;
    }

    const level = innerLevels.find((l) => entity.hasOwnProperty(l));

    if (level) {
      return findParentEntity(entity[level], lookingKey, computedKey);
    }

    return '';
  }, '');
};

const findParentEntities = (entries, keys = []) =>
  keys.map((k) => findParentEntity(entries, k));

export const createHighLevelMap = (data = {}, key, globalContext) => {
  const entries = Object.entries(data);

  return entries.reduce((acc, [id, entity]) => {
    const computedKey = key || id;
    const context = globalContext || data;

    if (entity.relations && entity.relations.to) {
      acc[computedKey] = findParentEntities(context, Object.keys(entity.relations.to));

      return acc;
    }

    const levelKey = innerLevels.find(l => entity.hasOwnProperty(l));

    if (levelKey) {
      return {
        ...acc,
        ...createHighLevelMap(entity[levelKey], computedKey, context),
      }
    }

    return acc;
  }, {});
};
