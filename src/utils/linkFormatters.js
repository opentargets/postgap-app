import React from 'react';
import { Link } from 'react-router-dom';
import { Popover } from 'antd';

export const LinkOpenTargetsGene = ({ geneId, text = 'Open Targets' }) => (
    <a
        href={`http://www.targetvalidation.org/target/${geneId}`}
        target={'_blank'}
    >
        {text}
    </a>
);
export const LinkOpenTargetsDisease = ({ efoId, text = 'Open Targets' }) => (
    <a
        href={`http://www.targetvalidation.org/disease/${efoId}`}
        target={'_blank'}
    >
        {text}
    </a>
);
export const LinkEnsemblGene = ({ geneId, text = 'Ensembl' }) => (
    <a
        href={`http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${geneId}`}
        target={'_blank'}
    >
        {text}
    </a>
);
export const LinkEnsemblVariant = ({ vId, text = 'Ensembl' }) => (
    <a
        href={`http://www.ensembl.org/Homo_sapiens/Variation/Explore?v=${vId}`}
        target={'_blank'}
    >
        {text}
    </a>
);
export const LinkGwasCatalogVariant = ({ vId, text = 'GWAS Catalog' }) => (
    <a
        href={`https://www.ebi.ac.uk/gwas/search?query=${vId}`}
        target={'_blank'}
    >
        {text}
    </a>
);
export const LinkGwasCatalogDisease = ({ efoId, text = 'GWAS Catalog' }) => (
    <a
        href={`https://www.ebi.ac.uk/gwas/search?query=${efoId}`}
        target={'_blank'}
    >
        {text}
    </a>
);
export const LinkGtexGene = ({ geneName, text = 'GTEx' }) => (
    <a
        href={`https://www.gtexportal.org/home/eqtls/byGene?geneId=${geneName}&tissueName=All`}
        target={'_blank'}
    >
        {text}
    </a>
);

export const LinksGene = ({ geneName, geneId, children }) => (
    <Popover
        content={
            <React.Fragment>
                <LinkOpenTargetsGene geneId={geneId} />
                <br />
                <LinkEnsemblGene geneId={geneId} />
                <br />
                <LinkGtexGene geneName={geneName} />
            </React.Fragment>
        }
    >
        <Link to={`/gene/${geneId}`}>{children}</Link>
    </Popover>
);

export const LinksVariant = ({ vId, children }) => (
    <Popover content={<LinkEnsemblVariant vId={vId} />}>
        <Link to={`/variant/${vId}`}>{children}</Link>
    </Popover>
);

export const LinksLeadVariant = ({ lvId, children }) => (
    <Popover
        content={
            <React.Fragment>
                <LinkEnsemblVariant vId={lvId} />
                <br />
                <LinkGwasCatalogVariant vId={lvId} />
            </React.Fragment>
        }
    >
        <Link to={`/variant/${lvId}`}>{children}</Link>
    </Popover>
);

export const LinksDisease = ({ efoId, children }) => (
    <Popover
        content={
            <React.Fragment>
                <LinkOpenTargetsDisease efoId={efoId} />
                <br />
                <LinkGwasCatalogDisease efoId={efoId} />
            </React.Fragment>
        }
    >
        <Link to={`/disease/${efoId}`}>{children}</Link>
    </Popover>
);
