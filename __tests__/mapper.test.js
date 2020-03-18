import { createHighLevelMap } from '../utils/mapper';

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
  const result = { 'order-support-system': ['order-processing-system'] };

  expect(createHighLevelMap(input)).toEqual(result);
});

it('should create map by context level (nested type)', () => {
  const input = {
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
  const inputSecondOption = {
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
  const result = { 'order-support-system': ['order-processing-system'] };

  expect(createHighLevelMap(input)).toEqual(result);
  expect(createHighLevelMap(inputSecondOption)).toEqual(result);
});

it('should create map by chosen level', () => {
  const input = {
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
  const inputSecondOption = {
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
  const selectedEntity = 'order-support-system';
  const secondSelectedEntity = 'order-support-system-foo';
  const result = {
    'order-support-system-foo': ['order-processing-system'],
  };
  const secondResult = {
    'order-support-system-foo2': ['order-processing-system'],
  };

  expect(createHighLevelMap(input, null, null, selectedEntity)).toEqual(result);
  expect(
    createHighLevelMap(inputSecondOption, null, null, secondSelectedEntity),
  ).toEqual(secondResult);
});
