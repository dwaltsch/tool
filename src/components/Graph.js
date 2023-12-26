import React, { useEffect } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

const Graph = () => {
  useEffect(() => {
    const nodes = new DataSet([
      { id: 1, label: 'Hallo' },
      { id: 2, label: 'Welt' },
    ]);

    const edges = new DataSet([
      { from: 1, to: 2 },
    ]);
    const container = document.getElementById('network');

    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
      },
      edges: {
        width: 2,
      },
    };

    const network = new Network(container, { nodes, edges }, options);
    return () => {
      network.destroy();
    };
  }, []);

  return <div id="network" style={{ width: '100%', height: '400px' }} />;
};

export default Graph;