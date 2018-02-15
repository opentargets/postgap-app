import React from 'react';
import { connect } from 'react-redux';
import { Card, Slider } from 'antd';

import { setFilterLD } from '../store';

let VariantLeadVariantFilter = ({ interval, setFilterLD }) => {
  return (
    <Card title="V2LeadV Filter">
      <h4>
        Linkage Disequilibrium (r<sup>2</sup>)
      </h4>
      <Slider
        range
        min={0.7}
        max={1}
        marks={{ 0.7: 0.7, 0.8: 0.8, 0.9: 0.9, 1: 1 }}
        step={0.001}
        defaultValue={interval}
        onChange={value => {
          console.log(value);
          setFilterLD(value);
        }}
      />
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    interval: state.filters.ld
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFilterLD: interval => dispatch(setFilterLD(interval))
  };
};

VariantLeadVariantFilter = connect(mapStateToProps, mapDispatchToProps)(
  VariantLeadVariantFilter
);

export default VariantLeadVariantFilter;