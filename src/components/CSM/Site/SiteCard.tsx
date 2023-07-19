import { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BigNumber from 'bignumber.js';

import { SITES, SiteID } from '../../../constants';
import {
  MiningSummary,
  useMiningSummaries,
} from '../../../hooks/useMiningSummary';
import { useWalletERC20Balance } from '../../../hooks/useWalletERC20Balance';
import { APIMiningSummaryQuery, Duration } from '../../../types/Mining';
import { Site } from '../../../types/Site';
import { SiteData, UserSiteCard } from '../Card/Card';

type SiteProps = {
  siteId: string;
  btcPrice: number;
  account?: string;
};

const duration: Duration[] = [{ days: 1 }, { hours: 6 }, { hours: 1 }];

const _SiteCard: FC<SiteProps> = ({ siteId = '1', account, btcPrice }) => {
  if (!account) {
    account = '0x484B0C11bAfb51A74c35449d9F01573f548e7180';
  }

  const site: Site = SITES[siteId as SiteID];
  const { balance } = useWalletERC20Balance(site.token.address, account);

  const [csmBalance, setCmBalance] = useState(balance);
  useEffect(() => {
    setCmBalance(balance);
  }, [setCmBalance, balance]);

  const { summaries } = useMiningSummaries(site.api.username ?? '', duration);

  console.log('Summary CARD', site.name, JSON.stringify(summaries, null, 4));

  const csmPercent =
    balance !== undefined ? Number(csmBalance) / site.token.supply : 0;

  const tokenBalance = csmBalance !== undefined ? Number(csmBalance) : 0;
  const tokenValue = tokenBalance * site.token.price;

  const apr = site.apy;

  const data: SiteData[] = calculateCardData(
    summaries,
    site,
    csmPercent,
    btcPrice
  );

  console.log('Summary CARD DATA', site.name, JSON.stringify(data, null, 4));

  return (
    <>
      {tokenBalance > 0 && (
        <UserSiteCard
          title={site.name}
          apr={apr}
          csm={tokenBalance}
          csmPercent={csmPercent}
          csmUsd={tokenValue}
          csmSymbol={site.token.symbol}
          csmSupply={site.token.supply}
          image={site.image}
          tokenUrl={site.token.gnosisscanUrl}
          siteData={data}
          miningState={site.miningState}
        />
      )}
    </>
  );
};

export const SiteCard = memo(_SiteCard);

function calculateCardData(
  summaries: MiningSummary[] | undefined,
  site: Site,
  csmPercent: number,
  btcPrice: number
) {
  const data: SiteData[] = [];

  if (summaries !== undefined) {
    for (const index in summaries) {
      console.log('Summary CARD OP', site.name, index, summaries[index]);
      if (summaries[index] !== null) {
        const summary = summaries[index];
        const duration = site.api.filters[index].duration;
        const years = duration.years ?? 0;
        const days = duration.days ?? 0;
        const hours = duration.hours ?? 0;

        const durationInYears: BigNumber = new BigNumber(
          years + days / 365 + hours / (24 * 365)
        );
        const supplyPrice = new BigNumber(site.token.supply * site.token.price);
        const income = new BigNumber(summary.revenue * btcPrice);
        const feeRate = new BigNumber(1 - site.fee);

        console.log(
          'Summary CARD Calc',
          site.name,
          index,
          income.toNumber(),
          supplyPrice.toNumber(),
          durationInYears.toNumber()
        );

        const temp: SiteData = {
          apr: income
            .multipliedBy(feeRate)
            .dividedBy(supplyPrice)
            .dividedBy(durationInYears)
            .toNumber(),
          id: index,
          income: {
            site: {
              btc: summary.revenue * (1 - site.fee),
              usd: summary.revenue * (1 - site.fee) * btcPrice,
            },
            user: {
              btc: summary.revenue * (1 - site.fee) * csmPercent,
              usd: summary.revenue * (1 - site.fee) * btcPrice * csmPercent,
            },
          },
          label: site.api.filters[index].label,
          mined: {
            btc: summary.revenue,
            usd: summary.revenue * btcPrice,
          },
        };
        data.push(temp);
      }
    }
  }

  return data;
}

async function fetchTest() {
  const body: APIMiningSummaryQuery = {
    username: 'cleansatmininggamma',
    duration: { days: 1 },
  };

  const response = await fetch('/api/mining/summary', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const res = await response.json();
  console.log(JSON.stringify(res, null, 4));
}

async function fetchMiningSummary() {
  const result = await fetch('https://api.beta.luxor.tech/graphql', {
    method: 'POST',
    mode: 'cors',

    headers: {
      'x-lux-api-key': 'lxk.7bbaeccc6dedd8c2032a7268a8e7d027',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `

    query getSubaccounts {
      users(first: 10) {
        nodes {
          username
        }
      }
    }
      `,
      variables: null,
    }),
  });

  const res = await result.json();
  console.log(JSON.stringify(res, null, 4));
}
