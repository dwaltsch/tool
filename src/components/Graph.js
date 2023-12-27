import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import Menu from './UI/Menu';

const Graph = () => {
  const networkRef = useRef(null);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleAddNode = () => {
    const { nodes } = networkRef.current.body.data;
    const existingIds = nodes.getIds();
    let newNodeId = 1;
    while (existingIds.includes(newNodeId)) {
      newNodeId++;
    }
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
      setSelectedNodes([]); // Reset selected nodes after creating the relationship
    }
  };

  const handleCreateAttribute = () => {
    const { nodes, edges } = networkRef.current.body.data;
  
    if (selectedNodes.length === 1) {
      const entityId = selectedNodes[0];
      const attributeIds = nodes
        .getIds()
        .filter((id) => typeof id === 'string' && id.startsWith('attribute'));
  
      const maxAttributeId =
        attributeIds.length > 0
          ? Math.max(...attributeIds.map((id) => parseInt(id.replace('attribute', ''), 10)))
          : 0;
  
      const newAttributeNodeId = `attribute${maxAttributeId + 1}`;
  
      nodes.add({ id: newAttributeNodeId, label: 'Attribute', shape: 'box' });
      edges.add({ from: entityId, to: newAttributeNodeId });
    }
  };
  
  
  useEffect(() => {
    const container = document.getElementById('network');
    const data = { nodes: new DataSet(), edges: new DataSet() };
    const options = {
      physics: {
        enabled: true,
        stabilization: {
          enabled: true,
          iterations: 1000,
        },
        barnesHut: {
          gravitationalConstant: -10000,
          centralGravity: 0.5,
          springLength: 150,
          springConstant: 0.08,
          damping: 0.5,
          avoidOverlap: 0.5,
        },
      },
    };
  
    const network = new Network(container, data, options);
    networkRef.current = network;
  
    let clickedNodes = [];
    let clickedEdge = null;
  
    network.on('click', (params) => {
      const nodeId = params.nodes[0];
      const edgeId = params.edges[0];
  
      if (nodeId !== undefined) {
        clickedNodes.push(nodeId);
        clickedNodes = clickedNodes.slice(-2);
        setSelectedNodes(clickedNodes);
      }
  
      if (edgeId !== undefined) {
        clickedEdge = edgeId;
      }
    });
  
    network.on('doubleClick', (params) => {
      const edgeId = params.edges[0];
  
      if (edgeId !== undefined && edgeId === clickedEdge) {
        const { edges } = networkRef.current.body.data;
        const currentLabel = edges.get(edgeId).label;
        const newLabel = prompt('Enter label for the relationship:', currentLabel || '');
  
        if (newLabel !== null) {
          edges.update({ id: edgeId, label: newLabel });
        }
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
     <div id="network" style={{ width: '100%', height: '79.5vh' }} />
    </div>
  );
};

export default Graph;