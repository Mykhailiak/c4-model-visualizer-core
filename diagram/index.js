import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import style from './styles';
import { bindRegistriesBySelectedLevel } from '../utils/registries';

cytoscape.use(dagre);

class DiagramVisualizer {
  constructor(
    levels,
    getSuitableLevelKey,
    { containerId, onClick, ...config },
  ) {
    this.levels = levels;
    this.getSuitableLevelKey = getSuitableLevelKey;
    this.layout = { name: 'dagre' };
    this.cy = cytoscape({
      style,
      maxZoom: 6,
      minZoom: 1,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autounselectify: true,
      container: document.getElementById(containerId),
      elements: [],
      layout: this.layout,
      ...config,
    });

    this.cy.on('click', 'node', onClick);
  }

  update(context, selectedPath, selectedLevel) {
    const nodes = this.computeElements(context, selectedPath);
    const availableNodes = nodes.map((n) => n.data.id);
    const edges = this.computeEdges(context, availableNodes);
    const elements = nodes.concat(edges);

    this.cy.json({ elements });
    this.cy.ready(() => this.cy.layout(this.layout).run());
    this.fitViewport(selectedLevel);
  }

  fitViewport(selectedLevel) {
    if (selectedLevel) {
      this.cy.fit(`#${selectedLevel}`);
    }
  }

  computeEdges(context, availableNodes) {
    const relations = bindRegistriesBySelectedLevel(context, availableNodes);

    return relations.map((r) => ({
      data: {
        target: r.target,
        source: r.key,
        id: `${r.key}_${r.target}`,
        name: r.description,
      },
    }));
  }

  computeElements(
    context = {},
    selectedPath,
    level = 0,
    parent,
    selectionPath = this.levels[0],
  ) {
    const keys = Object.keys(context);

    return keys.reduce((acc, key) => {
      let groups = [];
      const node = context[key];
      const name = node.name || key;
      const selectionId = `${selectionPath}:${key}`;
      const nodeContextKey = this.getSuitableLevelKey(node, level + 1);
      const visibleNode = selectedPath.includes(key);
      const hasChild = Boolean(nodeContextKey);

      if (hasChild && visibleNode) {
        groups = this.computeElements(
          node[nodeContextKey],
          selectedPath,
          level + 1,
          key,
          selectionId,
        );
      }

      return acc
        .concat({
          data: {
            name,
            parent,
            hasChild,
            selectionId,
            id: key,
          },
        })
        .concat(groups);
    }, []);
  }
}

export default DiagramVisualizer;
