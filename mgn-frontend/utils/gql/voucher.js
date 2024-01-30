import { gql } from '@apollo/client';

export const INSERT_VOUHER = gql`
    mutation InsertVoucher($object: vouchers_insert_input!) {
        insert_vouchers_one(object: $object) {
            id
            token_id
            project_id
            zone_id
            expiration_at
            updated_at
        }
    }
`;

export const GET_ALL_VOUCHERS_BY_WALLET_ADDRESS = gql`
    query GetAllVouchersByWalletAddress($walletAddress: String!) {
        vouchers(where: {wallet_address: {_eq: $walletAddress}}) {
            id
            code
            dateUseAt: date_use_at
            expirationAt: expiration_at
            isUsed: is_used
            note
            zone: zone_id
            tokenId: token_id
            projectId: project_id
            createdAt:created_at
            project {
                zoneRewardRate: zone_reward_rate
                projectName: project_name
            }
        }
    }
`;

export const GET_VOUCHER_BY_ID = gql`
    query GetVoucherById($voucherId: Int!) {
        vouchers(where: {id: {_eq: $voucherId}}) {
            id
            code
            dateUseAt: date_use_at
            expirationAt: expiration_at
            isUsed: is_used
            note
            zone: zone_id
            tokenId: token_id
            projectId: project_id
            createdAt:created_at
            project {
                zoneRewardRate: zone_reward_rate
                projectName: project_name
            }
        }
    }
`;