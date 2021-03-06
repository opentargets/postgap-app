import React from 'react';

import BaseTrack from './BaseTrack';
import GeneFeature from '../features/GeneFeature';
import GeneVerticalFeature from '../features/GeneVerticalFeature';

export const GENE_SLOT_HEIGHT = 30;
export const GENE_TRACK_PADDING = 5;

let GeneTrack = props => {
    const height =
        GENE_SLOT_HEIGHT * props.slots.length + 2 * GENE_TRACK_PADDING;
    const { isInSelectedState, setClicked } = props;
    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <BaseTrack {...props} parentHeight={height}>
                {props.slots.map((slot, i) => {
                    return slot.genes.map(gene => (
                        <GeneVerticalFeature
                            key={gene.id}
                            data={gene}
                            slotOffset={
                                GENE_SLOT_HEIGHT * i + GENE_TRACK_PADDING
                            }
                            slotHeight={GENE_SLOT_HEIGHT}
                            trackHeight={height}
                            highlight={gene.selected}
                            dimNonHighlighted={isInSelectedState}
                        />
                    ));
                })}
                {props.slots.map((slot, i) => {
                    return slot.genes.map(gene => {
                        return (
                            <GeneFeature
                                key={gene.id}
                                data={gene}
                                slotOffset={
                                    GENE_SLOT_HEIGHT * i + GENE_TRACK_PADDING
                                }
                                slotHeight={GENE_SLOT_HEIGHT}
                                setClicked={setClicked}
                                highlight={gene.selected}
                                dimNonHighlighted={isInSelectedState}
                            />
                        );
                    });
                })}
            </BaseTrack>
        </div>
    );
};

export default GeneTrack;
