import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const ACCOUNT_TYPES = ['saving', 'current']

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        national_number:      '',
        type:                 '',
        password:             '',
        password_confirmation: '',
    })
    const [errors,   setErrors]  = useState({})
    const [message,  setMessage] = useState('')
    const [loading,  setLoading] = useState(false)
    const navigate = useNavigate()

    const set = (field) => (e) =>
        setFormData(prev => ({ ...prev, [field]: e.target.value }))

    async function handleCreate(e) {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        try {
            const res = await api.post('/api/account/create', formData)
            setMessage(res.data.message)
            setTimeout(() => navigate('/home'), 2000)
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            } else if (error.response?.status === 401) {
                setErrors({ national_number: ['Invalid credentials'] })
            }
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        {
            key:         'national_number',
            type:        'text',
            placeholder: 'National number (11 digits)',
            label:       'National number',
        },
        {
            key:         'password',
            type:        'password',
            placeholder: 'Password (min. 8 characters)',
            label:       'Password',
        },
        {
            key:         'password_confirmation',
            type:        'password',
            placeholder: 'Confirm password',
            label:       'Confirm password',
        },
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

            {/* Success message */}
            {message && (
                <div className="w-full max-w-sm sm:max-w-md mx-auto mb-4">
                    <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center font-medium">
                        {message}
                    </p>
                </div>
            )}

            {/* Card */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
                <form onSubmit={handleCreate} className="space-y-4">

                    {/* Text + password fields */}
                    {fields.map(({ key, type, placeholder, label }) => (
                        <div key={key}>
                            <label className="text-sm text-gray-500 block mb-1.5">
                                {label}
                            </label>
                            <input
                                type={type}
                                placeholder={placeholder}
                                value={formData[key]}
                                onChange={set(key)}
                                className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3931aa]/20 focus:border-[#3931aa] transition-colors"
                            />
                            {errors[key] && (
                                <p className="text-red-500 text-xs mt-1.5">{errors[key][0]}</p>
                            )}
                        </div>
                    ))}

                    {/* Account type — select instead of free text */}
                    <div>
                        <label className="text-sm text-gray-500 block mb-1.5">
                            Account type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {ACCOUNT_TYPES.map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                                    className={`py-3 rounded-xl border text-sm font-medium capitalize transition-colors
                                        ${formData.type === t
                                            ? 'bg-[#3931aa] text-white border-[#3931aa]'
                                            : 'border-gray-200 text-gray-500 hover:border-[#3931aa] hover:text-[#3931aa]'
                                        }`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                        {errors.type && (
                            <p className="text-red-500 text-xs mt-1.5">{errors.type[0]}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-2 rounded-xl bg-[#3931aa] text-white text-sm sm:text-base font-semibold uppercase tracking-wide hover:bg-[#2e2890] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Creating...' : 'Create account'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default CreateAccount