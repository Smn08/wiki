import { ADMIN_ROUTE, LOGIN_ROUTE, REDACT_ROUTER, REGISTRATION_ROUTER, USERS_ROUTER, USER_ROUTER, WIKIS_ROUTER } from "./utils/consts"
import Admin from "./pages/Admin"
import UserPage from "./pages/UserPage"
import WikiRedact from "./pages/WikiRedact"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import Wikis from "./pages/Wikis"
import UserManagement from "./components/UserManagement"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: ADMIN_ROUTE + '/users',
        Component: UserManagement
    },
    {
        path: USER_ROUTER + '/:id',
        Component: UserPage
    },
    {
        path: REDACT_ROUTER + '/:id',
        Component: WikiRedact
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: REGISTRATION_ROUTER,
        Component: Registration
    },
    {
        path: WIKIS_ROUTER,
        Component: Wikis
    }
]