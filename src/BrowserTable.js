import React from 'react';
import { connect } from 'react-redux';

import EvidenceTable from './EvidenceTable';
import { selectors } from './redux/store';

const mapStateToProps = state => {
  return {
    rows: selectors.getRowsFiltered(state)
  };
};

const BrowserTable = connect(mapStateToProps)(EvidenceTable);

export default BrowserTable;
