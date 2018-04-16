import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import queryString from 'query-string';

import Browser from '../Browser';
// import BrowserTable from '../BrowserTable';
import VariantLeadVariantFilter from '../filters/VariantLeadVariantFilter';
import DetailPanel from '../DetailPanel';
// import LeadVariantDiseaseFilter from '../filters/LeadVariantDiseaseFilter';
import GeneVariantFilter from '../filters/GeneVariantFilter';

class LocusPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filtersVisible: true };
    this.toggleFilters = this.toggleFilters.bind(this);
    this.setFilterOtG2VScoreInUrl = this.setFilterOtG2VScoreInUrl.bind(this);
    this.setFilterOtG2VMustHavesInUrl = this.setFilterOtG2VMustHavesInUrl.bind(
      this
    );
    this.setFilterLDInUrl = this.setFilterLDInUrl.bind(this);
  }

  toggleFilters() {
    this.setState({ filtersVisible: !this.state.filtersVisible });
  }

  setFilterOtG2VScoreInUrl(interval) {
    const history = this.props.history;
    const oldQueryParams = queryString.parse(history.location.search);
    const newQueryParams = queryString.stringify({
      ...oldQueryParams,
      otG2VScoreStart: interval[0],
      otG2VScoreEnd: interval[1],
    });
    history.replace({
      ...history.location,
      search: newQueryParams,
    });
  }

  setFilterOtG2VMustHavesInUrl(mustHaves) {
    const history = this.props.history;
    const oldQueryParams = queryString.parse(history.location.search);
    const newQueryParams = queryString.stringify({
      ...oldQueryParams,
      otG2VMustHaves: mustHaves,
    });
    history.replace({
      ...history.location,
      search: newQueryParams,
    });
  }

  setFilterLDInUrl(interval) {
    const history = this.props.history;
    const oldQueryParams = queryString.parse(history.location.search);
    const newQueryParams = queryString.stringify({
      ...oldQueryParams,
      ldStart: interval[0],
      ldEnd: interval[1],
    });
    history.replace({
      ...history.location,
      search: newQueryParams,
    });
  }

  render() {
    const query = queryString.parse(this.props.location.search);
    const { chromosome } = query;
    const start = parseInt(query.start);
    const end = parseInt(query.end);
    const filename = `POSTGAP-locus.${chromosome}.${start}-${end}`;
    const filterOtG2VScore = [
      query.otG2VScoreStart ? parseFloat(query.otG2VScoreStart) : 0,
      query.otG2VScoreEnd ? parseFloat(query.otG2VScoreEnd) : 1,
    ];
    const filterOtG2VMustHaves = query.otG2VMustHaves
      ? typeof query.otG2VMustHaves === 'string'
        ? [query.otG2VMustHaves]
        : query.otG2VMustHaves
      : [];
    const filterLD = [
      query.ldStart ? parseFloat(query.ldStart) : 0.7,
      query.ldEnd ? parseFloat(query.ldEnd) : 1,
    ];
    return (
      <div style={{ padding: '30px' }}>
        <Col gutter={6}>
          {this.state.filtersVisible ? (
            <Card bodyStyle={{ background: 'white', padding: '2px' }}>
              <Row style={{ padding: '10px 10px 0px 10px' }}>
                <Col span={16}>
                  <h4>Filters </h4>
                </Col>
                <Col span={8}>
                  <Button
                    style={{ float: 'right' }}
                    icon="close"
                    type="primary"
                    shape="circle"
                    size="small"
                    ghost
                    onClick={this.toggleFilters}
                  />
                </Col>
              </Row>
              <Row gutter={2}>
                <Col span={12}>
                  <GeneVariantFilter
                    interval={filterOtG2VScore}
                    setFilterG2VScore={this.setFilterOtG2VScoreInUrl}
                    g2VMustHaves={filterOtG2VMustHaves}
                    setFilterG2VMustHaves={this.setFilterOtG2VMustHavesInUrl}
                  />
                </Col>
                <Col span={6}>
                  <VariantLeadVariantFilter
                    interval={filterLD}
                    setFilterLD={this.setFilterLDInUrl}
                  />
                </Col>
                {/* <Col span={6}>
                  <LeadVariantDiseaseFilter />
                </Col> */}
              </Row>
            </Card>
          ) : (
            <Button type="primary" ghost onClick={this.toggleFilters}>
              Filters
            </Button>
          )}

          <Row gutter={16} style={{ height: '16px' }} />

          <Row gutter={16}>
            <Col span={18}>
              <Browser filename={filename} filterString={'todo'} />
            </Col>
            <Col span={6}>
              <DetailPanel />
            </Col>
          </Row>

          <Row gutter={16} style={{ height: '16px' }} />

          {/* <Row gutter={16}>
            <Col span={24}>
              <Card bodyStyle={{ padding: 10 }}>
                <BrowserTable
                  filename={filename}
                  filterString={this.props.filterString}
                />
              </Card>
            </Col>
          </Row> */}
        </Col>
      </div>
    );
  }
}

export default LocusPage;
