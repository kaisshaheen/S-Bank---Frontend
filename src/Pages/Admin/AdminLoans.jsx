import { useEffect, useState } from 'react'
import api from '../../api/axios'

const AdminLoans = () => {
    const [loans,   setLoans]   = useState([])
    const [meta,    setMeta]    = useState(null)
    const [summary, setSummary] = useState(null)
    const [search,  setSearch]  = useState('')
    const [status,  setStatus]  = useState('')
    const [page,    setPage]    = useState(1)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')

    useEffect(() => { fetchLoans() }, [page, status])

    useEffect(() => {
        const timer = setTimeout(() => fetchLoans(), 400)
        return () => clearTimeout(timer)
    }, [search])

    const fetchLoans = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/admin/loans', {
                params: { search, status, page }
            })
            setLoans(res.data.data)
            setMeta(res.data)
            setSummary(res.data.summary)
        } catch {
            setError('Failed to load loans.')
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (loan, action) => {
        try {
            await api.post(`/api/admin/loans/${loan.id}/${action}`)
            setLoans(prev => prev.map(l =>
                l.id === loan.id ? { ...l, status: action === 'approve' ? 'approved' : 'rejected' } : l
            ))
            setSummary(prev => ({
                ...prev,
                pending:  prev.pending - 1,
                approved: action === 'approve' ? prev.approved + 1 : prev.approved,
                rejected: action === 'reject'  ? prev.rejected + 1 : prev.rejected,
            }))
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed.')
        }
    }

    const initials = (name) =>
        name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??'

    const statusBadge = {
        pending:  'bg-yellow-50 text-yellow-700',
        approved: 'bg-green-50 text-green-700',
        rejected: 'bg-red-50 text-red-600',
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-base font-medium text-gray-900">Loans</p>
                    <p className="text-xs text-gray-400 mt-0.5">Review and manage loan requests</p>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 mb-4">{error}</p>
            )}

            {/* Summary metrics */}
            {summary && (
                <div className="grid grid-cols-5 gap-3 mb-5">
                    {[
                        ['Total loans',          summary.total,    'text-gray-900'],
                        ['Pending',              summary.pending,  'text-yellow-600'],
                        ['Approved',             summary.approved, 'text-green-600'],
                        ['Rejected',             summary.rejected, 'text-red-500'],
                        ['Overdue installments', summary.overdue,  'text-red-500'],
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
                <input type="text" placeholder="Search by account owner..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-56" />

                <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="active">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">

                {/* Header row */}
                <div className="grid grid-cols-6 px-4 py-2.5 border-b border-gray-100 gap-2">
                    {['Owner', 'Amount', 'Duration', 'Interest', 'Status', ''].map(h => (
                        <p key={h} className="text-xs font-medium text-gray-400 uppercase tracking-wide m-0">{h}</p>
                    ))}
                </div>

                {loading ? (
                    <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                ) : loans.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No loans found.</div>
                ) : loans.map((loan, i) => (
                    <div key={loan.id}
                        className={`grid grid-cols-6 items-center px-4 py-3 gap-2
                            ${i !== loans.length - 1 ? 'border-b border-gray-100' : ''}
                            ${loan.status === 'pending' ? 'bg-yellow-50/30' : ''}`}>

                        {/* Owner */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                                {initials(loan.account?.user?.name)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 m-0">
                                    {loan.account?.user?.name}
                                </p>
                                <p className="text-xs text-gray-400 m-0">
                                    ${(loan.total_payable / loan.duration_months).toFixed(2)}/mo
                                </p>
                            </div>
                        </div>

                        {/* Amount */}
                        <p className="text-sm font-medium text-gray-800 m-0">
                            ${Number(loan.amount).toLocaleString()}
                        </p>

                        {/* Duration */}
                        <p className="text-sm text-gray-500 m-0">
                            {loan.duration_months} months
                        </p>

                        {/* Interest */}
                        <p className="text-sm text-gray-500 m-0">
                            {loan.interest_rate}%
                        </p>

                        {/* Status */}
                        <div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusBadge[loan.status]}`}>
                                {loan.status}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            {loan.status === 'pending' ? (
                                <>
                                    <button onClick={() => handleAction(loan, 'approve')}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors">
                                        Approve
                                    </button>
                                    <button onClick={() => handleAction(loan, 'reject')}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                                        Reject
                                    </button>
                                </>
                            ) : (
                                <span className="text-xs text-gray-400 capitalize">{loan.status}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {meta && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Showing {meta.from}–{meta.to} of {meta.total} loans
                    </p>
                    <div className="flex gap-1">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                            className="w-7 h-7 rounded border border-gray-200 text-xs text-gray-500 disabled:opacity-30 hover:bg-gray-50">
                            ‹
                        </button>
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
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

export default AdminLoans