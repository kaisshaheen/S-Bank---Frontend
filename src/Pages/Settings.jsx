import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../Context/useAuth'

const Settings = () => {
    const { user, setUser } = useAuth()

    const [name,        setName]        = useState(user?.name ?? '')
    const [nameLoading, setNameLoading] = useState(false)
    const [nameSuccess, setNameSuccess] = useState('')
    const [nameErrors,  setNameErrors]  = useState({})

    const [passwords,    setPasswords]    = useState({
        current_password:      '',
        new_password:              '',
        new_password_confirmation: '',
    })
    const [passLoading, setPassLoading] = useState(false)
    const [passSuccess, setPassSuccess] = useState('')
    const [passErrors,  setPassErrors]  = useState({})

    const handleNameSubmit = async (e) => {
        e.preventDefault()
        setNameLoading(true)
        setNameErrors({})
        setNameSuccess('')
        try {
            await api.patch('/api/settings/name', { name })
            setNameSuccess('Name updated successfully.')

            const updatedUser = { ...user, name }
            setUser(updatedUser)
        } catch (err) {
            setNameErrors(err.response?.data?.errors ?? {})
        } finally {
            setNameLoading(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPassLoading(true)
        setPassErrors({})
        setPassSuccess('')
        try {
            await api.patch('/api/settings/password', passwords)
            setPassSuccess('Password updated successfully.')
            setPasswords({
                current_password:      '',
                new_password:              '',
                new_password_confirmation: '',
            })
        } catch (err) {
            setPassErrors(err.response?.data?.errors ?? {})
        } finally {
            setPassLoading(false)
        }
    }

    const setPass = (field) => (e) =>
        setPasswords(prev => ({ ...prev, [field]: e.target.value }))

    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3931aa]/20 focus:border-[#3931aa] transition-colors"

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
            <div className="max-w-lg mx-auto">

                <p className="text-lg font-semibold text-gray-900 mb-5">Settings</p>

                {/* Update name */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-4 shadow-sm">
                    <p className="text-sm font-semibold text-gray-800 mb-4">Update name</p>

                    {nameSuccess && (
                        <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 mb-4">
                            {nameSuccess}
                        </p>
                    )}

                    <form onSubmit={handleNameSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1.5">Full name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className={inputClass} />
                            {nameErrors.name && (
                                <p className="text-red-500 text-xs mt-1.5">{nameErrors.name[0]}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={nameLoading || name === user?.name}
                                className="px-5 py-2.5 rounded-xl bg-[#3931aa] text-white text-sm font-semibold hover:bg-[#2e2890] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                {nameLoading ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change password */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                    <p className="text-sm font-semibold text-gray-800 mb-4">Change password</p>

                    {passSuccess && (
                        <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 mb-4">
                            {passSuccess}
                        </p>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1.5">Current password</label>
                            <input
                                type="password"
                                placeholder="Enter current password"
                                value={passwords.current_password}
                                onChange={setPass('current_password')}
                                className={inputClass} />
                            {passErrors.current_password && (
                                <p className="text-red-500 text-xs mt-1.5">{passErrors.current_password[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1.5">New password</label>
                            <input
                                type="password"
                                placeholder="Min. 8 characters"
                                value={passwords.new_password}
                                onChange={setPass('new_password')}
                                className={inputClass} />
                            {passErrors.new_password && (
                                <p className="text-red-500 text-xs mt-1.5">{passErrors.new_password[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1.5">Confirm new password</label>
                            <input
                                type="password"
                                placeholder="Repeat new password"
                                value={passwords.new_password_confirmation}
                                onChange={setPass('new_password_confirmation')}
                                className={inputClass} />
                            {passErrors.new_password_confirmation && (
                                <p className="text-red-500 text-xs mt-1.5">{passErrors.new_password_confirmation[0]}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={passLoading}
                                className="px-5 py-2.5 rounded-xl bg-[#3931aa] text-white text-sm font-semibold hover:bg-[#2e2890] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                {passLoading ? 'Updating...' : 'Update password'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Settings