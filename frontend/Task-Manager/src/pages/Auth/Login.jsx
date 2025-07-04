import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import {useNavigate,Link} from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import {UserContext} from "../../context/userContext"


const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);


  const {updateUser}=useContext(UserContext);
  const navigate=useNavigate();

  const handleLogin=async(e)=>{
    e.preventDefault();
  

    if(!validateEmail(email))
    {
      setError("please enter a valid email address");
      return;
    }

    if(!password)
    {
      setError("please enter the password")
      return;
    }
setError("");

//Login API call
try {
  const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
    email,
    password,
  });

  const {token,role}=response.data;

  if(token)
  {
    localStorage.setItem("token",token);
    updateUser(response.data );

    //redirect based on user role
    if(role==="admin")
    {
      navigate("/admin/dashboard");
    }
    else{
      navigate("/user/dashboard");
    }
  }

} catch (error) {

     console.error("Login error:", error); // 👈 Add this line

  if(error.response && error.response.data.message)
  {
    setError(error.response.data.message);
  }
  else{
    setError("Something went wrong.Plese try again");
  }
};
}

return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please Enter your details to log in</p>

        <form onSubmit={handleLogin}>
          <Input
          value={email}
          onChange={({target})=>setEmail(target.value)}
          label='Email Address'
          placeholder='john@exapmle.com'
          type='text'
          /> 

          <Input
          value={password}
          onChange={({target})=>setPassword(target.value)}
          label="Password"
          placeholder='Min 8 character'
          type='password'
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{""}
            <Link className="font-medium text-primary underline" to="/signup">
            Signup</Link>
          </p>
        </form>
        </div>
   </AuthLayout>
  )
}

export default Login
