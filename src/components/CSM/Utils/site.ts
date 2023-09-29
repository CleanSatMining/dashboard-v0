import { SITES, SiteID } from '../../../constants/csm';
import { Site } from 'src/types/mining/Site';

export function getSite(siteId: string): Site {
  return SITES[siteId as SiteID];
}
