import React from 'react';
import Text from 'react-svg-text';

const PADDING = 0.2; // 20%
const calculateDiseaseScaleRange = width => [
  width * PADDING,
  width * (1 - PADDING)
];

const DiseaseFeature = ({
  scale,
  data,
  diseaseScale,
  width,
  setHover,
  setClicked
}) => {
  const { y } = scale;
  diseaseScale.range(calculateDiseaseScaleRange(width)); // TODO: refactor to set range in better location
  return (
    <g>
      <circle
        cx={diseaseScale(data.efoId)}
        cy={y(0.7)}
        r={4}
        style={{ stroke: 'blue', strokeWidth: 2, fill: 'lightgrey' }}
        onMouseEnter={() => {
          setHover(data);
        }}
        onMouseLeave={() => {
          setHover(null);
        }}
        onClick={() => {
          setClicked(data);
        }}
      />
      <Text
        x={diseaseScale(data.efoId)}
        y={y(0.7) + 10}
        width={150}
        textAnchor="middle"
        verticalAnchor="start"
        style={{ fontSize: '12px' }}
      >
        {data.efoName}
      </Text>
    </g>
  );
};

export default DiseaseFeature;
