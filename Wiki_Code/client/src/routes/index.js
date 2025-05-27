import Wikis from '../pages/Wikis';
import UserManagement from '../components/UserManagement';
import { ADMIN_ROUTE, USER_ROUTER, WIKIS_ROUTER } from '../utils/consts';

export const authRoutes = [
    {
        path: ADMIN_ROUTE + '/users',
        Component: UserManagement
    }
];

export const publicRoutes = [
    {
        path: WIKIS_ROUTER,
        Component: Wikis
    },
    {
        path: USER_ROUTER + '/:id',
        Component: Wikis
    }
]; 