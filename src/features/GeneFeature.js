import React from 'react';

const GeneFeature = ({
  scale,
  data,
  slotOffset,
  slotHeight,
  setHoverGene,
  setClickedGene,
  highlight,
  dimNonHighlighted,
}) => {
  const { x } = scale;

  const exonHeight = slotHeight * 0.4;
  const yExonTop = 0;
  const ySpit = exonHeight / 2;
  const yText = slotHeight * 0.85;
  const geneColor = highlight
    ? 'red'
    : dimNonHighlighted ? 'lightgrey' : 'blue';

  const spit = (
    <line
      x1={x(data.canonicalTranscript.start)}
      y1={ySpit}
      x2={x(data.canonicalTranscript.end)}
      y2={ySpit}
      style={{ stroke: geneColor, strokeWidth: 1 }}
    />
  );
  const exons = data.canonicalTranscript.exons.map(d => (
    <rect
      key={d.id}
      x={x(d.start)}
      y={yExonTop}
      width={x(d.end) - x(d.start)}
      height={exonHeight}
      style={{ stroke: geneColor, strokeWidth: 1, fill: 'white' }}
    />
  ));
  const label = (
    <text
      x={x(data.canonicalTranscript.start)}
      y={yText}
      onMouseEnter={() => {
        setHoverGene(data);
      }}
      onMouseLeave={() => {
        setHoverGene(null);
      }}
      onClick={() => {
        setClickedGene(data);
      }}
    >
      {data.strand === 1 ? `${data.name}>` : `<${data.name}`}
    </text>
  );

  return (
    <g transform={`translate(0,${slotOffset})`}>
      {spit}
      {exons}
      {label}
    </g>
  );
};

export default GeneFeature;
