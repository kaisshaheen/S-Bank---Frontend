import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const ForgetPassword = () => {
    const [email,   setEmail]   = useState('')
    const [errors,  setErrors]  = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleForget(e) {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        try {
            await api.post('/api/forgot-password', { email })
            navigate('/reset-password-wait')
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-10 sm:px-6">

            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-[#3931aa] uppercase tracking-wide">
                    S Bank
                </h1>
                <h3 className="text-xl sm:text-2xl font-light text-gray-600 mt-2">
                    Forgot your password?
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                    Enter your email and we'll send you a reset link.
                </p>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
                <form onSubmit={handleForget} className="space-y-4">

                    <div>
                        <label htmlFor="email" className="text-sm text-gray-500 block mb-1.5">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3931aa]/20 focus:border-[#3931aa] transition-colors" />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1.5">{errors.email[0]}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-[#3931aa] text-white text-sm sm:text-base font-semibold uppercase tracking-wide hover:bg-[#2e2890] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default ForgetPassword