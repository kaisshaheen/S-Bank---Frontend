import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const AdminLogin = () => {
    const [form,    setForm]    = useState({ email: '', password: '' })
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)
    const navigate              = useNavigate()

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        try {
            // Step 1 — get CSRF cookie first (required for SPA session auth)
            await api.get('/sanctum/csrf-cookie')

            // Step 2 — login
            const res = await api.post('/login', form)

            // Step 3 — make sure it's an admin
            if (res.data.user?.role !== 'admin') {
                setError('Invalid credentials or insufficient permissions.')
                return
            }

            // Step 4 — store user info and redirect
            localStorage.setItem('admin_user', JSON.stringify(res.data.user))
            navigate('/admin')

        } catch (err) {
            setError(
                err.response?.data?.message || 
                'Invalid credentials or insufficient permissions.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2a5 5 0 100 10 5 5 0 000-10zM4 20a8 8 0 0116 0"
                                stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
                            <circle cx="19" cy="8" r="3" fill="#EF4444" stroke="white" strokeWidth="1.5"/>
                        </svg>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600 mb-3">
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path d="M5 1l1.5 3H9L7 6l.5 3L5 7.5 2.5 9 3 6 1 4h2.5z" fill="currentColor"/>
                        </svg>
                        Admin portal
                    </span>
                    <p className="text-lg font-medium text-gray-900 mt-1">Sign in to dashboard</p>
                    <p className="text-xs text-gray-400 mt-1">Restricted access — authorised personnel only</p>
                </div>

                {/* Fields */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500 block mb-1">Email address</label>
                    <input type="email" placeholder="admin@bank.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>

                <div className="mb-5">
                    <label className="text-xs text-gray-500 block mb-1">Password</label>
                    <input type="password" placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-2 bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2.5 mb-4">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M8 5v3M8 11v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        {error}
                    </div>
                )}

                <button onClick={handleSubmit} disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
        </div>
    )
}

export default AdminLogin