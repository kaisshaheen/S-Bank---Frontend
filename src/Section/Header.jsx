import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import NotificationBell from './NotificationBell'
import { useAuth } from '../Context/useAuth'

const Header = () => {
    const { user, setUser } = useAuth()
    const navigate          = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    async function handleLogout(e) {
        e.preventDefault()
        try {
            const res = await api.post('/api/logout')
            if (res.status === 200) {
                setUser(null)
                navigate('/')
            }
        } catch (error) {
            console.error('Logout failed', error.response?.data)
        }
    }

    return (
        <header className="bg-[#3931aa] px-4 sm:px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <h1 className="text-xl sm:text-2xl text-white uppercase font-bold tracking-wide">
                    S Bank
                </h1>

                {/* Desktop nav */}
                {user.verified ? (
                    <div className="hidden sm:flex items-center gap-4">
                        <NotificationBell />
                        <p className="text-white text-sm">{user?.name}</p>
                        <button onClick={handleLogout}
                            className="text-white text-sm hover:underline cursor-pointer">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="hidden sm:flex items-center gap-4">
                        <Link to="/login"  className="text-white text-sm hover:underline">Login</Link>
                        <Link to="/signup" className="text-white text-sm px-4 py-1.5 rounded-full border border-white/40 hover:bg-white/10 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                )}

                {/* Mobile right side */}
                <div className="flex sm:hidden items-center gap-3">
                    {user && <NotificationBell />}
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="text-white p-1">
                        {menuOpen ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="sm:hidden mt-3 pb-3 border-t border-white/20 pt-3 space-y-2">
                    {user ? (
                        <>
                            <p className="text-white/70 text-sm px-1">{user?.name}</p>
                            <button onClick={handleLogout}
                                className="block w-full text-left text-white text-sm py-2 px-1 hover:bg-white/10 rounded-lg transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)}
                                className="block text-white text-sm py-2 px-1 hover:bg-white/10 rounded-lg transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" onClick={() => setMenuOpen(false)}
                                className="block text-white text-sm py-2 px-1 hover:bg-white/10 rounded-lg transition-colors">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

export default Header