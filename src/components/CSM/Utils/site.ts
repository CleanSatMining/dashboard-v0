import { SITES } from '../../../constants/csm';
import { SiteID } from 'src/types/mining/Site';
import { Site } from 'src/types/mining/Site';

export function getSite(siteId: string): Site {
  return SITES[siteId as SiteID];
}

/**
 * getSubSites
 * @param site
 * @returns
 */
export function getSubSites(site: Site): Site[] {
  // Vérifie si site.api est un tableau et contient des éléments
  if (Array.isArray(site.api) && site.api.length > 1) {
    // Crée une nouvelle liste de sites où chaque site est identique à l'original,
    // mais avec le champ `site` remplacé par l'élément correspondant de site.api
    const ms = site.api.map((apiElement, index) => ({
      ...site, // Copie toutes les propriétés de l'objet site
      api: [apiElement],
    }));

    return ms;
  } else {
    // Retourne un tableau vide ou gère l'erreur comme vous le souhaitez
    return [];
  }
}

export function getSubSite(site: Site, subaccount: number | undefined): Site {
  // Vérifie si site.api est un tableau et contient des éléments
  if (
    Array.isArray(site.api) &&
    site.api.length > 1 &&
    subaccount !== undefined
  ) {
    // Crée une nouvelle liste de sites où chaque site est identique à l'original,
    // mais avec le champ `site` remplacé par l'élément correspondant de site.api
    const subsites = site.api.map((apiElement) => ({
      ...site, // Copie toutes les propriétés de l'objet site
      api: [apiElement],
    }));
    //console.log('site:', JSON.stringify(subsites, null, 2));
    const ms = subsites.find(
      (s) =>
        s.api[0].subaccount &&
        s.api[0].subaccount.id.toString() === subaccount.toString(),
    );

    if (ms === undefined) {
      throw new Error('No subaccount found');
    }

    return ms;
  } else {
    // Retourne le site original
    return site;
  }
}
