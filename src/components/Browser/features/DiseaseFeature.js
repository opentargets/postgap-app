import React from 'react';
import Text from 'react-svg-text';
import * as d3 from 'd3';
import _ from 'lodash';

import { colors } from '../../../theme';
import DiseaseVerticalFeature from './DiseaseVerticalFeature';

const PADDING = 0.1; // 10%
const calculateDiseaseScaleRange = width => [
    width * PADDING,
    width * (1 - PADDING),
];

export class DebouncedDiseaseFeatureSet extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { diseases, width } = this.props;
        return (
            !_.isEqual(
                diseases.map(d => d.id),
                nextProps.diseases.map(d => d.id)
            ) ||
            !_.isEqual(
                diseases.map(d => d.selected),
                nextProps.diseases.map(d => d.selected)
            ) ||
            width !== nextProps.width
        );
    }
    render() {
        const {
            diseases,
            diseaseScale,
            verticalScale,
            width,
            setClicked,
            dimNonHighlighted,
        } = this.props;
        diseaseScale.range(calculateDiseaseScaleRange(width));
        return (
            <React.Fragment>
                {diseases.map(d => {
                    const x = diseaseScale(d.name);
                    const y = verticalScale(d.name) + 10;
                    return (
                        <DiseaseVerticalFeature
                            key={d.id}
                            data={d}
                            x={x}
                            y={y}
                            dimNonHighlighted={dimNonHighlighted}
                        />
                    );
                })}
                {diseases.map(d => {
                    const x = diseaseScale(d.name);
                    const y = verticalScale(d.name);
                    return (
                        <DiseaseFeature
                            key={d.id}
                            data={d}
                            x={x}
                            y={y}
                            setClicked={setClicked}
                            dimNonHighlighted={dimNonHighlighted}
                        />
                    );
                })}
            </React.Fragment>
        );
    }
}

class DiseaseFeature extends React.Component {
    constructor(props) {
        super(props);
        this.state = { textWidth: null };
    }
    componentDidMount() {
        const textHeight =
            12 * (this[this.props.data.id].state.wordsByLines.length + 1);
        const textWidth = d3.max(
            this[this.props.data.id].state.wordsByLines,
            d => d.width
        );
        this.setState({ textWidth, textHeight });
    }
    componentDidUpdate() {
        const textHeight =
            12 * (this[this.props.data.id].state.wordsByLines.length + 1);
        const textWidth = d3.max(
            this[this.props.data.id].state.wordsByLines,
            d => d.width
        );
        if (textWidth !== this.state.textWidth) {
            this.setState({ textWidth, textHeight });
        }
    }
    render() {
        const { x, y, data, dimNonHighlighted, setClicked } = this.props;
        const { textWidth, textHeight } = this.state;
        const margin = 3;

        const diseaseColor = data.selected
            ? colors.secondary
            : dimNonHighlighted ? 'lightgrey' : colors.primary;
        const backgroundColor = data.selected
            ? '#eee'
            : dimNonHighlighted ? 'white' : '#eee';
        const textColor = data.selected
            ? 'black'
            : dimNonHighlighted ? 'lightgrey' : 'black';

        const point = (
            <circle
                cx={0}
                cy={10}
                r={3}
                style={{
                    stroke: diseaseColor,
                    strokeWidth: 1.5,
                    fill: 'white',
                    pointerEvents: 'none',
                }}
            />
        );
        const label = (
            <Text
                ref={t => {
                    this[this.props.data.id] = t;
                }}
                x={0}
                y={14}
                width={120}
                textAnchor="middle"
                verticalAnchor="start"
                style={{
                    fill: textColor,
                    fontSize: '12px',
                    pointerEvents: 'none',
                }}
            >
                {data.name}
            </Text>
        );
        const background = textWidth ? (
            <rect
                style={{ fill: backgroundColor, stroke: diseaseColor }}
                x={-textWidth / 2 - margin}
                y={14 - margin}
                width={textWidth + 2 * margin}
                height={textHeight - 8}
                rx={2}
                ry={2}
                onClick={() => {
                    setClicked(data.id, 'disease');
                }}
            />
        ) : null;
        return (
            <g transform={`translate(${x},${y})`}>
                {background}
                {point}
                {label}
            </g>
        );
    }
}

export default DiseaseFeature;
