import { gql } from '@apollo/client';


export const GET_ALL_MARKET_ITEMS = gql`
query GetAllMarketItems {
    markets(order_by: {created_at: asc}, where: {is_active: {_eq: true}}) {
      createdAt: created_at
      id
      isActive: is_active
      orderId: order_id
      price
      projectId: project_id
      sellerWallet: seller_wallet
      assetToken: token_id
      updatedAt: updated_at
      zone: zone_id
      asset {
        id
        isClaim: is_claim
        isLocked: is_locked
        projectId: project_id
        assetToken: token_id
        zone: zone_id
        updatedAt: updated_at
      }
      project {
        id
        projectName: project_name
        plantingEndDate: end_holding_time
        price: land_price,
        zoneRewardRate: zone_reward_rate
      }
    }
  }
`;

export const GET_MARKET_ITEM_BY_ORDER_ID = gql`
query GetAllMarketItems ($orderId: Int!) {
    markets(where: {order_id: {_eq: $orderId}}) {
      createdAt: created_at
      id
      isActive: is_active
      orderId: order_id
      price
      projectId: project_id
      sellerWallet: seller_wallet
      assetToken: token_id
      updatedAt: updated_at
      zone: zone_id
      asset {
        id
        isClaim: is_claim
        isLocked: is_locked
        projectId: project_id
        assetToken: token_id
        zone: zone_id
        updatedAt: updated_at
      }
      project {
        id
        projectName: project_name
        plantingEndDate: end_holding_time
        price: land_price,
        zoneRewardRate: zone_reward_rate
      }
    }
  }
`;

export const GET_LATEST_MARKET_BY_TOKEN_ID = gql`
query GetLatestMarketByTokenId ($tokenId: Int!) {
    markets(limit: 1, order_by: {id: desc}, where: {is_active: {_eq: true}, token_id: {_eq: $tokenId}}) {
      createdAt: created_at
      id
      isActive: is_active
      orderId: order_id
      price
      projectId: project_id
      sellerWallet: seller_wallet
      assetToken: token_id
      updatedAt: updated_at
      zone: zone_id
    }
  }
`;

export const INSERT_MARKET = gql`
mutation InsertMarket($objects: markets_insert_input!) {
    insert_markets_one(object: $objects) {
        created_at
    }
  }
`;

export const UPDATE_MARKET_STATUS = gql`
mutation InsertMarket($marketId: Int!) {
    update_markets_by_pk(pk_columns: {id: $marketId}, _set: {is_active: false}) {
      is_active
      token_id
    }
  }
`;

