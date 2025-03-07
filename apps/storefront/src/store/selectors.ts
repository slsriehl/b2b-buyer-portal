import { createSelector } from '@reduxjs/toolkit'

import { CompanyStatus, CustomerRole, UserTypes } from '@/types'

import { defaultCurrenciesState } from './slices/storeConfigs'
import { RootState } from './reducer'

const themeSelector = (state: RootState) => state.theme
const storeConfigSelector = (state: RootState) => state.storeConfigs
const companySelector = (state: RootState) => state.company
const quoteInfoSelector = (state: RootState) => state.quoteInfo
const b2bFeaturesSelector = (state: RootState) => state.b2bFeatures

export const themeFrameSelector = createSelector(
  themeSelector,
  (theme) => theme.themeFrame
)

export const defaultCurrencyInfoSelector = createSelector(
  storeConfigSelector,
  (storeConfigs) => {
    const defaultCurrency = storeConfigs.currencies.currencies.find(
      (currency) => currency.is_default
    )

    return defaultCurrency || defaultCurrenciesState.currencies[0]
  }
)
export const activeCurrencyInfoSelector = createSelector(
  storeConfigSelector,
  (storeConfigs) => {
    const entityId = storeConfigs.activeCurrency?.node.entityId || ''
    const activeCurrency = storeConfigs.currencies.currencies.find(
      (currency) => currency.id === entityId
    )

    return activeCurrency || defaultCurrenciesState.currencies[0]
  }
)

export const isLoggedInSelector = createSelector(
  companySelector,
  (company) => company.customer.role !== CustomerRole.GUEST
)

export const isAgentingSelector = createSelector(
  b2bFeaturesSelector,
  (b2bFeatures) => b2bFeatures.masqueradeCompany.isAgenting
)

export const isB2BUserSelector = createSelector(
  companySelector,
  (company) =>
    (company.customer.userType === UserTypes.MULTIPLE_B2C &&
      company.companyInfo.status === CompanyStatus.APPROVED) ||
    +company.customer.role === CustomerRole.SUPER_ADMIN
)

export const formatedQuoteDraftListSelector = createSelector(
  quoteInfoSelector,
  (quoteInfo) =>
    quoteInfo.draftQuoteList.map(
      ({
        node: { optionList, calculatedValue, productsSearch, ...restItem },
      }) => {
        const parsedOptionList: Record<string, string>[] =
          JSON.parse(optionList)
        const optionSelections = parsedOptionList.map(
          ({ optionId, optionValue }) => {
            const optionIdFormated = optionId.match(/\d+/)
            return {
              optionId: optionIdFormated?.length
                ? +optionIdFormated[0]
                : optionId,
              optionValue: +optionValue,
            }
          }
        )
        return {
          ...restItem,
          optionSelections,
        }
      }
    )
)

export const isValidUserTypeSelector = createSelector(
  companySelector,
  ({ customer, companyInfo }) => {
    const { userType } = customer
    const isB2BUser =
      (customer.userType === UserTypes.MULTIPLE_B2C &&
        companyInfo.status === CompanyStatus.APPROVED) ||
      +customer.role === CustomerRole.SUPER_ADMIN

    if (isB2BUser) {
      return userType === UserTypes.DOESNT_EXIST
    }

    return userType !== UserTypes.B2C
  }
)
