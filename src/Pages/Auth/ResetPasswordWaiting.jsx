import { useState } from 'react'
import api from '../../api/axios'

const ResetPasswordWaiting = () => {
    const [message, setMessage] = useState('')
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)

    async function handleResend() {
        setLoading(true)
        setMessage('')
        setError('')
        try {
            await api.post('/api/forgot-password')
            setMessage('Reset password link resent successfully!')
        } catch {
            setError('Failed to resend email. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10 text-center">

                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#3931aa]/10 flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2"
                            stroke="#3931aa" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"
                            stroke="#3931aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="16" r="1.5" fill="#3931aa"/>
                    </svg>
                </div>

                {/* Text */}
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Check your email
                </h2>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                    We sent a password reset link to your email address. Click the link to set a new password.
                </p>

                {/* Feedback */}
                {message && (
                    <p className="mt-4 text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                        {error}
                    </p>
                )}

                {/* Button */}
                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="mt-6 w-full py-3 rounded-xl bg-[#3931aa] text-white text-sm sm:text-base font-semibold hover:bg-[#2e2890] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Sending...' : 'Resend reset link'}
                </button>

                <p className="mt-4 text-xs text-gray-400">
                    Didn't receive it? Check your spam folder.
                </p>
            </div>
        </div>
    )
}

export default ResetPasswordWaiting