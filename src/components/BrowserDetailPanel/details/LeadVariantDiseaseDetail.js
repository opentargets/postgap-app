import React from 'react';
import { Table } from 'antd';

import BaseDetail from './BaseDetail';
import DictionaryTerm from '../../DictionaryTerm/DictionaryTerm';
import { LinksLeadVariant, LinksDisease } from '../../../utils/linkFormatters';
import { commaSeparate } from '../../../utils/stringFormatters';

const LeadVariantDiseaseDetail = ({ leadVariantDisease, closeHandler }) => {
    const d = leadVariantDisease;
    const tableData = [
        {
            key: 'gwasPValue',
            label: 'p-value',
            value: d.gwasPValue,
        },
        {
            key: 'gwasOddsRatio',
            label: 'Odds Ratio',
            value: d.gwasOddsRatio,
        },
        {
            key: 'gwasSampleSize',
            label: 'Sample Size',
            value: commaSeparate(d.gwasSize),
        },
    ];
    const tableColumns = [
        {
            key: 'label',
            title: 'Label',
            dataIndex: 'label',
            width: 100,
            render: (text, row) => (
                <DictionaryTerm term={row.key} label={row.label} />
            ),
        },
        {
            key: 'value',
            title: 'Value',
            dataIndex: 'value',
            width: 100,
        },
    ];
    return (
        <BaseDetail
            type={'Lead Variant - Disease'}
            title={
                <React.Fragment>
                    <LinksLeadVariant lvId={leadVariantDisease.lvId}>
                        {leadVariantDisease.lvId}
                    </LinksLeadVariant>
                    {' - '}
                    <LinksDisease efoId={leadVariantDisease.efoId}>
                        {leadVariantDisease.efoName}
                    </LinksDisease>
                </React.Fragment>
            }
            closeHandler={closeHandler}
        >
            <Table
                dataSource={tableData}
                columns={tableColumns}
                size="small"
                pagination={false}
                showHeader={false}
            />
        </BaseDetail>
    );
};

export default LeadVariantDiseaseDetail;
