import { ADMIN_ROUTE, LOGIN_ROUTE, REDACT_ROUTER, REGISTRATION_ROUTER, USERS_ROUTER, USER_ROUTER, WIKIS_ROUTER } from "./utils/consts"
import Admin from "./pages/Admin"
import UserPage from "./pages/UserPage"
import WikiRedact from "./pages/WikiRedact"
import Auth from "./pages/Auth"
import Wikis from "./pages/Wikis"
import Users from "./pages/Users"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: ADMIN_ROUTE + '/users',
        Component: Users
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
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTER,
        Component: Auth
    },
    {
        path: WIKIS_ROUTER,
        Component: Wikis
    }
]