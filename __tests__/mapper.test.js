import { createHighLevelMap } from '../utils/mapper';

const nestedInput = {
  'order-support-system': {
    name: 'Name',
    container: {
      'order-support-system-foo': {
        name: 'Foo',
        relations: {
          to: {
            'back-end': 'posts Orders',
          },
        },
      },
    },
  },
  'order-processing-system': {
    name: 'Order processing',
    container: {
      'back-end': {
        name: 'Application Back-end part',
      },
    },
  },
};
const inputWithComponent = {
  'order-support-system': {
    name: 'Name',
    container: {
      'order-support-system-foo': {
        name: 'Foo',
        component: {
          'order-support-system-foo2': {
            name: 'Foo2',
            relations: {
              to: {
                'back-end': 'posts Orders',
              },
            },
          },
        },
      },
    },
  },
  'order-processing-system': {
    name: 'Order processing',
    container: {
      'back-end': {
        name: 'Application Back-end part',
      },
    },
  },
};
const shallowMap = { 'order-support-system': ['order-processing-system'] };

it('should create map by context level (shallow type)', () => {
  const input = {
    'order-support-system': {
      name: 'Name',
      relations: {
        to: {
          'back-end': 'posts Orders',
        },
      },
    },
    'order-processing-system': {
      name: 'Order processing',
      container: {
        'back-end': {
          name: 'Application Back-end part',
        },
      },
    },
  };

  expect(createHighLevelMap(input)).toEqual(shallowMap);
});

it('should create map by context level (nested type)', () => {
  expect(createHighLevelMap(nestedInput)).toEqual(shallowMap);
  expect(createHighLevelMap(inputWithComponent)).toEqual(shallowMap);
});

it('should create map by chosen level from source', () => {
  const selectedEntity = 'order-support-system';
  const selectedScope = 'order-support-system-foo';
  const result = {
    'order-support-system-foo': ['order-processing-system'],
  };
  const secondResult = {
    'order-support-system-foo2': ['order-processing-system'],
  };

  expect(createHighLevelMap(nestedInput, null, null, selectedEntity)).toEqual(
    result,
  );
  expect(
    createHighLevelMap(inputWithComponent, null, null, selectedScope),
  ).toEqual(secondResult);
});

it('should create map by chosen level to destination', () => {
  const input = {
    'order-support-system': {
      name: 'Name',
      container: {
        'order-support-system-foo': {
          name: 'Foo',
        },
      },
    },
    'order-processing-system': {
      name: 'Order processing',
      container: {
        'back-end': {
          name: 'Application Back-end part',
          relations: {
            to: {
              'order-support-system-foo': 'posts Orders',
            },
          },
        },
      },
    },
  };
  const inputWithComponent = {
    'order-support-system': {
      name: 'Name',
      container: {
        'order-support-system-foo': {
          name: 'Foo',
          component: {
            'order-support-system-foo2': {
              name: 'Foo2',
            },
          },
        },
      },
    },
    'order-processing-system': {
      name: 'Order processing',
      container: {
        'back-end': {
          name: 'Application Back-end part',
          relations: {
            to: {
              'order-support-system-foo2': 'posts Orders',
            },
          },
        },
      },
    },
  };
  const selectedEntity = 'order-support-system';
  const selectedScope = 'order-support-system-foo';
  const result = {
    'order-processing-system': ['order-support-system-foo'],
  };
  const secondResult = {
    'order-processing-system': ['order-support-system-foo2'],
  };

  expect(createHighLevelMap(input, null, null, selectedEntity)).toEqual(result);
  expect(
    createHighLevelMap(inputWithComponent, null, null, selectedScope),
  ).toEqual(secondResult);
});

it('should create map with multiple destinations', () => {
  const input = {
    'order-support-system': {
      name: 'Name',
      container: {
        'order-support-system-foo': {
          name: 'Foo',
          component: {
            'order-support-system-foo2': {
              name: 'Foo2',
            },
            'order-support-system-foo3': {
              name: 'Foo3',
              relations: {
                to: {
                  'order-processing-system': 'Knows about that',
                },
              },
            },
          },
        },
      },
    },
    'order-processing-system': {
      name: 'Order processing',
      container: {
        'back-end': {
          name: 'Application Back-end part',
          relations: {
            to: {
              'order-support-system-foo2': 'posts Orders',
              'order-support-system-foo3': 'Order support system foo',
            },
          },
        },
      },
    },
  };
  const selectedScope = 'order-support-system-foo';
  const result = {
    'order-processing-system': [
      'order-support-system-foo2',
      'order-support-system-foo3',
    ],
    'order-support-system-foo3': ['order-processing-system'],
  };

  expect(createHighLevelMap(input, null, null, selectedScope)).toEqual(result);
});
