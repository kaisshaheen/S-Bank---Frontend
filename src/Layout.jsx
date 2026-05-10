import { useLocation } from "react-router-dom"
import Header from "./Section/Header"

const Layout = ({ children }) => {
    const { pathname } = useLocation()
    const isAdmin = pathname.startsWith('/admin')
    return (
        <>
            {!isAdmin && <Header />}
            {children}
        </>
    )
}

export default Layout