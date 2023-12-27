import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import Menu from './UI/Menu';

const Graph = () => {
  const networkRef = useRef(null);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleAddNode = () => {
  const { nodes } = networkRef.current.body.data;
  const nodeIds = nodes.getIds();
  const maxId = nodeIds.length > 0 ? Math.max(...nodeIds) : 0;
  const newNodeId = maxId + 1;
  nodes.add({ id: newNodeId, label: `Test ${newNodeId}` });
};

  const handleDoubleClick = (event) => {
    const nodeId = event.nodes[0];
    if (nodeId !== undefined) {
      const newName = prompt('Enter new name for the node:');
      if (newName !== null && newName !== '') {
        const { nodes } = networkRef.current.body.data;
        nodes.update({ id: nodeId, label: newName });
      }
    }
  };

  const handleDeleteNode = () => {
    if (selectedNodes.length > 0) {
      const { nodes } = networkRef.current.body.data;
      nodes.remove(selectedNodes);
      setSelectedNodes([]);
    }
  };

  const handleCreateRelationship = () => {
    if (selectedNodes.length === 2) {
      const { edges } = networkRef.current.body.data;
      const newEdgeId = edges.length > 0 ? Math.max(...edges.getIds()) + 1 : 1;
      edges.add({ id: newEdgeId, from: selectedNodes[0], to: selectedNodes[1], label: '' });
      setSelectedNodes([]);
    }
  };

  const handleCreateAttribute = () => {
    const { nodes, edges } = networkRef.current.body.data;
  
    if (selectedNodes.length === 1) {
      const nodeIds = nodes.getIds().map(String);
      const attributeIds = nodeIds.filter(id => id.startsWith('attribute'));
  
      let maxAttributeId = 0;
      if (attributeIds.length > 0) {
        maxAttributeId = Math.max(...attributeIds.map(id => parseInt(id.replace('attribute', ''), 10)));
      }
  
      const entityId = selectedNodes[0];
      const newAttributeNodeId = `attribute${maxAttributeId + 1}`;
  
      nodes.add({ id: newAttributeNodeId, label: 'Attribute', shape: 'box' });
      edges.add({ from: entityId, to: newAttributeNodeId });
    }
  };
  

  useEffect(() => {
    const container = document.getElementById('network');
    const data = { nodes: new DataSet(), edges: new DataSet() };
    const options = {};

    const network = new Network(container, data, options);
    networkRef.current = network;

    network.on('click', (params) => {
      const nodeId = params.nodes[0];
      if (nodeId !== undefined) {
        setSelectedNodes([nodeId]);
      }
    });

    network.on('doubleClick', handleDoubleClick);

    return () => {
      network.off('click');
      network.off('doubleClick', handleDoubleClick);
      network.destroy();
    };
  }, []);

  return (
    <div>
      <Menu
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onDeleteButtonDisabled={selectedNodes.length === 0}
        onCreateRelationship={handleCreateRelationship}
        onCreateRelationshipButtonDisabled={selectedNodes.length !== 2}
        onCreateAttribute={handleCreateAttribute}
      />
     <div id="network" style={{ width: '100%', height: '95.8vh' }} />
    </div>
  );
};

export default Graph;