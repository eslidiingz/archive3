import { gql } from "@apollo/client";

export const GET_ALL_ASSETS_BY_WALLET_ADDRESS = gql`
  query GetAllAssetsByWalletAddress(
    $walletAddress: String!
    $isClaim: Boolean = false
  ) {
    assets(
      where: {
        wallet_address: { _eq: $walletAddress }
        is_claim: { _eq: $isClaim }
      }
    ) {
      id
      isClaim: is_claim
      isLocked: is_locked
      projectId: project_id
      assetToken: token_id
      zone: zone_id
      updatedAt: updated_at
      project {
        id
        projectName: project_name
        plantingEndDate: end_holding_time
        price: land_price
        zoneRewardRate: zone_reward_rate
        partner_zone {
          id
          # partner {
          #   id
          #   companyName: company_name
          # }
        }
      }
    }
  }
`;

export const GET_ALL_MY_PLACEMENTS_BY_WALLET_ADDRESS = gql`
  query GetAllAssetsByWalletAddress($walletAddress: String!) {
    assets(
      where: {
        wallet_address: { _eq: $walletAddress }
        is_locked: { _eq: true }
      }
    ) {
      id
      isClaim: is_claim
      isLocked: is_locked
      projectId: project_id
      assetToken: token_id
      zone: zone_id
      updatedAt: updated_at
      project {
        id
        projectName: project_name
        plantingEndDate: end_holding_time
      }
    }
  }
`;

export const GET_ASSET_BY_TOKEN_ID = gql`
  query GetAssetByTokenId($tokenId: Int!) {
    assets(
      where: {
        on_market: { is_active: { _eq: true }, token_id: { _eq: $tokenId } }
        token_id: { _eq: $tokenId }
      }
    ) {
      id
      ownerAddress: wallet_address
      isClaim: is_claim
      isLocked: is_locked
      projectId: project_id
      assetToken: token_id
      zone: zone_id
      updatedAt: updated_at
      project {
        id
        projectName: project_name
        plantingEndDate: end_holding_time
        price: land_price
      }
      onMarket: on_market {
        id
        orderId: order_id
        sellerWallet: seller_wallet
        price
        isActive: is_active
      }
    }
  }
`;

export const INSERT_ASSETS = gql`
  mutation InsertAssets($objects: [assets_insert_input!]!) {
    insert_assets(objects: $objects) {
      affected_rows
      returning {
        token_id
      }
    }
  }
`;

export const UPDATE_ASSET_OWNER = gql`
  mutation UpdateAssetOwner($assetId: Int!, $ownerWallet: String!) {
    update_assets_by_pk(
      pk_columns: { id: $assetId }
      _set: { wallet_address: $ownerWallet }
    ) {
      token_id
    }
  }
`;

export const UPDATE_CLAIM_ASSET = gql`
  mutation UpdateClaimAsset($assetId: Int!, $isClaim: Boolean = true) {
    update_assets_by_pk(
      pk_columns: { id: $assetId }
      _set: { is_claim: $isClaim }
    ) {
      token_id
      is_claim
    }
  }
`;

export const UPDATE_SELL_ASSET = gql`
  mutation UpdateSellAsset($assetId: Int!) {
    update_assets_by_pk(
      pk_columns: { id: $assetId }
      _set: { is_locked: true }
    ) {
      token_id
      is_locked
    }
  }
`;

export const UPDATE_UNLOCK_SELL_ASSET = gql`
  mutation UpdateSellAsset($assetId: Int!) {
    update_assets_by_pk(
      pk_columns: { id: $assetId }
      _set: { is_locked: false }
    ) {
      token_id
      is_locked
    }
  }
`;
