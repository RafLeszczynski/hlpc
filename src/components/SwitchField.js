import React from 'react';

export default ({ id, label, handleChange, value }) => {
  return (
    <div className="ui-switch">
      <strong className="color-black">{label}</strong>
      <input
        name={id}
        type="checkbox"
        checked={value}
        onChange={handleChange}
      />
      <label htmlFor={id} className="status" />
    </div>
  );
};
