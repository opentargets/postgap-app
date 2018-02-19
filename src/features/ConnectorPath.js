import React from 'react';

const ConnectorPath = ({
  topX,
  topY,
  bottomX,
  bottomY,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const controlY = (bottomY + topY) / 2;
  const d = `M${topX},${topY} C${topX},${controlY}, ${bottomX},${controlY} ${bottomX},${bottomY}`;
  const handlers = { onClick, onMouseEnter, onMouseLeave };
  return (
    <path
      d={d}
      style={{ stroke: 'grey', strokeWidth: 1, fill: 'none' }}
      {...handlers}
    />
  );
};

export default ConnectorPath;
