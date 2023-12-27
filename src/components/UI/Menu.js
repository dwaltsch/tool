import React from 'react';
import './Menu.css';

const Menu = ({
  onAddNode,
  onDeleteNode,
  onDeleteButtonDisabled,
  onCreateRelationship,
  onCreateRelationshipButtonDisabled,
  onCreateAttribute,
}) => {
  return (
    <div className="menu-container">
      <h2 className="menu-title">Tool</h2>
      <div className="menu-buttons">
        <button className="menu-button blue" onClick={onAddNode}>
          Add Node
        </button>
        <button className="menu-button blue" onClick={onDeleteNode} disabled={onDeleteButtonDisabled}>
          Delete Node
        </button>
        <button
          className="menu-button blue"
          onClick={onCreateRelationship}
          disabled={onCreateRelationshipButtonDisabled}
        >
          Create Relationship
        </button>
        <button className="menu-button blue" onClick={onCreateAttribute}>
          Create Attribute
        </button>
      </div>
    </div>
  );
};

export default Menu;