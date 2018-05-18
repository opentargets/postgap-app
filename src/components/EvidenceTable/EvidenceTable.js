import React from 'react';
import { Table, Col, Row, Icon } from 'antd';

import {
    commaSeparate,
    renderNonZeroField,
    renderNullableField,
    renderGtexField,
    renderVEPField,
    renderVEPTermsField,
} from '../../stringFormatters';
import { colors } from '../../theme';
import {
    LinksGene,
    LinksVariant,
    LinksLeadVariant,
    LinksDisease,
} from '../../links';
import DictionaryHelpTerm from '../../terms/DictionaryHelpTerm';

const renderIntField = value => commaSeparate(value);
const renderVariantField = value => (
    <LinksVariant vId={value}>{value}</LinksVariant>
);

const renderLeadVariantField = value => (
    <LinksLeadVariant lvId={value}>{value}</LinksLeadVariant>
);
const renderGeneField = (value, row) => (
    <LinksGene geneName={value} geneId={row.geneId}>
        {value}
    </LinksGene>
);
const renderDiseaseField = (value, row) => (
    <LinksDisease efoId={row.efoId}>
        <span style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {value}
        </span>
    </LinksDisease>
);
const renderPubmedUrlField = (value, row) => (
    <a href={value} target={'_blank'}>
        <Icon type="link" />
    </a>
);

const COLUMNS = [
    {
        title: 'Entities',
        children: [
            {
                title: 'Gene',
                dataIndex: 'geneSymbol',
                key: 'geneSymbol',
                fixed: 'left',
                render: renderGeneField,
                width: 100,
            },
            {
                title: 'Variant',
                dataIndex: 'vId',
                key: 'vId',
                fixed: 'left',
                render: renderVariantField,
                width: 100,
            },
            {
                title: 'Lead Variant',
                dataIndex: 'lvId',
                key: 'lvId',
                fixed: 'left',
                render: renderLeadVariantField,
                width: 120,
            },
            {
                title: 'Disease',
                dataIndex: 'efoName',
                key: 'efoName',
                fixed: 'left',
                render: renderDiseaseField,
                width: 220,
            },
        ],
    },
    {
        title: 'Gene - Variant',
        children: [
            {
                title: (
                    <DictionaryHelpTerm
                        term={'otg2vscore'}
                        label={'G2V Score'}
                    />
                ),
                dataIndex: 'otG2VScore',
                key: 'otG2VScore',
                render: renderNonZeroField,
                width: 120,
            },
            {
                title: (
                    <DictionaryHelpTerm
                        term={'otg2vreason'}
                        label={'G2V Reason'}
                    />
                ),
                dataIndex: 'otG2VReason',
                key: 'otG2VReason',
                width: 120,
            },
            {
                title: <DictionaryHelpTerm term={'vep'} label={'VEP'} />,
                dataIndex: 'vep',
                key: 'vep',
                render: renderVEPField,
                width: 100,
            },
            {
                title: (
                    <DictionaryHelpTerm
                        term={'vepterms'}
                        label={'VEP Consequences'}
                    />
                ),
                dataIndex: 'vepTerms',
                key: 'vepTerms',
                render: renderVEPTermsField,
                width: 180,
            },
            {
                title: <DictionaryHelpTerm term={'gtex'} label={'GTEx'} />,
                dataIndex: 'gtex',
                key: 'gtex',
                render: renderGtexField,
                width: 100,
            },
            {
                title: <DictionaryHelpTerm term={'pchic'} label={'PCHiC'} />,
                dataIndex: 'pchic',
                key: 'pchic',
                render: renderNonZeroField,
                width: 100,
            },
            {
                title: <DictionaryHelpTerm term={'dhs'} label={'DHS'} />,
                dataIndex: 'dhs',
                key: 'dhs',
                render: renderNonZeroField,
                width: 100,
            },
            {
                title: (
                    <DictionaryHelpTerm term={'fantom5'} label={'Fantom5'} />
                ),
                dataIndex: 'fantom5',
                key: 'fantom5',
                render: renderNonZeroField,
                width: 100,
            },
        ],
    },
    {
        title: 'Variant - Lead Variant',
        children: [
            {
                title: (
                    <DictionaryHelpTerm
                        term={'r2'}
                        label={
                            <span>
                                LD (r<sup>2</sup>)
                            </span>
                        }
                    />
                ),
                dataIndex: 'r2',
                key: 'r2',
                render: renderNullableField,
                width: 100,
            },
        ],
    },
    {
        title: 'Lead Variant - Disease',
        children: [
            {
                title: (
                    <DictionaryHelpTerm term={'gwaspvalue'} label={'p-value'} />
                ),
                dataIndex: 'gwasPValue',
                key: 'gwasPValue',
                render: renderNullableField,
                width: 100,
            },
            {
                title: (
                    <DictionaryHelpTerm
                        term={'gwasoddsratio'}
                        label={'Odds Ratio'}
                    />
                ),
                dataIndex: 'gwasOddsRatio',
                key: 'gwasOddsRatio',
                render: renderNullableField,
                width: 100,
            },
            {
                title: (
                    <DictionaryHelpTerm
                        term={'gwassamplesize'}
                        label={
                            <React.Fragment>
                                <span>Sample</span>
                                <br />
                                <span>Size</span>
                            </React.Fragment>
                        }
                    />
                ),
                dataIndex: 'gwasSize',
                key: 'gwasSize',
                render: renderIntField,
                width: 100,
            },
            {
                title: 'Literature',
                dataIndex: 'gwasPMId',
                key: 'gwasPMId',
                render: renderPubmedUrlField,
                width: 100,
            },
        ],
    },
];

class EvidenceTable extends React.Component {
    render() {
        const {
            rows,
            loading,
            pagination,
            onChange,
            csvDownload,
            tsvDownload,
        } = this.props;
        const loadingConfig = {
            size: 'large',
            indicator: (
                <Icon
                    type="loading"
                    style={{ fontSize: 20, color: colors.primary, padding: 10 }}
                />
            ),
            spinning: true,
        };
        let loadingProp = {};
        if (loading) {
            loadingProp = { loading: loadingConfig };
        }

        return (
            <Col>
                <Row align="right" style={{ paddingBottom: '5px' }}>
                    <Col align="right">
                        {csvDownload}
                        {tsvDownload}
                    </Col>
                </Row>
                <Table
                    dataSource={rows}
                    columns={COLUMNS}
                    size="small"
                    bordered
                    scroll={{ x: 2300 }}
                    rowKey={d => d.index}
                    pagination={pagination}
                    onChange={onChange}
                    {...loadingProp}
                />
            </Col>
        );
    }
}

export default EvidenceTable;