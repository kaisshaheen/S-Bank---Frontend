// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const metrics = (data) => [
    { label: 'Total users',        value: data.total_users,                                          sub: 'registered',          color: 'bg-blue-50 text-blue-600'   },
    { label: 'Total accounts',     value: data.total_accounts,                                       sub: 'opened',              color: 'bg-green-50 text-green-600' },
    { label: 'Total funds',        value: `$${Number(data.total_money).toLocaleString()}`,            sub: 'across all accounts', color: 'bg-purple-50 text-purple-600'},
    { label: 'Pending loans',      value: data.pending_loans,                                        sub: 'awaiting approval',   color: 'bg-yellow-50 text-yellow-600'},
    { label: 'Active loans',       value: data.total_active_loans,                                   sub: 'approved',            color: 'bg-sky-50 text-sky-600'     },
    { label: 'Overdue installments',value: data.overdue_installments,                                sub: 'need attention',      color: 'bg-red-50 text-red-600'     },
    { label: 'Deposits today',     value: `$${Number(data.deposits_today).toLocaleString()}`,        sub: 'today',               color: 'bg-emerald-50 text-emerald-600'},
    { label: 'Withdrawals today',  value: `$${Number(data.withdrawals_today).toLocaleString()}`,     sub: 'today',               color: 'bg-orange-50 text-orange-600'},
]

const typeBadge = {
    deposit:  'bg-green-50 text-green-700',
    withdraw: 'bg-red-50 text-red-600',
    transfer: 'bg-blue-50 text-blue-700',
}

const AdminDashboard = () => {
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')
    const navigate              = useNavigate()

    useEffect(() => {
        api.get('/api/admin/dashboard')
            .then(res  => setData(res.data))
            .catch(err => {
                if (err.response?.status === 403) navigate('/admin/login')
                setError('Failed to load dashboard.')
            })
            .finally(() => setLoading(false))
            console.log("Dashboard data:", data)
    }, [])

    const handleLoan = async (id, action) => {
        try {
            await api.post(`/api/admin/loans/${id}/${action}`)
            setData(prev => ({
                ...prev,
                pending_loans:      prev.pending_loans - 1,
                recent_transactions: prev.recent_transactions,
            }))
        } catch {
            setError('Action failed.')
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Loading dashboard...
        </div>
    )

    if (error) return (
        <div className="flex items-center justify-center h-full text-sm text-red-400">{error}</div>
    )

    return (
        <div>
            {/* Metrics grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {metrics(data).map(m => (
                    <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${m.color.split(' ')[0]}`}>
                            <div className={`w-2 h-2 rounded-full ${m.color.split(' ')[1].replace('text', 'bg')}`} />
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                        <p className="text-xl font-medium text-gray-900">{m.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">

                {/* Recent transactions */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">Recent transactions</p>
                    </div>
                    <div className="grid grid-cols-4 px-4 py-2 border-b border-gray-100">
                        {['Account', 'Type', 'Amount', 'Date'].map(h => (
                            <p key={h} className={`text-xs font-medium text-gray-400 uppercase tracking-wide m-0 ${h === 'Amount' || h === 'Date' ? 'text-right' : ''}`}>{h}</p>
                        ))}
                    </div>
                    {data.recent_transactions?.map((txn, i) => (
                        <div key={txn.id} className={`grid grid-cols-4 items-center px-4 py-3 ${i !== data.recent_transactions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <p className="text-sm font-medium text-gray-800 m-0 truncate">
                                {txn.from?.user?.name ?? '—'}
                            </p>
                            <div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeBadge[txn.type]}`}>
                                    {txn.type}
                                </span>
                            </div>
                            <p className="text-sm text-right font-medium text-gray-800 m-0">
                                ${Number(txn.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-right text-gray-400 m-0">
                                {new Date(txn.created_at).toLocaleDateString('en', { day: '2-digit', month: 'short' })}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Pending loans */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">Pending loan approvals</p>
                    </div>
                    {data.pending_loan_list?.length === 0 && (
                        <div className="py-10 text-center text-sm text-gray-400">No pending loans.</div>
                    )}
                    {data.pending_loan_list?.map((loan, i) => (
                        <div key={loan.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== data.pending_loan_list.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div>
                                <p className="text-sm font-medium text-gray-800 m-0">
                                    {loan.account?.user?.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 m-0">
                                    ${Number(loan.amount).toLocaleString()} · {loan.duration_months} months
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleLoan(loan.id, 'approve')}
                                    className="text-xs px-3 py-1.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors">
                                    Approve
                                </button>
                                <button onClick={() => handleLoan(loan.id, 'reject')}
                                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard