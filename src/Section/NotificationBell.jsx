import { useEffect, useRef, useState } from 'react'
import api from '../api/axios'

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([])
    const [unreadCount,   setUnreadCount]   = useState(0)
    const [open,          setOpen]          = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 10000)
        return () => clearInterval(interval)
    }, [])

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications')
            setNotifications(res.data.notifications)
            setUnreadCount(res.data.unread_count)
        } catch {
            //
        }
    }

    const markOne = async (id) => {
        try {
            await api.post(`/api/notifications/${id}/read`)
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch {
            //
        }
    }

    const markAll = async () => {
        try {
            await api.post('/api/notifications/read')
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
            setUnreadCount(0)
        } catch {
            //
        }
    }

    const timeAgo = (dateStr) => {
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
        if (diff < 60)    return 'just now'
        if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return `${Math.floor(diff / 86400)}d ago`
    }

    return (
        <div className="relative" ref={dropdownRef}>

            {/* Bell button */}
            <button onClick={() => setOpen(o => !o)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5A4.5 4.5 0 003.5 6v3.5L2 11h12l-1.5-1.5V6A4.5 4.5 0 008 1.5zM6.5 13a1.5 1.5 0 003 0"
                        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown
                - On mobile: fixed full-width panel at top
                - On sm+: absolute dropdown aligned right  */}
            {open && (
                <>
                    {/* Mobile overlay */}
                    <div className="sm:hidden fixed inset-0 bg-black/30 z-40"
                        onClick={() => setOpen(false)} />

                    <div className={`
                        z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden
                        fixed left-4 right-4 top-16
                        sm:absolute sm:left-auto sm:right-0 sm:top-11 sm:w-80 sm:fixed-none
                    `}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-800">Notifications</p>
                            <div className="flex items-center gap-3">
                                {unreadCount > 0 && (
                                    <button onClick={markAll}
                                        className="text-xs text-blue-600 hover:underline">
                                        Mark all as read
                                    </button>
                                )}
                                <button onClick={() => setOpen(false)}
                                    className="sm:hidden text-gray-400 hover:text-gray-600">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-72 sm:max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-8 text-center text-sm text-gray-400">
                                    No notifications yet.
                                </div>
                            ) : notifications.map(n => {
                                const isUnread = !n.read_at
                                return (
                                    <div key={n.id}
                                        onClick={() => isUnread && markOne(n.id)}
                                        className={`flex gap-3 px-4 py-3 border-b border-gray-100 last:border-none cursor-pointer transition-colors
                                            ${isUnread ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}>
                                        <div className="mt-1.5 shrink-0">
                                            <div className={`w-2 h-2 rounded-full ${isUnread ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 m-0">
                                                {n.data.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 m-0">
                                                From {n.data.from_account} · {timeAgo(n.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default NotificationBell