import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Link } from 'react-router-dom'

const Account = () => {
    const [loan,    setLoan]    = useState(null)
    const [account, setAccount] = useState(null)
    const [user,    setUser]    = useState(null)
    const [modal,   setModal]   = useState(null)
    const [form,    setForm]    = useState({ amount: '', to_account: '' })
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState('')
    const [success, setSuccess] = useState('')

    const fetchAccount = async () => {
        try {
            const res = await api.get('/api/account')
            setAccount(res.data.account)
            setUser(res.data.account.account_owner)
        } catch {
            setError('Failed to load account.')
        } finally {
            setLoading(false)
        }
    }

    const fetchLoan = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/loan')
            setLoan(res.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load loan.')
        }
    }

    useEffect(() => {
        fetchLoan()
        fetchAccount()
    }, [])

    const openModal = (type) => {
        setModal(type)
        setForm({ amount: '', to_account: '' })
        setError('')
        setSuccess('')
    }

    const closeModal = () => setModal(null)

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            const endpoints = {
                deposit:  '/api/transcation/deposit',
                withdraw: '/api/transcation/withdraw',
                transfer: '/api/transcation/transfer',
            }
            const payload = modal === 'transfer'
                ? { amount: form.amount, to_account: form.to_account }
                : { amount: form.amount }

            const res = await api.post(endpoints[modal], payload)
            setSuccess(res.data.message || 'Done.')
            setModal(null)
            await fetchAccount()
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    if (!account) return (
        <div className="flex items-center justify-center min-h-[60vh] text-gray-400 text-sm">
            Loading account...
        </div>
    )

    const initials = user?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??'

    const navLinks = [
        { to: '/account/history', label: 'Transaction History', always: true },
        loan
            ? { to: '/loan/my-loan',  label: 'My Loan' }
            : { to: '/loan/request',  label: 'Request a Loan' },
        { to: '/statement', label: 'Statement', always: true },
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
            <div className="max-w-lg mx-auto w-full">

                {/* Account card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-4 shadow-sm">

                    {/* Owner info */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-semibold text-sm sm:text-base flex-shrink-0">
                            {initials}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{user}</p>
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Active
                            </span>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                            <p className="text-xs text-gray-400 mb-1">Account number</p>
                            <p className="font-mono text-xs sm:text-sm font-medium text-gray-900 break-all">
                                {account.account_number}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                            <p className="text-xs text-gray-400 mb-1">Balance</p>
                            <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                                ${Number(account.balance).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {success && (
                    <p className="text-sm text-green-600 bg-green-50 rounded-xl px-4 py-2.5 mb-4 border border-green-100">
                        {success}
                    </p>
                )}

                {/* Transaction buttons */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Transactions
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                    {[
                        {
                            type: 'deposit',
                            label: 'Deposit',
                            color: 'border-green-200 text-green-700 hover:bg-green-50',
                            icon: <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        },
                        {
                            type: 'withdraw',
                            label: 'Withdraw',
                            color: 'border-red-200 text-red-600 hover:bg-red-50',
                            icon: <path d="M8 14V2M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        },
                        {
                            type: 'transfer',
                            label: 'Transfer',
                            color: 'border-blue-200 text-blue-700 hover:bg-blue-50',
                            icon: <path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        },
                    ].map(({ type, label, color, icon }) => (
                        <button key={type} onClick={() => openModal(type)}
                            className={`flex flex-col items-center gap-1.5 py-3 sm:py-4 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${color}`}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">{icon}</svg>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Quick links */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Quick access
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-8">
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to}
                            className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#3931aa] text-[#3931aa] text-sm font-medium hover:bg-[#3931aa] hover:text-white transition-colors text-center">
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 p-5 w-full sm:max-w-sm">

                        {/* Handle bar on mobile */}
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

                        <div className="flex items-center justify-between mb-4">
                            <p className="font-semibold text-gray-900 capitalize text-base">{modal} funds</p>
                            <button onClick={closeModal}
                                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg leading-none">
                                ×
                            </button>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
                        )}

                        {modal === 'transfer' && (
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 block mb-1">Recipient account number</label>
                                <input type="text" placeholder="ACC-000000000"
                                    value={form.to_account}
                                    onChange={e => setForm(f => ({ ...f, to_account: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="text-xs text-gray-500 block mb-1">Amount</label>
                            <input type="number" placeholder="0.00" min="0.01" step="0.01"
                                value={form.amount}
                                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>

                        <button onClick={handleSubmit} disabled={loading}
                            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 ${
                                modal === 'deposit'  ? 'bg-green-50 text-green-700 hover:bg-green-100' :
                                modal === 'withdraw' ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                                'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}>
                            {loading ? 'Processing...' : `Confirm ${modal}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Account