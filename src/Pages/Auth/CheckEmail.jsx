import { useState } from 'react'
import api from '../../api/axios'

export default function CheckEmail() {
    const [message, setMessage] = useState('')
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)

    async function handleResendEmail() {
        setLoading(true)
        setMessage('')
        setError('')
        try {
            await api.post('/api/email/verification-notification')
            setMessage('Verification email resent successfully!')
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
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
                            stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M2 6l10 7 10-7"
                            stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Text */}
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Check your email
                </h2>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                    We sent a verification link to your email address. Click the link to activate your account.
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
                    onClick={handleResendEmail}
                    disabled={loading}
                    className="mt-6 w-full py-3 rounded-xl bg-[#3931aa] text-white text-sm sm:text-base font-semibold hover:bg-[#2e2890] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Sending...' : 'Resend verification email'}
                </button>

                <p className="mt-4 text-xs text-gray-400">
                    Didn't receive it? Check your spam folder.
                </p>
            </div>
        </div>
    )
}