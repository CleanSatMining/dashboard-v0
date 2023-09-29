import { FC } from 'react';
import {
  Text,
  Group,
  createStyles,
  MantineTheme,
  Accordion,
} from '@mantine/core';
import {
  formatUsd,
  formatUsdCentsPerKWh,
  formatPercent,
} from 'src/utils/format/format';
import { getSite } from 'src/components/CSM/Utils/site';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from '../Type';
import { InfoText } from 'src/components/InfoText/InfoText';

export const useStyle = createStyles((theme: MantineTheme) => ({
  accordionContainer: {
    borderRadius: theme.radius.md,
    marginTop: '5px',
    padding: '0px',
    // border:
    //   theme.colorScheme === 'dark' ? `1px solid ${theme.colors.dark[4]}` : '0',
    // backgroundColor:
    //   theme.colorScheme === 'dark'
    //     ? theme.colors.dark[7]
    //     : theme.colors.gray[0],
  },
}));

export type CardSiteAccountingProps = {
  data: CardData;
};

export const CardSiteAccounting: FC<CardSiteAccountingProps> = ({ data }) => {
  const { classes } = useStyle();
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const site = getSite(data.id);

  return (
    <div className={classes.accordionContainer}>
      <Accordion variant={'contained'} defaultValue={'income'}>
        <Accordion.Item value={'income'} key={'Income'}>
          <Accordion.Control>
            <AccordionLabel
              {...{
                isMobile: isMobile,
                label: t('incomes'),
                value: formatUsd(data.site.uptime.mined.usd),
                color: 'green',
              }}
            />
          </Accordion.Control>
          <Accordion.Panel>
            <Group position={'apart'} mt={'0'} mb={'0'}>
              <Text
                fz={isMobile ? 'xs' : 'sm'}
                align={'center'}
                color={'dimmed'}
              >
                {t('bitcoin-mined')}
              </Text>
              <Text weight={500} fz={isMobile ? 'xs' : 'sm'} align={'center'}>
                {formatUsd(data.site.uptime.mined.usd)}
              </Text>
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value={'cost'} key={'Cost'}>
          <Accordion.Control>
            <AccordionLabel
              {...{
                isMobile: isMobile,
                label: t('costs'),
                value: formatUsd(data.site.uptime.costs.total),
                color: 'red',
              }}
            />
          </Accordion.Control>
          <Accordion.Panel>
            <Group position={'apart'} mt={'0'} mb={'0'}>
              <Text
                fz={isMobile ? 'xs' : 'sm'}
                align={'center'}
                color={'dimmed'}
              >
                {t('cost-electricity') +
                  formatExplained(
                    formatUsdCentsPerKWh(
                      site.mining.electricity.usdPricePerKWH,
                    ),
                  )}
              </Text>
              <Text weight={500} fz={isMobile ? 'xs' : 'sm'} align={'center'}>
                {formatUsd(data.site.uptime.costs.electricity, 2)}
              </Text>
            </Group>
            <Group position={'apart'} mt={'0'} mb={'0'}>
              <Text
                fz={isMobile ? 'xs' : 'sm'}
                align={'center'}
                color={'dimmed'}
              >
                {t('cost-fees-csm') +
                  formatExplained(formatPercent(site.fees.operational.csm, 0))}
              </Text>
              <Text weight={500} fz={isMobile ? 'xs' : 'sm'} align={'center'}>
                {formatUsd(data.site.uptime.costs.feeCSM, 2)}
              </Text>
            </Group>
            <Group position={'apart'} mt={'0'} mb={'0'}>
              <Text
                fz={isMobile ? 'xs' : 'sm'}
                align={'center'}
                color={'dimmed'}
              >
                {t('cost-fees-operator') +
                  formatExplained(
                    formatPercent(site.fees.operational.operator, 0),
                  )}
              </Text>
              <Text weight={500} fz={isMobile ? 'xs' : 'sm'} align={'center'}>
                {formatUsd(data.site.uptime.costs.feeOperator, 2)}
              </Text>
            </Group>
            <Group position={'apart'} mt={'0'} mb={'0'}>
              <Text
                fz={isMobile ? 'xs' : 'sm'}
                align={'center'}
                color={'dimmed'}
              >
                {t('cost-taxes') +
                  formatExplained(formatPercent(site.fees.operational.taxe, 2))}
              </Text>
              <Text weight={500} fz={isMobile ? 'xs' : 'sm'} align={'center'}>
                {formatUsd(data.site.uptime.costs.taxe, 2)}
              </Text>
            </Group>
            <Group position={'apart'} mt={'0'} mb={'0'}>
              <InfoText
                fz={isMobile ? 'xs' : 'sm'}
                color={'dimmed'}
                text={t('cost-provision')}
                tooltipText={t('provision-explained')}
              ></InfoText>
              {/* <Text
                fz={isMobile ? 'xs' : 'sm'}
                align={'center'}
                color={'dimmed'}
              >
                {t('cost-provision')}
              </Text> */}
              <Text weight={500} fz={isMobile ? 'xs' : 'sm'} align={'center'}>
                {formatUsd(data.site.uptime.costs.provision, 2)}
              </Text>
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

interface AccordionLabelProps {
  label: string;
  value: string;
  isMobile: boolean;
  color: string;
}

function AccordionLabel({
  label,
  value,
  isMobile,
  color,
}: AccordionLabelProps) {
  return (
    <Group position={'apart'} mt={0} mb={0}>
      <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
        {label}
      </Text>
      <Text weight={500} fz={isMobile ? 'xs' : 'sm'} color={color}>
        {value}
      </Text>
    </Group>
  );
}

const formatExplained = (text: string) => {
  return ' (' + text + ')';
};
