import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const ResetPassword = () => {

    const [formData , setFormData] = useState({
      email: "",
      token: "",
      password : "",
      password_confirmation: ""
    })
    const navigate = useNavigate()
    const [errors , setErrors] = useState({})
    const [message, setMessage] = useState("")

    useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const token = params.get("token")
    const email = params.get("email")



    console.log("TOKEN:", token);
    console.log("EMAIL:", email);

    if (!token || !email) {
      setErrors({ general: ["Invalid or expired link"] })
      return
    }

    setFormData(prev => ({
      ...prev,
      token,
      email
    }))
  }, [])

  async function resetPassword(e) {
    e.preventDefault()

    try {

      
      await api.post('/api/reset-password', formData)

      setMessage("✅ Password reset successfully!")

      setTimeout(() => navigate("/login"), 1500)

    } catch (error) {
        console.log(error.response.data) 
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: ["Something went wrong"] })
      }
    }
  }

  return (
    <div className='container mx-auto mt-20'>
      <h1 className='text-3xl text-center font-extrabold text-[#3931aa] uppercase mb-20'>Reset password</h1>
      {message && <p className="text-green-600 text-center">{message}</p>}
      {errors.general && <p className="text-red-600 text-center">{errors.general[0]}</p>}
      <form onSubmit={resetPassword} className="w-1/2 mx-auto space-y-4 text-[20px] font-['Roboto', sans-serif] mb-10">
          <div>
            <input 
            className="w-full p-5 border border-gray-400 rounded-xl" 
            type="password"
            value={formData.password}
            onChange={e => setFormData({...formData , password : e.target.value})} 
            placeholder="Password..."/>
            {errors.password && <p className="text-red-700 text-[14px]">{errors.password[0]}</p>}
          </div>
          <div>
            <input 
            className="w-full p-5 border border-gray-400 rounded-xl" 
            type="password"
            value={formData.password_confirmation}
            onChange={e => setFormData({...formData , password_confirmation : e.target.value})} 
            placeholder="Password_Confirmtion..."/>
          </div>
          <div className="text-center">
            <button className="text-[17px] text-[#fff] bg-[#3931aa] px-5 py-2 rounded-[25px] uppercase font-medium hover:scale-110 transition-all duration-500 cursor-pointer">Reset</button>
          </div>
        </form>
    </div>
  )
}

export default ResetPassword
