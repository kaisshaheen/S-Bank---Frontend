// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const AdminUsers = () => {
    const [users,   setUsers]   = useState([])
    const [meta,    setMeta]    = useState(null)
    const [search,  setSearch]  = useState('')
    const [role,    setRole]    = useState('')
    const [status,  setStatus]  = useState('')
    const [page,    setPage]    = useState(1)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')

    useEffect(() => {
        fetchUsers()
    }, [page, role, status])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => fetchUsers(), 400)
        return () => clearTimeout(timer)
    }, [search])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/admin/users', {
                params: { search, role, status, page }
            })
            setUsers(res.data.data)
            setMeta(res.data)
        } catch {
            setError('Failed to load users.')
        } finally {
            setLoading(false)
        }
    }

    const handleBan = async (user) => {
        try {
            await api.post(`/api/admin/users/${user.id}/ban`)
            setUsers(prev => prev.map(u =>
                u.id === user.id
                    ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' }
                    : u
            ))
        } catch {
            setError('Failed to update user status.')
        }
    }

    const initials = (name) =>
        name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??'

    const statusBadge = {
        active: 'bg-green-50 text-green-700',
        banned: 'bg-red-50 text-red-600',
    }

    const roleBadge = {
        user:  'bg-gray-100 text-gray-600',
        admin: 'bg-blue-50 text-blue-700',
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-base font-medium text-gray-900">Users</p>
                    <p className="text-xs text-gray-400 mt-0.5">Manage all registered users</p>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 mb-4">{error}</p>
            )}

            {/* Filters */}
            <div className="flex gap-3 mb-4">
                <input type="text" placeholder="Search by name or email..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-56" />

                <select value={role} onChange={e => { setRole(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="">All roles</option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                </select>

                <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">

                {/* Header row */}
                <div className="grid grid-cols-6 px-4 py-2.5 border-b border-gray-100 gap-2">
                    {['Name', 'Email', 'Role', 'Status', 'Verified', ''].map(h => (
                        <p key={h} className="text-xs font-medium text-gray-400 uppercase tracking-wide m-0">{h}</p>
                    ))}
                </div>

                {loading ? (
                    <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No users found.</div>
                ) : users.map((user, i) => (
                    <div key={user.id}
                        className={`grid grid-cols-6 items-center px-4 py-3 gap-2
                            ${i !== users.length - 1 ? 'border-b border-gray-100' : ''}
                            ${user.status === 'banned' ? 'bg-red-50/30' : ''}`}>

                        {/* Name */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                                {initials(user.name)}
                            </div>
                            <p className="text-sm font-medium text-gray-800 m-0 truncate">{user.name}</p>
                        </div>

                        {/* Email */}
                        <p className="text-sm text-gray-500 m-0 truncate">{user.email}</p>

                        {/* Role */}
                        <div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${roleBadge[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                                {user.role}
                            </span>
                        </div>

                        {/* Status */}
                        <div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusBadge[user.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                {user.status}
                            </span>
                        </div>

                        {/* Verified */}
                        <div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.email_verified_at ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                {user.email_verified_at ? 'Verified' : 'Unverified'}
                            </span>
                        </div>

                        {/* Action */}
                        <div>
                            {user.role !== 'admin' && (
                                <button onClick={() => handleBan(user)}
                                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors
                                        ${user.status === 'banned'
                                            ? 'border-green-200 text-green-700 hover:bg-green-50'
                                            : 'border-red-200 text-red-600 hover:bg-red-50'}`}>
                                    {user.status === 'banned' ? 'Unban' : 'Ban'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {meta && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Showing {meta.from}–{meta.to} of {meta.total} users
                    </p>
                    <div className="flex gap-1">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                            className="w-7 h-7 rounded border border-gray-200 text-xs text-gray-500 disabled:opacity-30 hover:bg-gray-50">
                            ‹
                        </button>
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`w-7 h-7 rounded border text-xs transition-colors
                                    ${page === p ? 'bg-gray-100 border-gray-300 text-gray-800' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                {p}
                            </button>
                        ))}
                        <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page}
                            className="w-7 h-7 rounded border border-gray-200 text-xs text-gray-500 disabled:opacity-30 hover:bg-gray-50">
                            ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsers