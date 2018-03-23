import React from 'react';
import { connect } from 'react-redux';

import BaseTrack from './BaseTrack';
import VariantFeature from '../features/VariantFeature';
import {
  setHoverEntityId,
  setClickedEntityId,
  ENTITY_TYPE,
  selectors,
} from '../redux/store';

let LeadVariantTrack = ({
  leadVariants,
  isInteractive,
  setHoverId,
  setClickedId,
  ...rest
}) => {
  const handlers = { setHoverId, setClickedId };
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <BaseTrack {...rest}>
        {leadVariants.map(d => (
          <VariantFeature
            key={d.id}
            data={d}
            {...handlers}
            highlight={d.interactive}
            dimNonHighlighted={isInteractive}
          />
        ))}
      </BaseTrack>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    leadVariants: selectors.getLeadVariantsInteractive(state),
    isInteractive: selectors.getIsInteractive(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setHoverId: entityId =>
      dispatch(
        setHoverEntityId({
          entityType: ENTITY_TYPE.LEAD_VARIANT,
          entityId,
        })
      ),
    setClickedId: entityId =>
      dispatch(
        setClickedEntityId({
          entityType: ENTITY_TYPE.LEAD_VARIANT,
          entityId,
        })
      ),
  };
};

LeadVariantTrack = connect(mapStateToProps, mapDispatchToProps)(
  LeadVariantTrack
);

export default LeadVariantTrack;
