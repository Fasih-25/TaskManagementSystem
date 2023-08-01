import {React, useState} from 'react'
import { useNavigate } from "react-router-dom";
import {  useDispatch } from 'react-redux';
import store from "./store.js";
import { toast } from 'react-toastify';


export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();

    const state = store.getState();
    const user = state.user;

    const newTaskState = store.getState();
    const task = newTaskState.task;

    console.log(user);

    let navigate = useNavigate();
    dispatch({ type: "removeFromArray", item: user[0] });
    dispatch({ type: "removeFromtask", item: task[0] });

    let handleLogin = async (e) => {
        console.log(email,password);
        e.preventDefault();
        const url = new URL('https://64c64bad0a25021fde917f0f.mockapi.io/api/tasks/users');
        url.searchParams.append('email', email); 
        url.searchParams.append('password', password); 

        try {
            fetch(url, {
                method: 'GET',
                headers: {'content-type':'application/json'},
              }).then(res => {
                if (res.ok) {
                    
                    return res.json();
                }
              }).then(user => {
                if(user.length === 0 ){
                  toast.error('User Not Found', {
                    position: 'bottom-right',
                    autoClose: 3000,
                  });
                }
                else{

                  dispatch({ type: "removeFromArray", item: user[0] });
                  dispatch({ type: "addToArray", item: user[0] });
                  navigate("/dashboard");
                }
              }).catch(error => {

                toast.error('Something wen wrong', {
                    position: 'bottom-right',
                    autoClose: 3000,
                  });
              })
        } catch (err) {
          console.log(err);
        }
      };

  return (
    <div className='h-screen font-bold bagckgroundImages text-white flex items-center justify-center'>
        <div className='backdrop-blur-sm bg-white/30 p-4 flex flex-col justify-center h-fit rounded-lg'>
            <h1 className='mb-7'> LOGIN </h1>
            <form onSubmit={handleLogin} className='flex flex-col'>
                <p className='font-normal text-start mb-2'> Email </p>
                <input
                    type="email"
                    required
                    placeholder='Email'
                    name="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="mb-6 !bg-slate-800 block w-full px-2 xl:!py-3 py-2 mt-1 border-slate-900  rounded-md shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-600 focus:ring-opacity-50"
                />
                <p className='font-normal text-start mb-2'> password </p>
                <input
                    type='password'
                    required
                    placeholder='Password'
                    name="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="mb-4 bg-slate-800 block w-full px-2 xl:!py-3 py-2 mt-1 border-slate-900  rounded-md shadow-sm focus:border-slate-400-300 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
                />
                <div className="flex items-center mt-4">
                    <button type='submit' className="mb-4 w-full px-4 py-3 xxsm:mx-16 xsm:mx-24   tracking-wide text-white transition-colors duration-200 transform bg-blue-900 shadowBox  rounded-md focus:outline-none">
                        LOG IN
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}
