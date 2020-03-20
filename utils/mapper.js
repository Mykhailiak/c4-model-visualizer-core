const innerLevels = ['container', 'component', 'class'];

const findParentEntity = (entity, lookingKey, parent, selectedEntity) => {
  return Object.entries(entity).reduce((acc, [key, entity]) => {
    const existOnContextLevel = key === lookingKey;
    const computedKey = key === selectedEntity ? null : parent || key;

    if (existOnContextLevel) {
      return computedKey;
    }

    const level = innerLevels.find((l) => entity.hasOwnProperty(l));

    if (level && acc == null) {
      return findParentEntity(
        entity[level],
        lookingKey,
        computedKey,
        selectedEntity,
      );
    }

    return acc;
  }, null);
};

const findParentEntities = (entries, keys = [], selectedEntity) =>
  keys.map((k) => findParentEntity(entries, k, null, selectedEntity));

export const createHighLevelMap = (
  data = {},
  key,
  globalContext,
  selectedEntity,
) => {
  const entries = Object.entries(data);

  return entries.reduce((acc, [id, entity]) => {
    const computedKey = id === selectedEntity ? null : key || id;
    const context = globalContext || data;

    if (entity.relations && entity.relations.to) {
      acc[computedKey] = findParentEntities(
        context,
        Object.keys(entity.relations.to),
        selectedEntity,
      );

      return acc;
    }

    const levelKey = innerLevels.find((l) => entity.hasOwnProperty(l));

    if (levelKey) {
      return {
        ...acc,
        ...createHighLevelMap(
          entity[levelKey],
          computedKey,
          context,
          selectedEntity,
        ),
      };
    }

    return acc;
  }, {});
};
