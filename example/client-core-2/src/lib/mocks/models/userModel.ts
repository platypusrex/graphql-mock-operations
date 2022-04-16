import { mockBuilder } from '../builder';
import { UserMockOperation } from '../../../typings/generated';
import { OperationModelType } from '@graphql-mock-operations/core-temp/dist/types';

export type UserModel = OperationModelType<UserMockOperation>;

mockBuilder.createModel<UserMockOperation>('user', [
  {
    id: '1',
    name: 'Frank',
    address: [
      { addressLineOne: '1592 Glen Erin Dr', city: 'Mt Pleasant', state: 'SC', zip: '29464' },
    ],
  },
  {
    id: '2',
    name: 'Jen',
    address: [
      { addressLineOne: '1592 Glen Erin Dr', city: 'Mt Pleasant', state: 'SC', zip: '29464' },
    ],
  },
  {
    id: '3',
    name: 'Dylan',
    address: [
      { addressLineOne: '1592 Glen Erin Dr', city: 'Mt Pleasant', state: 'SC', zip: '29464' },
    ],
  },
  {
    id: '4',
    name: 'Dublin',
    address: [
      { addressLineOne: '1592 Glen Erin Dr', city: 'Mt Pleasant', state: 'SC', zip: '29464' },
    ],
  },
]);
