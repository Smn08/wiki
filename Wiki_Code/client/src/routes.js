import { ADMIN_ROUTE, LOGIN_ROUTE, REDACT_ROUTER, REGISTRATION_ROUTER, USERS_ROUTER, USER_ROUTER, WIKIS_ROUTER } from "./utils/consts"
import  Admin from "./pages/Admin"
import UserPage from "./pages/UserPage"
import WikiRedact from "./pages/WikiRedact"
import Auth from "./pages/Auth"
import Wikis from "./pages/Wikis"
import Users from "./pages/Users"


export const authRoutes = [
    {
        patch: ADMIN_ROUTE,
        Component: Admin
    },
    {
        patch: USER_ROUTER + '/:id',
        Component: UserPage
    },
    {
        patch: REDACT_ROUTER + '/:id',
        Component: WikiRedact
    }
]

export const publicRoutes = [
    {
        patch: LOGIN_ROUTE,
        Component: Auth
    },
    {
        patch: REGISTRATION_ROUTER,
        Component: Auth
    },
    {
        patch: WIKIS_ROUTER,
        Component: Wikis
    },
    {   
        patch: USERS_ROUTER,
        Component: Users
    }
]