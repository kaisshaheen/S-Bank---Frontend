// src/components/AdminRoute.jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../api/axios'

const AdminRoute = ({ children }) => {
    const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'fail'

    useEffect(() => {
        api.get('/api/user')
            .then(res => {
                if (res.data.role === 'admin') {
                    setStatus('ok')
                } else {
                    setStatus('fail')
                }
            })
            .catch(() => setStatus('fail'))
    }, [])

    if (status === 'checking') return (
        <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
            Verifying access...
        </div>
    )

    if (status === 'fail') return <Navigate to="/admin/login" replace />

    return children
}

export default AdminRoute