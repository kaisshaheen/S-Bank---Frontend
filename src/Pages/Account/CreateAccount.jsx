import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const CreateAccount = () => {
    const [formData , setFormData] = useState({
      national_number : "",
      type : "", 
      password : "",
      password_confirmation: ""
    })
    const navigate = useNavigate()
    const [errors , setErrors] = useState({})
    const [message, setMessage] = useState("")

    async function handleCreate(e) {
        e.preventDefault();
        try {
            const res = await api.post('/api/account/create' , formData)

            console.log(res)
            setMessage(res.data.message)
            setTimeout(() => navigate("/home"), 2000)
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            } else if (error.response?.status === 401) {
                setErrors({ email: ["Invalid credentials"] })
            }
        }
    }
  return (
    <>
      <p className='text-center my-6 text-2xl text-blue-700'>{message}</p>
      <div className="text-center my-14 font-['Roboto', sans-serif] space-y-4">
        <h1 className="text-5xl font-bold text-[#3931aa] uppercase">S Bank</h1>
        <h3 className="text-3xl font-[300]">Create your account</h3>
      </div>
      <form onSubmit={handleCreate} className="w-1/2 mx-auto space-y-4 text-[20px] font-['Roboto', sans-serif] mb-10">
        <div className="">
          <input 
          className="w-full p-5 border border-gray-400 rounded-xl" 
          type="text"
          value={formData.national_number}
          onChange={e => setFormData({...formData , national_number : e.target.value})} 
          placeholder="your National number..."/>
          {errors.national_number && <p className="text-red-700 text-[14px]">{errors.national_number[0]}</p>}
        </div>
        <div >
          <input 
          className="w-full p-5 border border-gray-400 rounded-xl" 
          type="text"
          value={formData.type}
          onChange={e => setFormData({...formData , type : e.target.value})} 
          placeholder="Account type..."/>
          {errors.type && <p className="text-red-700 text-[14px]">{errors.type[0]}</p>}
        </div>
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
        <button className="text-[17px] text-[#fff] bg-[#3931aa] px-5 py-2 rounded-[25px] uppercase font-medium hover:scale-110 transition-all duration-500 cursor-pointer">Create</button>
      </form>
    </>
  )
}

export default CreateAccount
