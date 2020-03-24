const innerLevels = ['container', 'component', 'class'];

const getLevelKey = (entity) =>
  innerLevels.find((l) => entity.hasOwnProperty(l));

const getKeyBySelectedScope = (key, selectedScope, parentKey) =>
  key === selectedScope ? null : parentKey || key;

const getDestinationByLookingKey = (
  context,
  lookingKey,
  parentKey,
  selectedScope,
) => {
  return Object.entries(context).reduce((acc, [key, entity]) => {
    const hasRelationRules = entity.relations && entity.relations.to;
    const existsOnCurrentLevel = key === lookingKey;
    const computedKey = getKeyBySelectedScope(key, selectedScope, parentKey);
    const destination =
      existsOnCurrentLevel && key === selectedScope
        ? key
        : hasRelationRules && computedKey == null
        ? key
        : computedKey;

    // Problem of redundant element is here. Cannot create proper relations between element and focused context (which becomes null)
    if (existsOnCurrentLevel) {
      return destination;
    }

    const levelKey = getLevelKey(entity);

    if (levelKey && acc == null) {
      return getDestinationByLookingKey(
        entity[levelKey],
        lookingKey,
        destination,
        selectedScope,
      );
    }

    return acc;
  }, null);
};

const getDestinations = (context, keys = [], selectedScope) =>
  keys.map((k) => getDestinationByLookingKey(context, k, null, selectedScope));

export const createHighLevelMap = (
  data,
  parentKey,
  globalContext,
  selectedScope,
) => {
  const entries = Object.entries(data);

  return entries.reduce((acc, [key, entity]) => {
    const hasRelationRules = entity.relations && entity.relations.to;
    const computedKey = getKeyBySelectedScope(key, selectedScope, parentKey);
    const source = hasRelationRules && computedKey == null ? key : computedKey;
    const context = globalContext || data;

    if (hasRelationRules) {
      acc[source] = getDestinations(
        context,
        Object.keys(entity.relations.to),
        selectedScope,
      );

      return acc;
    }

    const levelKey = getLevelKey(entity);

    if (levelKey) {
      return {
        ...acc,
        ...createHighLevelMap(entity[levelKey], source, context, selectedScope),
      };
    }

    return acc;
  }, {});
};
