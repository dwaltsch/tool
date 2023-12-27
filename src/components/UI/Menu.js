import React from 'react';

const Menu = ({
  onAddNode,
  onDeleteNode,
  onDeleteButtonDisabled,
  onCreateRelationship,
  onCreateRelationshipButtonDisabled,
  onCreateAttribute,
}) => {
  return (
    <div>
      <button onClick={onAddNode}>Add Node</button>
      <button onClick={onDeleteNode} disabled={onDeleteButtonDisabled}>
        Delete Node
      </button>
      <button onClick={onCreateRelationship} disabled={onCreateRelationshipButtonDisabled}>
        Create Relationship
      </button>
      <button onClick={onCreateAttribute}>Create Attribute</button>
    </div>
  );
};

export default Menu;