const innerLevelKeys = ['container', 'component', 'class'];

export const registerRelastions = (data, path = []) => {
  let registry = [];

  Object.entries(data).forEach(([key, value]) => {
    let levelProp = innerLevelKeys.find((k) => value.hasOwnProperty(k));
    const computedPath = path.concat(key);

    if (levelProp) {
      registry = registry.concat(
        registerRelastions(value[levelProp], computedPath),
      );
    }

    if (value.relations) {
      registry = registry.concat({
        ...value.relations,
        parents: computedPath,
      });
    }
  });

  return registry;
};

export const registerEntities = (data, path = []) => {
  let registry = {};

  Object.entries(data).forEach(([key, value]) => {
    let levelProp = innerLevelKeys.find((k) => value.hasOwnProperty(k));
    const computedPath = path.concat(key);

    if (levelProp) {
      registry = {
        ...registry,
        ...registerEntities(value[levelProp], computedPath),
      };
    }

    registry[key] = computedPath;
  });

  return registry;
};

const getClosestAvailableNode = (nodesList, availableNodes) =>
  [...nodesList].reverse().find((n) => availableNodes.includes(n));

export const bindRegistriesBySelectedLevel = (context, availableNodes) => {
  const relationsRegistry = registerRelastions(context);
  const entitiessRegistry = registerEntities(context);

  const bindedRelations = relationsRegistry.reduce((acc, relation) => {
    const key = getClosestAvailableNode(relation.parents, availableNodes);

    Object.entries(relation.to).forEach(([targetKey, description]) => {
      acc = acc.concat({
        key,
        description,
        target: getClosestAvailableNode(
          entitiessRegistry[targetKey],
          availableNodes,
        ),
      });
    });

    return acc;
  }, []);

  return bindedRelations;
};
