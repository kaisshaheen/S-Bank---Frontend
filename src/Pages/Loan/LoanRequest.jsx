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

    const total   = amount ? (parseFloat(amount) * (1 + INTEREST / 100)) : null
    const monthly = total && duration ? (total / duration) : null

    const validate = () => {
        const e   = {}
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
                amount:          parseFloat(amount),
                purpose,
                interest_rate:   INTEREST,
                duration_months: duration,
            })
            setSuccess(true)
        } catch (err) {
            setErrors({ api: err.response?.data?.message || 'Something went wrong.' })
        } finally {
            setLoading(false)
        }
    }

    if (success) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#16A34A" strokeWidth="1.5"/>
                        <path d="M7 12l3 3 7-7" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <p className="font-semibold text-gray-900 mb-2">Loan request submitted</p>
                <p className="text-sm text-gray-400">
                    Your request is awaiting admin approval. We'll notify you once it's reviewed.
                </p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
            <div className="max-w-lg mx-auto">

                <p className="text-lg font-semibold text-gray-900 mb-4">Request a loan</p>

                {/* Loan details */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-700 mb-4">Loan details</p>

                    {/* Amount */}
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 block mb-1.5">Loan amount ($)</label>
                        <input type="number" min="100" max="50000" placeholder="e.g. 5000"
                            value={amount}
                            onChange={e => { setAmount(e.target.value); setErrors(ev => ({ ...ev, amount: '' })) }}
                            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        {errors.amount && <p className="text-xs text-red-500 mt-1.5">{errors.amount}</p>}
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
                        {errors.purpose && <p className="text-xs text-red-500 mt-1.5">{errors.purpose}</p>}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="text-xs text-gray-500 block mb-2">Repayment period</label>
                        {/* Scrollable row on mobile, normal flex on sm+ */}
                        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                            {DURATIONS.map(m => (
                                <button key={m}
                                    onClick={() => { setDuration(m); setErrors(e => ({ ...e, duration: '' })) }}
                                    className={`flex-shrink-0 sm:flex-1 px-4 sm:px-0 py-2.5 rounded-xl border text-sm transition-colors
                                        ${duration === m
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                    {m}mo
                                </button>
                            ))}
                        </div>
                        {errors.duration && <p className="text-xs text-red-500 mt-1.5">{errors.duration}</p>}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-700 mb-3">Loan summary</p>
                    {[
                        ['Loan amount',         amount   ? `$${parseFloat(amount).toLocaleString('en', { minimumFractionDigits: 2 })}` : '—', false],
                        ['Interest rate',       '5.5%',                                                                                         false],
                        ['Total payable',       total    ? `$${total.toFixed(2)}`   : '—',                                                      false],
                        ['Monthly installment', monthly  ? `$${monthly.toFixed(2)}` : '—',                                                      true],
                        ['Duration',            duration ? `${duration} months`     : '—',                                                      false],
                    ].map(([label, value, highlight]) => (
                        <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-none">
                            <span className="text-xs text-gray-400">{label}</span>
                            <span className={`text-sm font-medium ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {errors.api && (
                    <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 mb-4">{errors.api}</p>
                )}

                <button onClick={handleSubmit} disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#3931aa] text-white text-sm font-semibold hover:bg-[#2e2890] active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
                    {loading ? 'Submitting...' : 'Submit loan request'}
                </button>
            </div>
        </div>
    )
}

export default LoanRequest