import Wikis from '../pages/Wikis';
import UserManagement from '../components/UserManagement';
import UserPage from '../pages/UserPage';
import WikiRedact from '../pages/WikiRedact';
import { ADMIN_ROUTE, USER_ROUTER, WIKIS_ROUTER, REDACT_ROUTER } from '../utils/consts';

export const authRoutes = [
    {
        path: ADMIN_ROUTE + '/users',
        Component: UserManagement
    },
    {
        path: REDACT_ROUTER + '/:id',
        Component: WikiRedact
    }
];

export const publicRoutes = [
    {
        path: WIKIS_ROUTER,
        Component: Wikis
    }
]; 