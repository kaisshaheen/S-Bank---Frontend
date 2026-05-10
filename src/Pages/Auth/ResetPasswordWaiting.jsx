import React, { useState } from 'react'
import api from '../../api/axios'

const ResetPasswordWaiting = () => {


    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleResendEmail() {
        setLoading(true)
        try {
            await api.post('/api/forget-password')
            
            setMessage("Reset password link resent successfully!")

        }catch{
            throw new Error("Failed to resend email. Please try again later.")
        }
        setLoading(false)
    }  


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          📧 Please check your email!
        </h2>
        <p className="mt-2 text-gray-600">
          We have sent a Reset Password link to your email address.
        </p>

        {message && (
          <p className="mt-3 text-green-600">{message}</p>
        )}

        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>
      </div>
    </div>
  )
}

export default ResetPasswordWaiting
