import { UserDetail } from '../../modules/user/user-detail';
import { getServerSideApolloProps } from '../../lib/apollo';

export default UserDetail;

export const getServerSideProps = getServerSideApolloProps({
  hydrateQueries: ['user', 'booksByAuthor'],
});
