import { useEffect, useState } from 'react'
import api from '../../api/axios'

const FILTERS = ['all', 'deposit', 'withdraw', 'transfer']

const badgeClass = {
    deposit:  'bg-green-50 text-green-700',
    withdraw: 'bg-red-50 text-red-600',
    transfer: 'bg-blue-50 text-blue-700',
}

const amountClass = {
    deposit:  'text-green-600',
    withdraw: 'text-red-500',
    transfer: 'text-blue-600',
}

const signs = { deposit: '+', withdraw: '-', transfer: '→' }

const History = () => {
    const [transactions, setTransactions] = useState([])
    const [meta,         setMeta]         = useState(null)
    const [filter,       setFilter]       = useState('all')
    const [page,         setPage]         = useState(1)
    const [loading,      setLoading]      = useState(true)
    const [error,        setError]        = useState('')

    useEffect(() => { fetchHistory() }, [page])

    const fetchHistory = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await api.get(`/api/transcation/history?page=${page}`)
            setTransactions(res.data.transactions.data)
            setMeta(res.data.transactions)
        } catch {
            setError('Failed to load transactions.')
        } finally {
            setLoading(false)
        }
    }

    const filtered = filter === 'all'
        ? transactions
        : transactions.filter(t => t.type === filter)

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <p className="text-lg font-semibold text-gray-900">Transaction history</p>

                    {/* Filters — scrollable on mobile */}
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors capitalize
                                    ${filter === f
                                        ? 'bg-gray-100 border-gray-300 text-gray-800'
                                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table — desktop */}
                <div className="hidden sm:block bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-4 px-4 py-2.5 border-b border-gray-100">
                        {['Description', 'Type', 'Amount', 'Date'].map(h => (
                            <p key={h} className={`text-xs font-medium text-gray-400 uppercase tracking-wide m-0
                                ${h === 'Amount' || h === 'Date' ? 'text-right' : ''}`}>
                                {h}
                            </p>
                        ))}
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                    ) : error ? (
                        <div className="py-12 text-center text-sm text-red-400">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-400">No transactions found.</div>
                    ) : filtered.map((txn, i) => (
                        <div key={txn.id}
                            className={`grid grid-cols-4 items-center px-4 py-3 gap-2
                                ${i !== filtered.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <p className="text-sm font-medium text-gray-800 truncate m-0">
                                {txn.description ?? `Transaction #${txn.id}`}
                            </p>
                            <div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${badgeClass[txn.type]}`}>
                                    {txn.type}
                                </span>
                            </div>
                            <p className={`text-sm text-right m-0 font-medium ${amountClass[txn.type]}`}>
                                {signs[txn.type]}${Number(txn.amount).toLocaleString('en', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-right text-gray-400 m-0">
                                {new Date(txn.created_at).toLocaleDateString('en', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                })}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Cards — mobile */}
                <div className="sm:hidden space-y-2">
                    {loading ? (
                        <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                    ) : error ? (
                        <div className="py-12 text-center text-sm text-red-400">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-400">No transactions found.</div>
                    ) : filtered.map(txn => (
                        <div key={txn.id}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate mb-1">
                                    {txn.description ?? `Transaction #${txn.id}`}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${badgeClass[txn.type]}`}>
                                        {txn.type}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(txn.created_at).toLocaleDateString('en', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <p className={`text-sm font-semibold flex-shrink-0 ${amountClass[txn.type]}`}>
                                {signs[txn.type]}${Number(txn.amount).toLocaleString('en', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {meta && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
                        <p className="text-xs text-gray-400 text-center sm:text-left">
                            Showing {meta.from}–{meta.to} of {meta.total} transactions
                        </p>
                        <div className="flex justify-center gap-1">
                            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                                className="w-8 h-8 rounded border border-gray-200 text-xs text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors">
                                ‹
                            </button>
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded border text-xs transition-colors
                                        ${page === p
                                            ? 'bg-gray-100 border-gray-300 text-gray-800'
                                            : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page}
                                className="w-8 h-8 rounded border border-gray-200 text-xs text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors">
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default History