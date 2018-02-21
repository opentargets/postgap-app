import { delay } from 'redux-saga';
import { call, put, take, fork, cancel, select } from 'redux-saga/effects';
import axios from 'axios';

import { SET_LOCATION, setLoadingRows, setApiData } from './actions';
import {
  selectors,
  rowsToUniqueGenes,
  rowsToUniqueLeadVariants
} from './selectors';
import {
  transformEnsemblGene,
  transformEnsemblVariant
} from './utils/transformEnsembl';
import { transformEvidenceString } from './utils/transformOpenTargets';

function* updateLocationSaga() {
  let task;
  while (true) {
    const action = yield take(SET_LOCATION);
    if (task) yield cancel(task);
    task = yield fork(updateLocation, action);
  }
}

function* updateLocation(action) {
  yield call(delay, 500); // debounce
  yield put(setLoadingRows(true)); // ui display

  try {
    const chromosome = yield select(selectors.getChromosome);

    // fetch rows for location from Open Targets API
    const rowsRaw = yield call(otApi.fetchRows, chromosome, action.location);
    const rows = rowsRaw.map(transformEvidenceString);

    // extract gene and lead variant ids (for which we need to call Ensembl)
    const genes = rowsToUniqueGenes(rows);
    const leadVariants = rowsToUniqueLeadVariants(rows);
    const geneIds = genes.map(d => d.geneId);
    const leadVariantIds = leadVariants.map(d => d.gwasSnpId);

    // fetch transcript info for each gene from Ensembl
    const ensemblGenesRaw = yield call(ensemblApi.fetchGenes, geneIds);
    const ensemblGenes = Object.values(ensemblGenesRaw).map(
      transformEnsemblGene
    );

    // fetch position info for each lead variant from Ensembl
    const ensemblVariantsRaw = yield call(
      ensemblApi.fetchVariants,
      leadVariantIds
    );
    const ensemblVariants = Object.values(ensemblVariantsRaw).map(
      transformEnsemblVariant
    );

    // update store
    // important: this happens as one transaction for all data
    //            so UI change is consistent (and selectors work)
    yield put(setApiData({ rows, ensemblGenes, ensemblVariants }));
    yield put(setLoadingRows(false));
  } catch (e) {
    // yield put({type: API_ERROR, message: e.message})
    console.log(e);
  }
}

const OT_API_BASE =
  'https://mk-loci-dot-open-targets-eu-dev.appspot.com/v3/platform/';
const OT_API_FILTER = 'public/evidence/filter';
const OT_API_INTERVAL = ({ chromosome, start, end }) =>
  `?chromosome=${chromosome}&begin=${start}&end=${end}&size=10&datasource=gwas_catalog&fields=unique_association_fields&fields=disease&fields=evidence&fields=variant&fields=target&fields=sourceID`;

const ENSEMBL_API_BASE = 'https://rest.ensembl.org/';
const ENSEMBL_API_VARIATION = 'variation/homo_sapiens';
const ENSEMBL_API_LOOKUP = 'lookup/id';

const otApi = {
  fetchRows(chromosome, location) {
    const { start, end } = location;
    const endpoint = OT_API_INTERVAL({ chromosome, start, end });
    const url = `${OT_API_BASE}${OT_API_FILTER}${endpoint}`;
    return axios.get(url).then(response => response.data.data);
    // TODO: Handle calls over paginator and check error handling!
  }
};

const ensemblApi = {
  fetchVariants(variantIds) {
    const url = `${ENSEMBL_API_BASE}${ENSEMBL_API_VARIATION}`;
    const body = {
      ids: variantIds
    };
    return axios.post(url, body).then(response => response.data);
  },
  fetchGenes(geneIds) {
    const url = `${ENSEMBL_API_BASE}${ENSEMBL_API_LOOKUP}`;
    const body = {
      ids: geneIds,
      expand: true
    };
    return axios.post(url, body).then(response => response.data);
  }
};

export default updateLocationSaga;
