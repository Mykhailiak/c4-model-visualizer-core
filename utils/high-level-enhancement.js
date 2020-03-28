const innerLevelKeys = ['container', 'component', 'class'];

export const enhanceData = (level) => (data, levelKey) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    let levelProp = innerLevelKeys.find((k) => value.hasOwnProperty(k));

    acc[key] = value;

    if (levelProp) {
      acc[key] = {
        ...acc[key],
        ...enhanceData(level)(value[levelProp], levelProp),
      };
    } else if (value.relations && value.relations.to) {
      return {
        [levelKey]: value,
        childRelations: value.relations.to,
      };
    }

    return acc;
  }, {});
};
