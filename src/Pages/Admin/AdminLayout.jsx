import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import api from '../../api/axios'

const navItems = [
    { path: '/admin/dashboard',    label: 'Dashboard',    icon: 'grid' },
    { path: '/admin/users',        label: 'Users',        icon: 'user' },
    { path: '/admin/accounts',     label: 'Accounts',     icon: 'card' },
    { path: '/admin/transactions', label: 'Transactions', icon: 'list' },
    { path: '/admin/loans',        label: 'Loans',        icon: 'loan', badge: true },
]

const Icon = ({ name }) => {
    const icons = {
        grid: <><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/></>,
        user: <><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>,
        card: <><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 7h14" stroke="currentColor" strokeWidth="1.2"/></>,
        list: <><path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>,
        loan: <><path d="M8 1v14M3 5l5-4 5 4M3 11l5 4 5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></>,
    }
    return <svg width="15" height="15" viewBox="0 0 16 16" fill="none">{icons[name]}</svg>
}

const AdminLayout = ({ pendingLoans = 0 }) => {
    const navigate  = useNavigate()
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}')
    const initials  = adminUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'SA'

    const handleLogout = async () => {
        try {
            await api.post('/api/logout')
        } finally {
            localStorage.removeItem('admin_user')
            navigate('/admin/login')
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden text-sm">

            {/* Sidebar */}
            <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">BankSystem</p>
                    <p className="text-xs text-gray-400">Admin panel</p>
                </div>

                <nav className="flex-1 py-3">
                    <p className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Main</p>
                    {navItems.slice(0, 1).map(item => (
                        <NavLink key={item.path} to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg transition-colors
                                ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                            <Icon name={item.icon} />
                            {item.label}
                        </NavLink>
                    ))}

                    <p className="px-4 py-2 mt-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Management</p>
                    {navItems.slice(1).map(item => (
                        <NavLink key={item.path} to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg transition-colors
                                ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                            <Icon name={item.icon} />
                            {item.label}
                            {item.badge && pendingLoans > 0 && (
                                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600">
                                    {pendingLoans}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{adminUser?.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{adminUser?.email}</p>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
                    <div>
                        <p className="font-medium text-gray-900">Welcome back, {adminUser?.name}</p>
                        <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <button onClick={handleLogout}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                        Sign out
                    </button>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout