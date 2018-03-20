import { delay } from 'redux-saga';
import { call, put, take, fork, cancel } from 'redux-saga/effects';
import axios from 'axios';
import _ from 'lodash';

import {
  SET_LOCATION,
  SET_DISEASE_PAGE,
  setLoadingRows,
  setApiData,
  setLoadingEnsemblGenes,
  setLoadingEnsemblVariants,
  setLoadingDiseaseTableRows,
  setDiseaseTableRows,
} from './actions';
import { rowsToUniqueGenes, rowsToUniqueLeadVariants } from './selectors';
import {
  transformEnsemblGene,
  transformEnsemblVariant,
} from './utils/transformEnsembl';
import { transformEvidenceString } from './utils/transformOpenTargets';

export function* updateLocationSaga() {
  let task;
  while (true) {
    const action = yield take(SET_LOCATION);
    if (task) yield cancel(task);
    task = yield fork(updateLocation, action);
  }
}

function* updateLocation(action) {
  yield call(delay, 500); // debounce
  try {
    // fetch rows for location from Open Targets API
    yield put(setLoadingRows(true));
    const rowsRaw = yield call(otApi.fetchRows, action.location);
    yield put(setLoadingRows(false));
    const rows = rowsRaw.map(transformEvidenceString);

    // extract gene and lead variant ids (for which we need to call Ensembl)
    const genes = rowsToUniqueGenes(rows);
    const leadVariants = rowsToUniqueLeadVariants(rows);
    const geneIds = genes.map(d => d.geneId);
    const leadVariantIds = leadVariants.map(d => d.gwasSnpId);

    // fetch transcript info for each gene from Ensembl
    yield put(setLoadingEnsemblGenes(true));
    const ensemblGenesRaw = yield call(ensemblApi.fetchGenes, geneIds);
    yield put(setLoadingEnsemblGenes(false));
    const ensemblGenes = Object.values(ensemblGenesRaw).map(
      transformEnsemblGene
    );

    // fetch position info for each lead variant from Ensembl
    yield put(setLoadingEnsemblVariants(true));
    const ensemblVariantsRaw = yield call(
      ensemblApi.fetchVariants,
      leadVariantIds
    );
    yield put(setLoadingEnsemblVariants(false));
    const ensemblVariants = Object.values(ensemblVariantsRaw).map(
      transformEnsemblVariant
    );

    // compute max -log(pval) for filters
    const rowWithMinValue = _.min(rows, d => d.gwasPValue);
    let gwasMaxPValue = 100;
    if (rowWithMinValue) {
      gwasMaxPValue = -Math.log10(rowWithMinValue.gwasPValue).toFixed(1);
    }

    // update store
    // important: this happens as one transaction for all data
    //            so UI change is consistent (and selectors work)
    yield put(
      setApiData({ rows, ensemblGenes, ensemblVariants, gwasMaxPValue })
    );
  } catch (e) {
    // yield put({type: API_ERROR, message: e.message})
    console.log(e);
  }
}

export function* updateDiseaseTableSaga() {
  let task;
  while (true) {
    const action = yield take(SET_DISEASE_PAGE);
    if (task) yield cancel(task);
    task = yield fork(updateDiseaseTable, action);
  }
}

function* updateDiseaseTable(action) {
  yield call(delay, 500); // debounce
  try {
    // fetch rows for location from Open Targets API
    yield put(setLoadingDiseaseTableRows(true));
    const rowsRaw = yield call(otApi.fetchRowsByEfoId, action.efoId);
    yield put(setLoadingDiseaseTableRows(false));
    const rows = rowsRaw.map(transformEvidenceString);

    // update store
    // important: this happens as one transaction for all data
    //            so UI change is consistent (and selectors work)
    yield put(setDiseaseTableRows(rows));
  } catch (e) {
    // yield put({type: API_ERROR, message: e.message})
    console.log(e);
  }
}

const OT_API_BASE =
  'https://mk-loci-dot-open-targets-eu-dev.appspot.com/v3/platform/';
const OT_API_FILTER = 'public/evidence/filter';
const OT_API_INTERVAL = ({ chromosome, start, end }) =>
  `?chromosome=${chromosome}&begin=${start}&end=${end}&size=10000&datasource=gwas_catalog&fields=unique_association_fields&fields=disease&fields=evidence&fields=variant&fields=target&fields=sourceID`;
const OT_API_DISEASE = ({ efoId }) =>
  `?disease=${efoId}&size=10000&datasource=gwas_catalog&fields=unique_association_fields&fields=disease&fields=evidence&fields=variant&fields=target&fields=sourceID`;
const OT_API_SEARCH = ({ query }) => `private/quicksearch?q=${query}&size=3`;

const ENSEMBL_API_BASE = 'https://rest.ensembl.org/';
const ENSEMBL_API_VARIATION = 'variation/homo_sapiens';
const ENSEMBL_API_LOOKUP = 'lookup/id';

const checkPaginator = response => {
  if (response.data.next && response.data.query.size === 10000)
    console.warn(`Over 10,000 records (total: ${response.data.total}`);
  return response;
};

export const otApi = {
  fetchRows(location) {
    const { start, end, chromosome } = location;
    const endpoint = OT_API_INTERVAL({ chromosome, start, end });
    const url = `${OT_API_BASE}${OT_API_FILTER}${endpoint}`;
    return axios
      .get(url)
      .then(checkPaginator)
      .then(response => response.data.data);
    // TODO: Handle calls over paginator and check error handling!
  },
  fetchRowsByEfoId(efoId) {
    const endpoint = OT_API_DISEASE({ efoId });
    const url = `${OT_API_BASE}${OT_API_FILTER}${endpoint}`;
    return axios
      .get(url)
      .then(checkPaginator)
      .then(response => response.data.data);
    // TODO: Handle calls over paginator and check error handling!
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
  fetchVariants(variantIds) {
    const url = `${ENSEMBL_API_BASE}${ENSEMBL_API_VARIATION}`;
    const body = {
      ids: variantIds,
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
};

export default function* root() {
  yield [fork(updateLocationSaga), fork(updateDiseaseTableSaga)];
}
