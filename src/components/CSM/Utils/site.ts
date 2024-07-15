import { SITES } from '../../../constants/csm';
import { SiteID } from 'src/types/mining/Site';
import { Site } from 'src/types/mining/Site';

export function getSite(siteId: string): Site {
  return SITES[siteId as SiteID];
}
