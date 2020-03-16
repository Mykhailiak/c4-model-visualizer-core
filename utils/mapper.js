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

export const createHighLevelMap = (data = {}) => {
  const entries = Object.entries(data);

  return entries.reduce((acc, [id, entity]) => {
    if (entity.relations && entity.relations.to) {
      acc[id] = findParentEntities(data, Object.keys(entity.relations.to));
    }

    return acc;
  }, {});
};
