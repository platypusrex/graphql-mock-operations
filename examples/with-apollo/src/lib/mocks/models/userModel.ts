import { mockBuilder } from '../builder';

mockBuilder.createModel('user', [
  {
    id: '1',
    name: 'Zirkle Haugen',
    email: 'zhaugen@email.com',
    address: [
      {
        addressLineOne: '100 Baker Ave',
        city: 'Charleston',
        state: 'SC',
        zip: '29412',
      },
    ],
  },
  {
    id: '2',
    name: 'Ziegler Johnson',
    email: 'zjohnson@email.com',
    address: [
      {
        addressLineOne: '200 Lakeside Dr',
        city: 'Charleston',
        state: 'SC',
        zip: '29412',
      },
    ],
  },
  {
    id: '3',
    name: 'Zerbe Evans',
    email: 'zevans@email.com',
    address: [
      {
        addressLineOne: '300 Franklin Dr',
        city: 'Mt Pleasant',
        state: 'SC',
        zip: '29464',
      },
    ],
  },
  {
    id: '4',
    name: 'Zacharias Wright',
    email: 'zwright@email.com',
    address: [
      {
        addressLineOne: '500 Sycamore Ln',
        city: 'Mt Pleasant',
        state: 'SC',
        zip: '29464',
      },
    ],
  },
]);
