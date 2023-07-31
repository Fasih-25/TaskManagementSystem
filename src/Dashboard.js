import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation, Link } from "react-router-dom";
import AddTask from "./AddTask";


export default function Dashboard() {
    const [buttonPopup, setButtonPopup] = useState(false);
    const handleOnClose = () => setButtonPopup(false);
    const [tasks, setTasks] = useState([]);
    const location = useLocation();
    const data = location.state;
    
    useEffect(() => {
        const fetchData = async () => {
            fetch('https://64c64bad0a25021fde917f0f.mockapi.io/api/tasks/tasks', {
                method: 'GET',
                headers: {'content-type':'application/json'},
              }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                // handle error
              }).then(tasks => {
                // Do something with the list of tasks
                localStorage.setItem('tasks', JSON.stringify(tasks));
                setTasks(tasks);
                console.log(tasks);
              }).catch(error => {
                alert("error occurs");
              })
        };
      
        fetchData();
      }, [data]);

    
      async function handleChangeStatus(taskId) {
        fetch(`https://64c64bad0a25021fde917f0f.mockapi.io/api/tasks/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ completed: true })
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            // handle error
            throw new Error('Failed to update task status');
          })
          .then(updatedTask => {
            alert("TASK STATUS UPDATED"); 

            setTasks(prevTasks =>
              prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
            );
          })
          .catch(error => {
            alert("error occurs");
          });
      }


    const onDragEnd = (result) => {
    if (!result.destination) return;
   
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
       items.splice(result.destination.index, 0, reorderedItem);
        
       setTasks(items);
       
     };
     useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
      }, [tasks]);

     
   return(
    <div className='h-screen font-bold bgImage text-white flex flex-col justify-center p-4 items-center overflow-scroll'>
        <div className='w-11/12 h-fit p-2 backdrop-blur-sm bg-white/30 m-3 rounded-md flex justify-around mt-4 ' >
            <div>
                <button className='bg-teal-600 p-3 rounded-xl' onClick={() => setButtonPopup(true)}>Add Task</button>
            </div>
        </div>
        <div className="flex justify-center h-5/6">
            <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col justify-start ">
                {tasks.map((task, index) => (
                    <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                    >
                    {(provided) => (
                        <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        >
                            <div className="flex flex-col mx-3 my-2 backdrop-blur-sm bg-white/30 w-72 h-fit p-3 rounded-xl  "> 
                                <h1 className="text-teal-400  font-bold text-start"> {task.title} </h1>
                                <p className="  font-normal "> {task.description} </p> 
                                <div className="flex justify-end mt-2">
                                        <button className="bg-green-800 px-4 py-2 rounded-lg font-semibold " onClick={() => handleChangeStatus(task.id)}>Done</button>
                                </div>
                            </div>
                        </div>
                    )}
                    </Draggable>
                ))}
                {provided.placeholder}
                </div>
            )}
            </Droppable>
        </DragDropContext>
      </div>
      <AddTask trigger={buttonPopup} onClose={handleOnClose}>
        <h3>modal</h3>
        <p>this is popup</p>
      </AddTask>
    </div>
   )
}


