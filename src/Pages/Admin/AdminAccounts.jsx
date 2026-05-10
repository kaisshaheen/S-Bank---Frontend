import { useEffect, useState } from 'react'
import api from '../../api/axios'

const AdminAccounts = () => {
    const [accounts, setAccounts] = useState([])
    const [meta,     setMeta]     = useState(null)
    const [summary,  setSummary]  = useState(null)
    const [search,   setSearch]   = useState('')
    const [status,   setStatus]   = useState('')
    const [type,     setType]     = useState('')
    const [page,     setPage]     = useState(1)
    const [loading,  setLoading]  = useState(true)
    const [error,    setError]    = useState('')

    useEffect(() => { fetchAccounts() }, [page, status, type])

    useEffect(() => {
        const timer = setTimeout(() => fetchAccounts(), 400)
        return () => clearTimeout(timer)
    }, [search])

    const fetchAccounts = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/admin/accounts', {
                params: { search, status, type, page }
            })
            setAccounts(res.data.data)
            setMeta(res.data)
            setSummary(res.data.summary)
        } catch {
            setError('Failed to load accounts.')
        } finally {
            setLoading(false)
        }
    }

    const handleToggle = async (account) => {
        try {
            await api.post(`/api/admin/accounts/${account.id}/toggle-status`)
            setAccounts(prev => prev.map(a =>
                a.id === account.id
                    ? { ...a, status: a.status === 'active' ? 'frozen' : 'active' }
                    : a
            ))
        } catch {
            setError('Failed to update account status.')
        }
    }

    const initials = (name) =>
        name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??'

    const statusBadge = {
        active:    'bg-green-50 text-green-700',
        suspended: 'bg-red-50 text-red-600',
    }

    const typeBadge = {
        saving:  'bg-blue-50 text-blue-700',
        current: 'bg-yellow-50 text-yellow-700',
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-base font-medium text-gray-900">Accounts</p>
                    <p className="text-xs text-gray-400 mt-0.5">Manage all bank accounts</p>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 mb-4">{error}</p>
            )}

            {/* Summary metrics */}
            {summary && (
                <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                        ['Total accounts', summary.total,     'text-gray-900'],
                        ['Active',         summary.active,    'text-green-600'],
                        ['Frozen',      summary.suspended, 'text-red-500'],
                        ['Total balance',  `$${Number(summary.total_balance).toLocaleString()}`, 'text-blue-600'],
                    ].map(([label, value, color]) => (
                        <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">{label}</p>
                            <p className={`text-lg font-medium ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-3 mb-4">
                <input type="text" placeholder="Search by name or account number..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64" />

                <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="frozen">Frozen</option>
                </select>

                <select value={type} onChange={e => { setType(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="">All types</option>
                    <option value="saving">Saving</option>
                    <option value="current">Current</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
                <div className="grid grid-cols-6 px-4 py-2.5 border-b border-gray-100 gap-2">
                    {['Owner', 'Account number', 'Type', 'Balance', 'Status', ''].map(h => (
                        <p key={h} className="text-xs font-medium text-gray-400 uppercase tracking-wide m-0">{h}</p>
                    ))}
                </div>

                {loading ? (
                    <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                ) : accounts.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No accounts found.</div>
                ) : accounts.map((acc, i) => (
                    <div key={acc.id}
                        className={`grid grid-cols-6 items-center px-4 py-3 gap-2
                            ${i !== accounts.length - 1 ? 'border-b border-gray-100' : ''}
                            ${acc.status === 'suspended' ? 'bg-red-50/30' : ''}`}>

                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                                {initials(acc.user?.name)}
                            </div>
                            <p className="text-sm font-medium text-gray-800 m-0 truncate">{acc.user?.name}</p>
                        </div>

                        <p className="text-xs font-mono text-gray-500 m-0">{acc.account_number}</p>

                        <div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeBadge[acc.type] ?? 'bg-gray-100 text-gray-600'}`}>
                                {acc.type}
                            </span>
                        </div>

                        <p className="text-sm font-medium text-gray-800 m-0">
                            ${Number(acc.balance).toLocaleString('en', { minimumFractionDigits: 2 })}
                        </p>

                        <div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusBadge[acc.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                {acc.status}
                            </span>
                        </div>

                        <div>
                            <button onClick={() => handleToggle(acc)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap
                                    ${acc.status === 'active'
                                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                                        : 'border-green-200 text-green-700 hover:bg-green-50'}`}>
                                {acc.status === 'active' ? 'Frozen' : 'Activate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {meta && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Showing {meta.from}–{meta.to} of {meta.total} accounts
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

export default AdminAccounts