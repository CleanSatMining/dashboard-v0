import { FC, useEffect, useState } from 'react';
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
import { Site } from 'src/types/mining/Site';
import { TAXE_FREE_MODE } from 'src/constants/csm';

export const useStyle = createStyles((theme: MantineTheme) => ({
  accordionContainer: {
    borderRadius: theme.radius.md,
    marginTop: '5px',
    padding: '0px',
  },
}));

export type CardSiteAccountingProps = {
  data: CardData;
};

export const CardSiteAccounting: FC<CardSiteAccountingProps> = ({ data }) => {
  //console.log('CardSiteAccounting RENDER', data.site.uptime.costs.total);
  const { classes } = useStyle();
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const site = getSite(data.id);
  const [income, setIncome] = useState<number>(data.site.uptime.mined.usd);
  const [expense, setExpense] = useState<number>(
    TAXE_FREE_MODE
      ? data.site.uptime.costs.totalTaxeFree
      : data.site.uptime.costs.total,
  );
  const hasData = data.income.available;

  useEffect(() => {
    setIncome(data.site.uptime.mined.usd);
    setExpense(
      TAXE_FREE_MODE
        ? data.site.uptime.costs.totalTaxeFree
        : data.site.uptime.costs.total,
    );
  }, [data]);

  return (
    <div className={classes.accordionContainer}>
      <Accordion variant={'contained'}>
        <Accordion.Item value={'income'} key={'Income'}>
          <Accordion.Control>
            <AccordionLabel
              {...{
                isMobile: isMobile,
                label: t('incomes'),
                value: formatUsd(
                  income,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  hasData,
                ),
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
                {formatUsd(
                  income,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  hasData,
                )}
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
                value: formatUsd(
                  expense,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  hasData,
                ),
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
                {formatUsd(
                  data.site.uptime.costs.electricity,
                  2,
                  undefined,
                  undefined,
                  undefined,
                  hasData,
                )}
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
                {formatUsd(
                  data.site.uptime.costs.feeCSM,
                  2,
                  undefined,
                  undefined,
                  undefined,
                  hasData,
                )}
              </Text>
            </Group>
            <Group position={'apart'} mt={'0'} mb={'0'}>
              {site.fees.operational.operator.includeWithElectricity ? (
                <InfoText
                  fz={isMobile ? 'xs' : 'sm'}
                  color={'dimmed'}
                  text={
                    t('cost-fees-operator') +
                    formatExplained(
                      formatPercent(site.fees.operational.operator.rate, 0),
                    )
                  }
                  tooltipText={t('operator-explained')}
                ></InfoText>
              ) : (
                <Text
                  fz={isMobile ? 'xs' : 'sm'}
                  align={'center'}
                  color={'dimmed'}
                >
                  {t('cost-fees-operator') +
                    formatExplained(
                      formatPercent(site.fees.operational.operator.rate, 0),
                    )}
                </Text>
              )}
              <Text weight={500} fz={isMobile ? 'xs' : 'sm'} align={'center'}>
                {formatUsd(
                  data.site.uptime.costs.feeOperator,
                  2,
                  undefined,
                  undefined,
                  undefined,
                  hasData,
                )}
              </Text>
            </Group>
            {!TAXE_FREE_MODE && (
              <>
                <Group position={'apart'} mt={'0'} mb={'0'}>
                  <Text
                    fz={isMobile ? 'xs' : 'sm'}
                    align={'center'}
                    color={'dimmed'}
                  >
                    {t('cost-taxes') +
                      formatExplained(
                        formatPercent(site.fees.operational.taxe, 2),
                      )}
                  </Text>
                  <Text
                    weight={500}
                    fz={isMobile ? 'xs' : 'sm'}
                    align={'center'}
                  >
                    {formatUsd(
                      data.site.uptime.costs.taxe,
                      2,
                      undefined,
                      undefined,
                      undefined,
                      hasData,
                    )}
                  </Text>
                </Group>
                <Group position={'apart'} mt={'0'} mb={'0'}>
                  <InfoText
                    fz={isMobile ? 'xs' : 'sm'}
                    color={'dimmed'}
                    text={t('cost-provision')}
                    tooltipText={t('provision-explained').replace(
                      '$',
                      formatUsd(
                        data.site.equipmentCost,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        hasData,
                      ),
                    )}
                  ></InfoText>

                  <Text
                    weight={500}
                    fz={isMobile ? 'xs' : 'sm'}
                    align={'center'}
                  >
                    {formatUsd(
                      data.site.uptime.costs.provision,
                      2,
                      undefined,
                      undefined,
                      undefined,
                      hasData,
                    )}
                  </Text>
                </Group>
              </>
            )}
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

function sumEquipmentCosts(site: Site): number {
  let totalCost = 0;

  // Parcourir chaque équipement et ajouter son coût au total
  for (const equipment of site.mining.asics) {
    totalCost += equipment.intallationCosts.equipement;
  }

  return totalCost;
}
