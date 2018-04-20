import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import EvidenceTable from './EvidenceTable';

const DISEASE_TABLE_QUERY = gql`
    query DiseaseTableQuery($efoId: String, $offset: Int, $limit: Int) {
        diseaseTable(efoId: $efoId, limit: $limit, offset: $offset) {
            total
            offset
            limit
            rows {
                index
                geneId
                geneSymbol
                geneChromosome
                geneTss
                variantId
                variantChromosome
                variantPosition
                leadVariantId
                efoId
                efoName
                otG2VScore
                vep
                gtex
                pchic
                fantom5
                dhs
                nearest
                r2
                gwasPValue
                gwasOddsRatio
                gwasBeta
                gwasSize
                gwasPMId
                gwasStudy
            }
        }
    }
`;

const DiseaseTable = props => (
    <Query
        query={DISEASE_TABLE_QUERY}
        variables={{
            efoId: props.efoId,
            offset: 0,
            limit: 10,
        }}
        fetchPolicy="cache-and-network"
    >
        {({ loading, error, data, fetchMore }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            let pagination = {
                total: 0,
                current: 1,
                pageSize: 10,
            };
            if (data && data.diseaseTable) {
                pagination.total = data.diseaseTable.total;
                pagination.current =
                    data.diseaseTable.offset / pagination.pageSize + 1;
            }

            return (
                <EvidenceTable
                    {...props}
                    rows={data.diseaseTable.rows}
                    pagination={pagination}
                    onChange={(pagination, filters, sorter) => {
                        // TODO: support sorting and possibly filtering
                        fetchMore({
                            variables: {
                                offset:
                                    (pagination.current - 1) *
                                    pagination.pageSize,
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;
                                return fetchMoreResult;
                            },
                        });
                    }}
                />
            );
        }}
    </Query>
);

export default DiseaseTable;
