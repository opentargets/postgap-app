import axios from 'axios';
import queryString from 'query-string';
import * as d3 from 'd3';

import {
    transformEnsemblGene,
    transformEnsemblVariant,
} from './utils/transformEnsembl';
import { transformEvidenceString } from './utils/transformOpenTargets';

const OT_API_BASE =
    'https://mk-loci-dot-open-targets-eu-dev.appspot.com/v3/platform/';
const OT_API_FILTER = 'public/evidence/filter';
const OT_API_FIELDS = [
    // unique_association_fields
    'unique_association_fields.pubmed_refs',
    'unique_association_fields.r2',
    // disease
    'disease.id',
    'disease.name',
    // evidence
    'evidence.variant2disease.resource_score.value',
    'evidence.variant2disease.gwas_sample_size',
    'evidence.variant2disease.lead_snp_rsid',
    'evidence.gene2variant.metadata.funcgen.vep_score',
    'evidence.gene2variant.metadata.funcgen.gtex_score',
    'evidence.gene2variant.metadata.funcgen.pchic_score',
    'evidence.gene2variant.metadata.funcgen.dhs_score',
    'evidence.gene2variant.metadata.funcgen.fantom5_score',
    'evidence.gene2variant.metadata.funcgen.ot_g2v_score',
    // variant
    'variant.id',
    'variant.pos',
    'variant.chrom',
    // target
    'target.id',
    'target.target_name',
    'target.gene_info.name',
];
const OT_API_INTERVAL = ({ chromosome, start, end, next = false }) => {
    // `?chromosome=${chromosome}&begin=${start}&end=${end}&size=10000&datasource=gwas_catalog&fields=unique_association_fields&fields=disease&fields=evidence&fields=variant&fields=target&fields=sourceID`;
    let params = {
        chromosome,
        begin: start,
        end,
        size: 10000,
        datasource: 'gwas_catalog',
        fields: OT_API_FIELDS,
    };
    if (next) {
        params.next = next;
    }
    return `?${queryString.stringify(params)}`;
};

const OT_API_SEARCH = ({ query }) => `private/quicksearch?q=${query}&size=3`;

const ENSEMBL_API_BASE = 'https://rest.ensembl.org/';
const ENSEMBL_API_VARIATION = 'variation/homo_sapiens';
const ENSEMBL_API_LOOKUP = 'lookup/id';

const iterateRowPagination = (urlParams, next = null, acc = []) => {
    let urlParamsWithNext = { ...urlParams };
    if (next) {
        urlParamsWithNext.next = next;
    }
    const endpoint = OT_API_INTERVAL(urlParamsWithNext);
    const url = `${OT_API_BASE}${OT_API_FILTER}${endpoint}`;
    return axios.get(url).then(response => {
        const newAcc = [...acc, ...response.data.data];
        if (response.data.next && response.data.query.size === 10000) {
            if (acc.length)
                console.warn(
                    `Over 10,000 records (total: ${response.data.total})`
                );
            return iterateRowPagination(urlParams, response.data.next, newAcc);
        } else {
            return newAcc;
        }
    });
};

export const otApi = {
    fetchRows(location) {
        const { start, end, chromosome } = location;
        return iterateRowPagination({ start, end, chromosome });
    },
    fetchSearch(query) {
        const url = `${OT_API_BASE}${OT_API_SEARCH({ query })}`;
        return axios.get(url).then(response => {
            const data = [];
            if (response.data && response.data.data) {
                if (response.data.data.besthit) {
                    data.push({
                        id: response.data.data.besthit.data.id,
                        name: response.data.data.besthit.data.name,
                        type: response.data.data.besthit.data.type,
                    });
                }
                if (response.data.data.target) {
                    response.data.data.target.forEach(d => {
                        data.push({
                            id: d.data.id,
                            name: d.data.name,
                            type: d.data.type,
                        });
                    });
                }
                if (response.data.data.disease) {
                    response.data.data.disease.forEach(d => {
                        data.push({
                            id: d.data.id,
                            name: d.data.name,
                            type: d.data.type,
                        });
                    });
                }
            }
            return data;
        });
    },
};

export const ensemblApi = {
    fetchVariants(vIds) {
        const url = `${ENSEMBL_API_BASE}${ENSEMBL_API_VARIATION}`;
        const body = {
            ids: vIds,
        };
        return axios.post(url, body).then(response => response.data);
    },
    fetchGenes(geneIds) {
        const url = `${ENSEMBL_API_BASE}${ENSEMBL_API_LOOKUP}`;
        const body = {
            ids: geneIds,
            expand: true,
        };
        return axios.post(url, body).then(response => response.data);
    },
    fetchSearch(query) {
        const url = `${ENSEMBL_API_BASE}${ENSEMBL_API_VARIATION}`;
        const body = {
            ids: [query],
        };
        return axios.post(url, body).then(response => {
            const data = [];
            if (response.data && response.data[query]) {
                data.push({
                    id: query,
                    name: query,
                    type: 'variant',
                });
            }
            return data;
        });
    },
};
