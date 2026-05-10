import { useState } from 'react'
import api from '../../api/axios'

const PURPOSES  = ['personal', 'business', 'education', 'medical', 'other']
const DURATIONS = [3, 6, 12, 24, 36]
const INTEREST  = 5.5

const LoanRequest = () => {
    const [amount,   setAmount]   = useState('')
    const [purpose,  setPurpose]  = useState('')
    const [duration, setDuration] = useState(null)
    const [errors,   setErrors]   = useState({})
    const [loading,  setLoading]  = useState(false)
    const [success,  setSuccess]  = useState(false)

    const total    = amount ? (parseFloat(amount) * (1 + INTEREST / 100)) : null
    const monthly  = total && duration ? (total / duration) : null

    const validate = () => {
        const e = {}
        const amt = parseFloat(amount)
        if (!amount || isNaN(amt) || amt < 100 || amt > 50000)
            e.amount = 'Amount must be between $100 and $50,000'
        if (!purpose)  e.purpose  = 'Please select a purpose'
        if (!duration) e.duration = 'Please select a repayment period'
        return e
    }

    const handleSubmit = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        setLoading(true)
        setErrors({})
        try {
            await api.post('/api/loan/create', {
                amount : parseFloat(amount),
                purpose,
                interest_rate : INTEREST,
                duration_months : duration,
            })
            setSuccess(true)
        } catch (err) {
            setErrors({ api: err.response?.data?.message || 'Something went wrong.' })
        } finally {
            setLoading(false)
        }
    }

    if (success) return (
        <div className="max-w-md mx-auto mt-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <p className="font-medium text-gray-900 mb-1">Loan request submitted</p>
            <p className="text-sm text-gray-400">Your request is awaiting admin approval. We'll notify you once it's reviewed.</p>
        </div>
    )

    return (
        <div className="max-w-md mx-auto mt-10 px-4">
            <p className="text-lg font-medium text-gray-900 mb-4">Request a loan</p>

            {/* Loan details */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-4">Loan details</p>

                {/* Amount */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500 block mb-1">Loan amount ($)</label>
                    <input type="number" min="100" max="50000" placeholder="e.g. 5000"
                        value={amount}
                        onChange={e => { setAmount(e.target.value); setErrors(ev => ({ ...ev, amount: '' })) }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                </div>

                {/* Purpose */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500 block mb-2">Purpose</label>
                    <div className="flex flex-wrap gap-2">
                        {PURPOSES.map(p => (
                            <button key={p} onClick={() => { setPurpose(p); setErrors(e => ({ ...e, purpose: '' })) }}
                                className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors
                                    ${purpose === p
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                    {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
                </div>

                {/* Duration */}
                <div>
                    <label className="text-xs text-gray-500 block mb-2">Repayment period</label>
                    <div className="flex gap-2">
                        {DURATIONS.map(m => (
                            <button key={m} onClick={() => { setDuration(m); setErrors(e => ({ ...e, duration: '' })) }}
                                className={`flex-1 py-2 rounded-lg border text-sm transition-colors
                                    ${duration === m
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                {m}mo
                            </button>
                        ))}
                    </div>
                    {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Loan summary</p>
                {[
                    ['Loan amount',        amount   ? `$${parseFloat(amount).toLocaleString('en', { minimumFractionDigits: 2 })}` : '—'],
                    ['Interest rate',      '5.5%'],
                    ['Total payable',      total    ? `$${total.toFixed(2)}`   : '—'],
                    ['Monthly installment',monthly  ? `$${monthly.toFixed(2)}` : '—', true],
                    ['Duration',           duration ? `${duration} months`     : '—'],
                ].map(([label, value, highlight]) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-none">
                        <span className="text-xs text-gray-400">{label}</span>
                        <span className={`text-sm font-medium ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            {errors.api && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 mb-3">{errors.api}</p>
            )}

            <button onClick={handleSubmit} disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? 'Submitting...' : 'Submit loan request'}
            </button>
        </div>
    )
}

export default LoanRequest