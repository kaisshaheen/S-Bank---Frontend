import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const statusConfig = {
    loading: {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-spin">
                <circle cx="12" cy="12" r="9" stroke="#D1D5DB" strokeWidth="2"/>
                <path d="M12 3a9 9 0 019 9" stroke="#3931aa" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
        bg:    'bg-[#3931aa]/10',
        title: 'Verifying your email...',
        text:  'Please wait while we verify your email address.',
        color: 'text-gray-700',
    },
    success: {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#16A34A" strokeWidth="1.5"/>
                <path d="M7 12l3 3 7-7" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        bg:    'bg-green-50',
        title: 'Email verified!',
        text:  'Your email has been verified successfully. You can now sign in.',
        color: 'text-green-700',
    },
    error: {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1.5"/>
                <path d="M12 8v4M12 15v.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        ),
        bg:    'bg-red-50',
        title: 'Verification failed',
        text:  'This link is invalid or has expired. Please request a new verification email.',
        color: 'text-red-600',
    },
}

const Verify = () => {
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        const params    = new URLSearchParams(window.location.search)
        const signedUrl = params.get('url')
        const result    = params.get('status')

        if (signedUrl) {
            window.location.href = decodeURIComponent(signedUrl)
            return
        }

        if (result === 'success')      setStatus('success')
        else if (result === 'error')   setStatus('error')
        else                           setStatus('loading')
    }, [])

    const config = statusConfig[status]

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10 text-center">

                {/* Icon */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${config.bg} flex items-center justify-center mx-auto mb-5`}>
                    {config.icon}
                </div>

                {/* Text */}
                <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${config.color}`}>
                    {config.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                    {config.text}
                </p>

                {/* Actions */}
                {status === 'success' && (
                    <Link to="/login"
                        className="mt-6 block w-full py-3 rounded-xl bg-[#3931aa] text-white text-sm sm:text-base font-semibold hover:bg-[#2e2890] active:scale-95 transition-all duration-200">
                        Go to sign in
                    </Link>
                )}

                {status === 'error' && (
                    <div className="mt-6 space-y-2">
                        <Link to="/check-email"
                            className="block w-full py-3 rounded-xl bg-[#3931aa] text-white text-sm font-semibold hover:bg-[#2e2890] active:scale-95 transition-all duration-200">
                            Resend verification email
                        </Link>
                        <Link to="/login"
                            className="block w-full py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors">
                            Back to sign in
                        </Link>
                    </div>
                )}

                {status === 'loading' && (
                    <p className="mt-6 text-xs text-gray-400">
                        This may take a few seconds...
                    </p>
                )}
            </div>
        </div>
    )
}

export default Verify