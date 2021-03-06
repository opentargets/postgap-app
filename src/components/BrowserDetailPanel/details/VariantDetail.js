import React from 'react';
import { Table } from 'antd';

import BaseDetail from './BaseDetail';
import { LinksVariant } from '../../../utils/linkFormatters';
import { commaSeparate } from '../../../utils/stringFormatters';

const VariantDetail = ({ variant, closeHandler, chromosome }) => {
    const d = variant;
    const tableData = [
        {
            key: 'location',
            label: 'Location',
            value: `${chromosome}:${commaSeparate(d.position)}`,
        },
    ];
    const tableColumns = [
        {
            key: 'label',
            title: 'Label',
            dataIndex: 'label',
            width: 100,
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
            type={'Variant'}
            title={<LinksVariant vId={variant.id}>{variant.id}</LinksVariant>}
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

export default VariantDetail;
