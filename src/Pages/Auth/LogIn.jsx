import { useState } from "react"
import api from "../../api/axios"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../Context/useAuth"


const LogIn = () => {

  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [formData , setFormData] = useState({
    email : "", 
    password : ""
  })
  const [errors , setErrors] = useState({})

  async function handleLogin(e) {
    e.preventDefault()

    try{
        //get CSRF cookie
        await api.get('/sanctum/csrf-cookie')
        //login user
        await api.post('/login' , formData)

        const res = await api.get('/api/user')
        setUser(res.data);
        

        console.log(res.data)
        navigate("/home")
    }catch(error){
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors)
        } else if (error.response?.status === 401) {
            setErrors({ email: ["Invalid credentials"] })
        }
    }
  }

  return (
    <>
      <div className="text-center my-14 font-['Roboto', sans-serif] space-y-4">
        <h1 className="text-5xl font-bold text-[#3931aa] uppercase">S Bank</h1>
        <h3 className="text-3xl font-[300]">Sign In</h3>
      </div>
      <form onSubmit={handleLogin} className="w-1/2 mx-auto space-y-4 text-[20px] font-['Roboto', sans-serif] mb-10">
        <div className="">
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
        <div className="flex justify-between items-center">
          <button className="text-[17px] text-[#fff] bg-[#3931aa] px-5 py-2 rounded-[25px] uppercase font-medium hover:scale-110 transition-all duration-500 cursor-pointer">Sign In</button>
          <Link to = "/signup" className="text-[17px] text-[#3931aa] underline font-medium hover:text-[#3931aa] transition-all duration-500 cursor-pointer">You don't have an account?</Link>
          <Link to = "/forget-password" className="text-[17px] text-[#3931aa] underline font-medium hover:text-[#3931aa] transition-all duration-500 cursor-pointer">Forget Password?</Link>
        </div>
      </form>
    </>
  )
}

export default LogIn
