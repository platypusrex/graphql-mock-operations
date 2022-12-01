import { mockBuilder } from '../builder';

mockBuilder.createModel('book', [
  {
    id: '1',
    title: 'Titan Sinking',
    authorId: '3',
    numPages: 200,
  },
  {
    id: '2',
    title: 'Crimson Dust',
    authorId: '2',
    numPages: 200,
  },
  {
    id: '3',
    title: 'Dawn of Kaus',
    authorId: '1',
    numPages: 200,
  },
  {
    id: '4',
    title: 'Bionic Revelation',
    authorId: '4',
    numPages: 200,
  },
]);
