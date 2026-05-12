import { useEffect, useState } from 'react'
import api from '../../api/axios'

const statusBadge = {
    pending:  'bg-yellow-50 text-yellow-700',
    approved: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-600',
}

const installmentBadge = {
    paid:   'bg-green-50 text-green-700',
    unpaid: 'bg-gray-100 text-gray-500',
    overdue:'bg-red-50 text-red-600',
}

const MyLoan = () => {
    const [loan,         setLoan]         = useState(null)
    const [installments, setInstallments] = useState([])
    const [loading,      setLoading]      = useState(true)
    const [paying,       setPaying]       = useState(null)
    const [error,        setError]        = useState('')
    const [success,      setSuccess]      = useState('')

    useEffect(() => { fetchLoan() }, [])

    const fetchLoan = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/loan')
            setLoan(res.data)
            setInstallments(res.data.installments)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load loan.')
        } finally {
            setLoading(false)
        }
    }

    const handlePay = async (installment) => {
        setPaying(installment.id)
        setError('')
        setSuccess('')
        try {
            await api.post(`/api/loan/installment/${installment.id}/pay`)
            setSuccess(`Installment #${installment.month_number} paid successfully.`)
            fetchLoan()
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed.')
        } finally {
            setPaying(null)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-400">
            Loading loan...
        </div>
    )

    if (error && !loan) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-sm text-red-400 mb-3">{error}</p>
            </div>
        </div>
    )

    if (!loan) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-sm text-gray-400">You don't have an active loan.</p>
            </div>
        </div>
    )

    const paid     = installments?.filter(i => i.status === 'paid').length
    const total    = installments?.length
    const progress = total ? Math.round((paid / total) * 100) : 0
    const remaining = installments
        ?.filter(i => i.status !== 'paid')
        .reduce((sum, i) => sum + parseFloat(i.amount), 0)

    const nextUnpaid = installments?.find(i => i.status !== 'paid')

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-semibold text-gray-900">My loan</p>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusBadge[loan.status]}`}>
                        {loan.status}
                    </span>
                </div>

                {success && (
                    <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 mb-4">{success}</p>
                )}
                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">{error}</p>
                )}

                {/* Overview */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-700 mb-3">Loan overview</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                            ['Loan amount',         `$${Number(loan.amount).toLocaleString('en', { minimumFractionDigits: 2 })}`,            null],
                            ['Total payable',       `$${Number(loan.total_payable).toLocaleString('en', { minimumFractionDigits: 2 })}`,      null],
                            ['Monthly installment', `$${(loan.total_payable / loan.duration_months).toFixed(2)}`,                            'text-blue-600'],
                            ['Remaining balance',   `$${remaining?.toFixed(2)}`,                                                             'text-red-500'],
                        ].map(([label, value, color]) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">{label}</p>
                                <p className={`text-sm sm:text-base font-semibold ${color ?? 'text-gray-900'}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Repayment progress</span>
                        <span>{paid} of {total} paid</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Installments — desktop table */}
                <div className="hidden sm:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-700">Installments</p>
                    </div>
                    <div className="grid grid-cols-5 px-4 py-2 border-b border-gray-100 gap-2">
                        {['#', 'Due date', 'Amount', 'Status', ''].map(h => (
                            <p key={h} className="text-xs font-medium text-gray-400 uppercase tracking-wide m-0">{h}</p>
                        ))}
                    </div>
                    {installments?.map((inst, i) => {
                        const isNext      = nextUnpaid?.id === inst.id
                        const isOverdue   = inst.status !== 'paid' && new Date(inst.due_date) < new Date()
                        const displayStatus = inst.status === 'paid' ? 'paid' : isOverdue ? 'overdue' : 'unpaid'
                        return (
                            <div key={inst.id}
                                className={`grid grid-cols-5 items-center px-4 py-3 gap-2 text-sm
                                    ${i !== installments.length - 1 ? 'border-b border-gray-100' : ''}
                                    ${isOverdue && inst.status !== 'paid' ? 'bg-red-50/40' : ''}`}>
                                <span className="text-gray-400 font-medium">{inst.month_number}</span>
                                <span className="text-gray-700 text-xs">
                                    {new Date(inst.due_date).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="font-medium text-gray-800">${Number(inst.amount).toFixed(2)}</span>
                                <span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${installmentBadge[displayStatus]}`}>
                                        {displayStatus}
                                    </span>
                                </span>
                                <span className="text-right">
                                    {isNext && (
                                        <button onClick={() => handlePay(inst)}
                                            disabled={loan.status === 'pending' || paying === inst.id}
                                            className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-40">
                                            {paying === inst.id ? '...' : 'Pay now'}
                                        </button>
                                    )}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Installments — mobile cards */}
                <div className="sm:hidden space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Installments</p>
                    {installments?.map(inst => {
                        const isNext        = nextUnpaid?.id === inst.id
                        const isOverdue     = inst.status !== 'paid' && new Date(inst.due_date) < new Date()
                        const displayStatus = inst.status === 'paid' ? 'paid' : isOverdue ? 'overdue' : 'unpaid'
                        return (
                            <div key={inst.id}
                                className={`bg-white border border-gray-200 rounded-xl px-4 py-3
                                    ${isOverdue && inst.status !== 'paid' ? 'border-red-200 bg-red-50/30' : ''}`}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-400">#{inst.month_number}</span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${installmentBadge[displayStatus]}`}>
                                            {displayStatus}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">
                                        ${Number(inst.amount).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Due {new Date(inst.due_date).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    {isNext && (
                                        <button onClick={() => handlePay(inst)}
                                            disabled={loan.status === 'pending' || paying === inst.id}
                                            className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-40">
                                            {paying === inst.id ? '...' : 'Pay now'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}

export default MyLoan