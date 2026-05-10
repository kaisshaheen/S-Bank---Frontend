import { useEffect, useState } from 'react'
import api from '../../api/axios'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

const typeBadge = {
    deposit:  'bg-green-50 text-green-700',
    withdraw: 'bg-red-50 text-red-600',
    transfer: 'bg-blue-50 text-blue-700',
}

const amountColor = {
    deposit:  'text-green-600',
    withdraw: 'text-red-500',
    transfer: 'text-blue-600',
}

const signs = { deposit: '+', withdraw: '-', transfer: '→' }

const Statement = () => {
    const [transactions, setTransactions] = useState([])
    const [summary,      setSummary]      = useState(null)
    const [loading,      setLoading]      = useState(false)
    const [pdfLoading,   setPdfLoading]   = useState(false)
    const [error,        setError]        = useState('')

    const [filters, setFilters] = useState({ from: '', to: '', type: '' })
    const [pdf,     setPdf]     = useState({
        month: new Date().getMonth() + 1,
        year:  new Date().getFullYear(),
    })

    useEffect(() => { fetchStatement() }, [])

    const fetchStatement = async () => {
        setLoading(true)
        setError('')
        try {
            const params = {}
            if (filters.from) params.from = filters.from
            if (filters.to)   params.to   = filters.to
            if (filters.type) params.type = filters.type

            const res = await api.get('/api/statement', { params })
            console.log(res.data.statement.data)
            setTransactions(res.data.statement.data      ?? [])
            setSummary(res.data.statement.summary        ?? null)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load statement.')
        } finally {
            setLoading(false)
        }
    }

    const handlePdfDownload = async () => {
        setPdfLoading(true)
        try {
            const res = await api.post('/api/statement/monthly-pdf', {
                month: pdf.month,
                year:  pdf.year,
            }, { responseType: 'blob' })

            const url  = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href  = url
            link.setAttribute('download', `statement-${pdf.year}-${pdf.month}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch {
            setError('Failed to download PDF.')
        } finally {
            setPdfLoading(false)
        }
    }

    const totalIn  = transactions.filter(t => t.type === 'deposit') .reduce((s, t) => s + parseFloat(t.amount), 0)
    const totalOut = transactions.filter(t => t.type !== 'deposit') .reduce((s, t) => s + parseFloat(t.amount), 0)
    const net      = totalIn - totalOut

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-medium text-gray-900">Account statement</p>
                <button onClick={handlePdfDownload} disabled={pdfLoading}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {pdfLoading ? 'Exporting...' : 'Export PDF'}
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 mb-4">{error}</p>
            )}

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Filters</p>
                <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">From date</label>
                        <input type="date" value={filters.from}
                            onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">To date</label>
                        <input type="date" value={filters.to}
                            onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Type</label>
                        <select value={filters.type}
                            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="">All types</option>
                            <option value="deposit">Deposit</option>
                            <option value="withdraw">Withdraw</option>
                            <option value="transfer">Transfer</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button onClick={fetchStatement}
                        className="text-sm px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors">
                        Apply filters
                    </button>
                </div>
            </div>

            {/* Summary metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                    ['Total in',   `+$${totalIn.toFixed(2)}`,  'text-green-600'],
                    ['Total out',  `-$${totalOut.toFixed(2)}`, 'text-red-500'],
                    ['Net change', `${net >= 0 ? '+' : ''}$${net.toFixed(2)}`, net >= 0 ? 'text-gray-800' : 'text-red-500'],
                ].map(([label, value, color]) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">{label}</p>
                        <p className={`text-base font-medium ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Monthly PDF export */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Monthly PDF export</p>
                <div className="grid grid-cols-3 gap-3 items-end">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Month</label>
                        <select value={pdf.month}
                            onChange={e => setPdf(p => ({ ...p, month: parseInt(e.target.value) }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                            {MONTHS.map((m, i) => (
                                <option key={m} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Year</label>
                        <input type="number" min="2020" max="2030" value={pdf.year}
                            onChange={e => setPdf(p => ({ ...p, year: parseInt(e.target.value) }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <button onClick={handlePdfDownload} disabled={pdfLoading}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors disabled:opacity-40">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {pdfLoading ? 'Downloading...' : 'Download'}
                    </button>
                </div>
            </div>

            {/* Transactions table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Transactions</p>
                </div>

                <div className="grid grid-cols-4 px-4 py-2 border-b border-gray-100 gap-2">
                    {['Description', 'Type', 'Amount', 'Date'].map(h => (
                        <p key={h} className={`text-xs font-medium text-gray-400 uppercase tracking-wide m-0
                            ${h === 'Amount' || h === 'Date' ? 'text-right' : ''}`}>
                            {h}
                        </p>
                    ))}
                </div>

                {loading ? (
                    <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                ) : transactions.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No transactions found.</div>
                ) : transactions.map((txn, i) => (
                    <div key={txn.id}
                        className={`grid grid-cols-4 items-center px-4 py-3 gap-2
                            ${i !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}>

                        <p className="text-sm font-medium text-gray-800 truncate m-0">
                            {txn.description ?? `Transaction #${txn.id}`}
                        </p>

                        <div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeBadge[txn.type]}`}>
                                {txn.type}
                            </span>
                        </div>

                        <p className={`text-sm text-right m-0 font-medium ${amountColor[txn.type]}`}>
                            {signs[txn.type]}${Number(txn.amount).toLocaleString('en', { minimumFractionDigits: 2 })}
                        </p>

                        <p className="text-xs text-right text-gray-400 m-0">
                            {new Date(txn.created_at).toLocaleDateString('en', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            })}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Statement