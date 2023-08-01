import {React, useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';


export default function AddTask({trigger, onClose}) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [groupId, setGroupId] = useState("")
    const [completed, setCompleted] = useState(false)
    let navigate = useNavigate();

    const newTask={ 
        title: title,
        description: description,
        group: groupId,
        completed: completed
    }


    const handleOnClose = (e) => {
        if(e.target.id ==='myModal') onClose();
    };
    const Close = (e) => {
        onClose();
      };
      
      let handleAddTask = async (e) =>
      {
        e.preventDefault();
        console.log(newTask);
        fetch('https://64c64bad0a25021fde917f0f.mockapi.io/api/tasks/tasks', {
            method: 'POST',
            headers: {'content-type':'application/json'},
            // Send your data in the request body as JSON
            body: JSON.stringify(newTask)
            }).then(res => {
            if (res.ok) {
                console.log(res);
                return res.json();
                
            }
            // handle error
            }).then(task => {
                alert("Task added successfully");
                setTitle("");
                setDescription("");
                setGroupId("");
                navigate("/dashboard",{state:newTask})
                onClose();
            }).catch(error => {
            alert("error occurs");
            })
      }
  return (trigger) ? (
    <div>
        <div id="myModal" className="modal d-flex p-0 z-1 absolute inset-0 m-6 pt-5 bg-neutral-400 bg-opacity-90 rounded-xl" onClick={handleOnClose}>

            {/* <!-- Modal content --> */}
            
            <div className="modal-content bg-transparent m-auto border-0 ">
                    {/* <div className='aboslute top-0 right-0 ' onClick={onClose()}>X</div> */}
                    <div className="modalbodySection p-4">  
                        <h5 className='text-black font-extrabold'>Add Course</h5>
                        <form onSubmit={handleAddTask}>
                            <div className='flex flex-col'>
                                <label className='text-start text-black mb-2'>Title</label>
                                <input type='text' name='tiltle' placeholder='Title Here' value={title}
                                onChange={(e)=>setTitle(e.target.value)} className="mb-6 bg-slate-800 block w-full px-2 xl:!py-3 py-2 mt-1 border-slate-900  rounded-md shadow-sm focus:border-slate-400-300 focus:ring focus:ring-slate-200 focus:ring-opacity-50" required />
                            </div>
                            <div className='flex flex-col mt-3'>
                                <label className='text-start text-black mb-2'>Description</label>
                                <input type='text' name='tiltle' placeholder='Description' value={description}
                                onChange={(e)=>setDescription(e.target.value)} className="mb-6 bg-slate-800 block w-full px-2 xl:!py-3 py-2 mt-1 border-slate-900  rounded-md shadow-sm focus:border-slate-400-300 focus:ring focus:ring-slate-200 focus:ring-opacity-50" required />
                            </div>
                            <div className='flex flex-col mt-3'>
                                <label className='text-start text-black mb-2'>Group Name</label>
                                <input type='text' name='tiltle' placeholder='Group Name' value={groupId}
                                onChange={(e)=>setGroupId(e.target.value)} className="mb-6 bg-slate-800 block w-full px-2 xl:!py-3 py-2 mt-1 border-slate-900  rounded-md shadow-sm focus:border-slate-400-300 focus:ring focus:ring-slate-200 focus:ring-opacity-50" required />
                            </div>

                            <div className='flex justify-center'>
                                <button type='submit' className='bg-blue-900 rounded-xl px-7 py-3' >ADD</button>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    </div>
  ) : "";
}
