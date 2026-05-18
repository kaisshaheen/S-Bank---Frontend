import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../Context/useAuth'

const LogIn = () => {
    const { setUser , setToken } = useAuth()
    const navigate    = useNavigate()

    const [formData, setFormData] = useState({ email: '', password: '' })
    const [errors,   setErrors]   = useState({})
    const [loading,  setLoading]  = useState(false)

    const set = (field) => (e) =>
        setFormData(prev => ({ ...prev, [field]: e.target.value }))

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        try {
            const res = await api.post('/api/login', formData)
            localStorage.setItem('token', res.data.token)
            setToken(res.data.token)
            setUser(res.data.user)
            navigate('/home')
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            } else if (error.response?.status === 401) {
                setErrors({ email: ['Invalid credentials'] })
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
                    Sign in
                </h3>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-500 block mb-1.5">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={set('email')}
                            className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3931aa]/20 focus:border-[#3931aa] transition-colors" />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1.5">{errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm text-gray-500">Password</label>
                            <Link to="/forget-password"
                                className="text-xs text-[#3931aa] hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={set('password')}
                            className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3931aa]/20 focus:border-[#3931aa] transition-colors" />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1.5">{errors.password[0]}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-1 rounded-xl bg-[#3931aa] text-white text-sm sm:text-base font-semibold uppercase tracking-wide hover:bg-[#2e2890] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                </form>

                {/* Footer link */}
                <p className="text-center text-sm text-gray-400 mt-5">
                    Don't have an account?{' '}
                    <Link to="/signup"
                        className="text-[#3931aa] font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LogIn