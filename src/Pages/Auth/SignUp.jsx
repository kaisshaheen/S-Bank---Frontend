import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import AuthProvider from '../../Context/AuthProvider'
import { useAuth } from '../../Context/useAuth'

const SignUp = () => {
    const [formData, setFormData] = useState({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
    })
    const [errors,   setErrors]  = useState({})
    const [loading,  setLoading] = useState(false)
    const {token , setToken} = useAuth()
    const navigate = useNavigate()

    const set = (field) => (e) =>
        setFormData(prev => ({ ...prev, [field]: e.target.value }))

    async function handleRegister(e) {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        try {
            const res = await api.post('/api/register', formData)
            localStorage.setItem('token', res.data.token)
            setToken(res.data.token)
            navigate('/check-email')
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            }
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { key: 'name',                  type: 'text',     label: 'Full name',       placeholder: 'Enter your full name'      },
        { key: 'email',                 type: 'email',    label: 'Email address',   placeholder: 'Enter your email'          },
        { key: 'password',              type: 'password', label: 'Password',        placeholder: 'Min. 8 characters'         },
        { key: 'password_confirmation', type: 'password', label: 'Confirm password',placeholder: 'Repeat your password'      },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-10 sm:px-6">

            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-[#3931aa] uppercase tracking-wide">
                    S Bank
                </h1>
                <h3 className="text-xl sm:text-2xl font-light text-gray-600 mt-2">
                    Create your account
                </h3>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
                <form onSubmit={handleRegister} className="space-y-4">

                    {fields.map(({ key, type, label, placeholder }) => (
                        <div key={key}>
                            <label className="text-sm text-gray-500 block mb-1.5">
                                {label}
                            </label>
                            <input
                                type={type}
                                placeholder={placeholder}
                                value={formData[key]}
                                onChange={set(key)}
                                className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3931aa]/20 focus:border-[#3931aa] transition-colors" />
                            {errors[key] && (
                                <p className="text-red-500 text-xs mt-1.5">{errors[key][0]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-1 rounded-xl bg-[#3931aa] text-white text-sm sm:text-base font-semibold uppercase tracking-wide hover:bg-[#2e2890] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>

                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 mt-5">
                    Already have an account?{' '}
                    <Link to="/login"
                        className="text-[#3931aa] font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp