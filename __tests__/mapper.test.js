import { createHighLevelMap } from '../utils/mapper';

it('should create map by context level', () => {
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
