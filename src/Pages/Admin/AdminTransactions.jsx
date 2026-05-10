// src/pages/admin/AdminTransactions.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([])
    const [meta,         setMeta]         = useState(null)
    const [summary,      setSummary]      = useState(null)
    const [search,       setSearch]       = useState('')
    const [type,         setType]         = useState('')
    const [from,         setFrom]         = useState('')
    const [to,           setTo]           = useState('')
    const [page,         setPage]         = useState(1)
    const [loading,      setLoading]      = useState(true)
    const [error,        setError]        = useState('')

    useEffect(() => { fetchTransactions() }, [page, type, from, to])


    useEffect(() => {
        const timer = setTimeout(() => fetchTransactions(), 400)
        return () => clearTimeout(timer)
    }, [search])

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/admin/transactions', {
                params: { search, type, from, to, page }
            })
            setTransactions(res.data.data)
            setMeta(res.data)
            setSummary(res.data.summary)
        } catch {
            setError('Failed to load transactions.')
        } finally {
            setLoading(false)
        }
    }

    const typeBadge = {
        deposit:  'bg-green-50 text-green-700',
        withdraw: 'bg-red-50 text-red-600',
        transfer: 'bg-blue-50 text-blue-700',
    }

    const amountColor = {
        deposit:  'text-green-600',
        withdraw: 'text-red-500',
        transfer: 'text-blue-600',
    }

    const signs = { deposit: '+', withdraw: '-', transfer: '→' }

    return (
        <div>
            {/* Header */}
            <div className="mb-5">
                <p className="text-base font-medium text-gray-900">Transactions</p>
                <p className="text-xs text-gray-400 mt-0.5">Monitor all account transactions</p>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 mb-4">{error}</p>
            )}

            {/* Summary metrics */}
            {summary && (
                <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                        ['Total transactions', summary.total_transactions,                                                          'text-gray-900'],
                        ['Total deposits',     `$${Number(summary.total_deposits).toLocaleString()}`,                               'text-green-600'],
                        ['Total withdrawals',  `$${Number(summary.total_withdrawals).toLocaleString()}`,                           'text-red-500'],
                        ['Total transfers',    `$${Number(summary.total_transfers).toLocaleString()}`,                             'text-blue-600'],
                    ].map(([label, value, color]) => (
                        <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">{label}</p>
                            <p className={`text-lg font-medium ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-3 mb-4 flex-wrap">
                <input type="text" placeholder="Search by account owner..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-56" />

                <select value={type} onChange={e => { setType(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="">All types</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                    <option value="transfer">Transfer</option>
                </select>

                <input type="date" value={from}
                    onChange={e => { setFrom(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />

                <input type="date" value={to}
                    onChange={e => { setTo(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />

                {(search || type || from || to) && (
                    <button onClick={() => { setSearch(''); setType(''); setFrom(''); setTo(''); setPage(1) }}
                        className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                        Clear filters
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">

                <div className="grid grid-cols-5 px-4 py-2.5 border-b border-gray-100 gap-2">
                    {['From', 'To', 'Type', 'Amount', 'Date'].map((h, i) => (
                        <p key={h} className={`text-xs font-medium text-gray-400 uppercase tracking-wide m-0 ${i >= 3 ? 'text-right' : ''}`}>
                            {h}
                        </p>
                    ))}
                </div>

                {loading ? (
                    <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                ) : transactions.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No transactions found.</div>
                ) : transactions.map((txn, i) => (
                    <div key={txn.id}
                        className={`grid grid-cols-5 items-center px-4 py-3 gap-2
                            ${i !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}>

                        {/* From */}
                        <div>
                            <p className="text-sm font-medium text-gray-800 m-0">
                                {txn.from?.user?.name ?? '—'}
                            </p>
                            <p className="text-xs font-mono text-gray-400 m-0">
                                {txn.from?.account_number ?? ''}
                            </p>
                        </div>

                        {/* To */}
                        <div>
                            <p className="text-sm font-medium text-gray-800 m-0">
                                {txn.to?.user?.name ?? '—'}
                            </p>
                            <p className="text-xs font-mono text-gray-400 m-0">
                                {txn.to?.account_number ?? ''}
                            </p>
                        </div>

                        {/* Type */}
                        <div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeBadge[txn.type]}`}>
                                {txn.type}
                            </span>
                        </div>

                        {/* Amount */}
                        <p className={`text-sm text-right font-medium m-0 ${amountColor[txn.type]}`}>
                            {signs[txn.type]}${Number(txn.amount).toLocaleString('en', { minimumFractionDigits: 2 })}
                        </p>

                        {/* Date */}
                        <p className="text-xs text-right text-gray-400 m-0">
                            {new Date(txn.created_at).toLocaleDateString('en', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            })}
                        </p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {meta && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Showing {meta.from}–{meta.to} of {meta.total} transactions
                    </p>
                    <div className="flex gap-1">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                            className="w-7 h-7 rounded border border-gray-200 text-xs text-gray-500 disabled:opacity-30 hover:bg-gray-50">
                            ‹
                        </button>
                        {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`w-7 h-7 rounded border text-xs transition-colors
                                    ${page === p
                                        ? 'bg-gray-100 border-gray-300 text-gray-800'
                                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
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

export default AdminTransactions