import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../api/axios"

const SignUp = () => {
    const [formData , setFormData] = useState({
      name : "",
      email : "", 
      password : "",
      password_confirmation: ""
    })
    const navigate = useNavigate()
    const [errors , setErrors] = useState({})
    
    
    async function handleRegister(e) {
      e.preventDefault()
      try{
        //get CSRF cookie
        await api.get('/sanctum/csrf-cookie')
        //register user
        await api.post('/register' , formData)

        navigate("/check-email")
      }catch(error){
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
        }
      }
    }
  return (
    <>
        <div className="text-center my-14 font-['Roboto', sans-serif] space-y-4">
          <h1 className="text-5xl font-bold text-[#3931aa] uppercase">S Bank</h1>
          <h3 className="text-3xl font-[300]">Sign Up</h3>
        </div>
        <form onSubmit={handleRegister} className="w-1/2 mx-auto space-y-4 text-[20px] font-['Roboto', sans-serif] mb-10">
          <div>
            <input 
            className="w-full p-5 border border-gray-400 rounded-xl" 
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData , name : e.target.value})} 
            placeholder="Name..."/>
            {errors.name && <p className="text-red-700 text-[14px]">{errors.name[0]}</p>}
          </div>
          <div>
            <input 
            className="w-full p-5 border border-gray-400 rounded-xl" 
            type="text"
            value={formData.email}
            onChange={e => setFormData({...formData , email : e.target.value})} 
            placeholder="Email..."/>
            {errors.email && <p className="text-red-700 text-[14px]">{errors.email[0]}</p>}
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
          <div className="flex justify-between items-center">
            <button className="text-[17px] text-[#fff] bg-[#3931aa] px-5 py-2 rounded-[25px] uppercase font-medium hover:scale-110 transition-all duration-500 cursor-pointer">Sign Up</button>
            <Link to = "/login" className="text-[17px] text-[#3931aa] underline font-medium hover:text-[#3931aa] transition-all duration-500 cursor-pointer">I have an account</Link>
          </div>
        </form>
        <div className="flex flex-col justify-center items-center gap-6">
          <p className="text-[20px]">OR:</p>
        </div>
    </>
  )
}

export default SignUp
