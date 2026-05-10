import { useEffect, useState } from 'react'
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const Account = () => {
    const [loan,setLoan] = useState(null)
    const [account, setAccount] = useState(null)
    const [user, setUser] = useState(null)
    const [modal, setModal] = useState(null) // 'deposit' | 'withdraw' | 'transfer'
    const [form, setForm] = useState({ amount: '', to_account: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')


    async function fetchAccount() {
            try {
                const res = await api.get('/api/account')
                setAccount(res.data.account)
                setUser(res.data.account.account_owner)
                console.log(res.data.account.account_owner)
            } catch (err) {
                setError('Failed to load account.')
            } finally{
                setLoading(false)
            }
        }

        const fetchLoan = async () => {
            setLoading(true)
            try {
                const res = await api.get('/api/loan')
                console.log(res.data)
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
                deposit: '/api/transcation/deposit',
                withdraw: '/api/transcation/withdraw',
                transfer: '/api/transcation/transfer',
            }
            const payload = modal === 'transfer'
                ? { amount: form.amount, to_account: form.to_account }
                : { amount: form.amount }

            const res = await api.post(endpoints[modal], payload)
            setSuccess(res.data.message || 'Done.')
            if (res.data.account) setAccount(res.data.account)
            setModal(null)
            await fetchAccount() 
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    if (!account) return (
        <div className="flex items-center justify-center mt-40 text-gray-400 text-sm">
            Loading account...
        </div>
    )

    const initials = user?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??'

    return (
        <div className="max-w-md mx-auto mt-16 px-4">

            {/* Account card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-medium text-sm">
                        {initials}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{user}</p>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Active
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Account number</p>
                        <p className="font-mono text-sm font-medium text-gray-900">{account.account_number}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Balance</p>
                        <p className="text-xl font-medium text-gray-900">
                            ${Number(account.balance).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {success && (
                <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2 mb-3">{success}</p>
            )}

            {/* Transaction buttons */}
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Transactions</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
                <button onClick={() => openModal('deposit')}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-green-200 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Deposit
                </button>
                <button onClick={() => openModal('withdraw')}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14V2M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Withdraw
                </button>
                <button onClick={() => openModal('transfer')}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Transfer
                </button>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 w-full max-w-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-medium text-gray-900 capitalize">{modal} funds</p>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                        </div>

                        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

                        {modal === 'transfer' && (
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 block mb-1">Recipient account number</label>
                                <input type="text" placeholder="ACC-000000000"
                                    value={form.to_account}
                                    onChange={e => setForm(f => ({ ...f, to_account: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="text-xs text-gray-500 block mb-1">Amount</label>
                            <input type="number" placeholder="0.00" min="0.01" step="0.01"
                                value={form.amount}
                                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>

                        <button onClick={handleSubmit} disabled={loading}
                            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                modal === 'deposit' ? 'bg-green-50 text-green-700 hover:bg-green-100' :
                                modal === 'withdraw' ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                                'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}>
                            {
                                loading ? 'Processing...' : `Confirm ${modal}`
                            }
                        </button>
                        
                    </div>
                </div>
            )}
            <div className='flex flex-col justify-center items-center space-y-5 mb-8'>
                <Link to='/account/history' className='text-[#3931aa] border border-[#3931aa] rounded-3xl px-4 py-2 hover:bg-[#c5c4dd]'>Transaction History</Link>
                <div className='flex space-x-4'>
                    {
                        loan ?
                        <Link to='/loan/my-loan' className='text-[#3931aa] border border-[#3931aa] rounded-3xl px-4 py-2 hover:bg-[#c5c4dd]'>My Loan</Link>
                        :
                        <Link to='/loan/request' className='text-[#3931aa] border border-[#3931aa] rounded-3xl px-4 py-2 hover:bg-[#c5c4dd]'>Request a Loan</Link>
                    }
                    <Link to='/statement' className='text-[#3931aa] border border-[#3931aa] rounded-3xl px-4 py-2 hover:bg-[#c5c4dd]'>Statement</Link>
                </div>
            </div>
        </div>
    )
}

export default Account