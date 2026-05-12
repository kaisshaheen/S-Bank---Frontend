import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const Home = () => {
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAccount() {
            try {
                const res = await api.get('/api/account')
                setAccount(res.data.account)
            } catch {
                // no account yet — that's fine
            } finally {
                setLoading(false)
            }
        }
        fetchAccount()
    }, [])

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16">
            <div className="max-w-md mx-auto text-center">

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#3931aa]/10 flex items-center justify-center mx-auto mb-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            stroke="#3931aa" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M9 22V12h6v10" stroke="#3931aa" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                </div>

                <h1 className="text-3xl sm:text-4xl text-[#3931aa] font-bold mb-3">
                    Homepage
                </h1>

                <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
                    Create your own account and manage your finances with ease.
                </p>

                {!loading && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {account ? (
                            <Link to="/login_account"
                                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#3931aa] text-white font-semibold text-sm hover:bg-[#2e2890] active:scale-95 transition-all duration-200 text-center">
                                Login to account
                            </Link>
                        ) : (
                            <Link to="/create_account"
                                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#3931aa] text-white font-semibold text-sm hover:bg-[#2e2890] active:scale-95 transition-all duration-200 text-center">
                                Create an account
                            </Link>
                        )}
                        <Link to="/account"
                            className="w-full sm:w-auto px-8 py-3 rounded-xl border border-[#3931aa] text-[#3931aa] font-semibold text-sm hover:bg-[#3931aa]/5 active:scale-95 transition-all duration-200 text-center">
                            Go to dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home