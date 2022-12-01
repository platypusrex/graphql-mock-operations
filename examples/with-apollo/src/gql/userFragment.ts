import { gql } from '@apollo/client';
import { addressFragment } from './addressFragment';

export const userFragment = gql`
  fragment User on User {
    id
    name
    address {
      ...Address
    }
  }
  ${addressFragment}
`;
