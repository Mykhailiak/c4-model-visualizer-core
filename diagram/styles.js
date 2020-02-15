export default [
  {
    selector: 'node',
    style: {
      width: 70,
      label: 'data(name)',
      shape: 'round-rectangle',
      'font-size': 5,
      'text-max-width': 70,
      'text-valign': 'center',
      'background-color': '#b3c2d8',
      'text-wrap': 'ellipsis',
    },
  },
  {
    selector: ':parent',
    style: {
      'background-color': '#fff',
      'background-opacity': 0.3,
      'text-valign': 'top',
      'text-halign': 'center',
      'border-style': 'dashed',
      'text-margin-y': -3,
    },
  },
  {
    selector: 'edge',
    style: {
      width: 4,
      label: 'data(name)',
      'font-size': 4,
      'text-background-color': '#fff',
      'text-background-padding': 3,
      'text-background-opacity': 0.8,
      'text-background-shape': 'round-rectangle',

      'target-arrow-shape': 'triangle',
      'line-color': '#cdd6e4',
      'target-arrow-color': '#cdd6e4',
      'curve-style': 'straight',
      'line-cap': 'square',
    },
  },
];
