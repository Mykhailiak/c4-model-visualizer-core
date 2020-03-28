const innerLevelKeys = ['container', 'component', 'class'];

export const registerRelastions = (data, path = []) => {
  let registry = [];

  Object.entries(data).forEach(([key, value]) => {
    let levelProp = innerLevelKeys.find((k) => value.hasOwnProperty(k));
    const computedPath = path.concat(key)

    if (levelProp) {
      registry = registry.concat(registerRelastions(value[levelProp], computedPath));
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
    const computedPath = path.concat(key)

    if (levelProp) {
      registry = {
        ...registry,
        ...registerEntities(value[levelProp], computedPath)
      }
    }

    registry[key] = path;
  });

  return registry;
};
