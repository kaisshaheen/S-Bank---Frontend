import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email:                 '',
        token:                 '',
        password:              '',
        password_confirmation: '',
    })
    const [errors,   setErrors]  = useState({})
    const [message,  setMessage] = useState('')
    const [loading,  setLoading] = useState(false)
    const [invalid,  setInvalid] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token  = params.get('token')
        const email  = params.get('email')

        if (!token || !email) {
            setInvalid(true)
            return
        }

        setFormData(prev => ({ ...prev, token, email }))
    }, [])

    const set = (field) => (e) =>
        setFormData(prev => ({ ...prev, [field]: e.target.value }))

    async function resetPassword(e) {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        try {
            await api.post('/api/reset-password', formData)
            setMessage('Password reset successfully!')
            setTimeout(() => navigate('/login'), 1500)
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            } else {
                setErrors({ general: ['Something went wrong. Please try again.'] })
            }
        } finally {
            setLoading(false)
        }
    }

    // Invalid / expired link state
    if (invalid) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="#EF4444" strokeWidth="1.5"/>
                        <path d="M10 6v4M10 13v.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>
                <p className="font-semibold text-gray-900 mb-1">Invalid or expired link</p>
                <p className="text-sm text-gray-400 mb-5">
                    This password reset link is no longer valid. Please request a new one.
                </p>
                <button onClick={() => navigate('/forget-password')}
                    className="w-full py-3 rounded-xl bg-[#3931aa] text-white text-sm font-semibold hover:bg-[#2e2890] transition-colors">
                    Request new link
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-10 sm:px-6">

            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-[#3931aa] uppercase tracking-wide">
                    S Bank
                </h1>
                <h3 className="text-xl sm:text-2xl font-light text-gray-600 mt-2">
                    Reset your password
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                    Enter a new password for{' '}
                    <span className="font-medium text-gray-600">{formData.email}</span>
                </p>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">

                {/* Success */}
                {message && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="#16A34A" strokeWidth="1.2"/>
                            <path d="M5 8l2 2 4-4" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {message}
                    </div>
                )}

                {/* General error */}
                {errors.general && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                        {errors.general[0]}
                    </p>
                )}

                <form onSubmit={resetPassword} className="space-y-4">

                    {/* New password */}
                    <div>
                        <label className="text-sm text-gray-500 block mb-1.5">
                            New password
                        </label>
                        <input
                            type="password"
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={set('password')}
                            className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3931aa]/20 focus:border-[#3931aa] transition-colors" />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1.5">{errors.password[0]}</p>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label className="text-sm text-gray-500 block mb-1.5">
                            Confirm new password
                        </label>
                        <input
                            type="password"
                            placeholder="Repeat your new password"
                            value={formData.password_confirmation}
                            onChange={set('password_confirmation')}
                            className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3931aa]/20 focus:border-[#3931aa] transition-colors" />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-xs mt-1.5">{errors.password_confirmation[0]}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-1 rounded-xl bg-[#3931aa] text-white text-sm sm:text-base font-semibold uppercase tracking-wide hover:bg-[#2e2890] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Resetting...' : 'Reset password'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default ResetPassword