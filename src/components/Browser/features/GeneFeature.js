import React from 'react';

import { colors } from '../../../theme';

class GeneFeature extends React.Component {
    constructor(props) {
        super(props);
        this.state = { textWidth: null };
    }
    componentDidMount() {
        const box = this.text.getBBox();
        this.setState({ textWidth: box.width, textBottom: box.y + box.height });
    }
    componentDidUpdate() {
        const box = this.text.getBBox();
        if (box.width !== this.state.textWidth) {
            this.setState({
                textWidth: box.width,
                textBottom: box.y + box.height,
            });
        }
    }
    render() {
        const {
            scale,
            data,
            slotOffset,
            slotHeight,
            setClicked,
            highlight,
            dimNonHighlighted,
        } = this.props;
        const { x } = scale;
        const { textWidth, textBottom } = this.state;
        const margin = 3;

        const exonHeight = slotHeight * 0.25;
        const yExonTop = 0;
        const ySpit = exonHeight / 2;
        const yText = slotHeight * 0.62;
        const geneColor = highlight
            ? colors.secondary
            : dimNonHighlighted ? 'lightgrey' : colors.primary;
        const backgroundColor = highlight
            ? '#eee'
            : dimNonHighlighted ? 'white' : '#eee';
        const textColor = highlight
            ? 'black'
            : dimNonHighlighted ? 'lightgrey' : 'black';
        const spitWidth = x(data.end) - x(data.start);
        const backgroundWidth = Math.max(textWidth, spitWidth);
        const backgroundHeight = textBottom - 3 - yExonTop;

        const spit = (
            <line
                x1={x(data.start)}
                y1={ySpit}
                x2={x(data.end)}
                y2={ySpit}
                style={{
                    stroke: geneColor,
                    strokeWidth: 1,
                    pointerEvents: 'none',
                }}
            />
        );
        const exons = data.exons.map(([start, end], i) => (
            <rect
                key={i}
                x={x(start)}
                y={yExonTop}
                width={x(end) - x(start)}
                height={exonHeight}
                style={{
                    stroke: geneColor,
                    strokeWidth: 1,
                    fill: 'white',
                    pointerEvents: 'none',
                }}
            />
        ));
        const label = (
            <text
                ref={t => {
                    this.text = t;
                }}
                x={x(data.start)}
                y={yText}
                style={{
                    fill: textColor,
                    fontSize: '12px',
                    pointerEvents: 'none',
                }}
            >
                {data.forwardStrand ? `${data.symbol}>` : `<${data.symbol}`}
            </text>
        );
        const background = textWidth ? (
            <rect
                style={{ fill: backgroundColor, stroke: geneColor }}
                x={x(data.start) - margin}
                y={yExonTop - margin}
                width={backgroundWidth + 2 * margin}
                height={backgroundHeight + 2 * margin}
                rx={2}
                ry={2}
                onClick={() => {
                    setClicked(data.id, 'gene');
                }}
            />
        ) : null;
        return (
            <g transform={`translate(0,${slotOffset})`}>
                {background}
                {spit}
                {exons}
                {label}
            </g>
        );
    }
}

export default GeneFeature;
