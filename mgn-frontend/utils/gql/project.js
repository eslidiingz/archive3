import { gql } from '@apollo/client';

export const GET_ALL_ACTIVE_PROJECTS = gql`
  query GetAllActiveProjects ($date: timestamptz){
    projects(
      where: {is_opened: {_eq: true}, end_sale_time: {_gt: $date}}
    ) {
        id
        zone_id
        project_id
        project_name
        clinic_name
        start_sale_time
        end_sale_time
        end_holding_time
        clinic_reward_rate
        land_price
        zone_max
        zone_name
        zone_reward_rate
        is_opened
    }
  }
`;