import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const ForgetPassword = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
    
  const [errors , setErrors] = useState({})

  async function handleForget(e) {
    e.preventDefault();
    try {
      await api.get('/sanctum/csrf-cookie');
      //send reset password link
      await api.post('/api/forgot-password', {email})

      navigate("/reset-password-wait")
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    }
  }



  return (
    <div className='w-1/2 container mx-auto mt-20'>
      <h1 className='text-3xl text-center font-extrabold text-[#3931aa] uppercase mb-20'>Forget Password</h1>
      <form onSubmit={handleForget}>
        <div className="flex items-center mb-4">
          <label htmlFor="email" className="text-gray-700 text-2xl font-medium mr-3">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-700 text-[14px]">{errors.email[0]}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  )
}

export default ForgetPassword
