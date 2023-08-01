import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";
import AddTask from "./AddTask";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';

export default function Dashboard() {
  const user = useSelector((state) => state.user);;
  const [buttonPopup, setButtonPopup] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [deleted, setDeleted] = useState();
  const handleOnClose = () => setButtonPopup(false);
 

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const data = location.state;

  useEffect(() => {
    const fetchData = async () => {
      fetch("https://64c64bad0a25021fde917f0f.mockapi.io/api/tasks/tasks", {
        method: "GET",
        headers: { "content-type": "application/json" },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          // handle error
        })
        .then((tasks) => {
          const typeSpecifictasks = tasks.filter((tasks) => tasks.group == user[0].group);
          dispatch({ type: "removeFromtask" });
          dispatch({ type: "addTotask", item: typeSpecifictasks });
          setTasks(typeSpecifictasks);

        })
        .catch((error) => {
          alert("error occurs");
        });
    };
  
    fetchData();
 
  }, [data,deleted]);

  function handleLogout() {
    dispatch({ type: "removeFromArray", item: user[0] });
    toast.success('Logged out successfully!', {
      position: 'bottom-right',
      autoClose: 3000,
    });
    navigate("/");
  }

  async function handleDelete(taskId) {
    fetch(
      `https://64c64bad0a25021fde917f0f.mockapi.io/api/tasks/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
         toast.error('Task Not Deleted!', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        throw new Error("Failed to Delete task");
       
      })
      .then((updatedTask) => {
        toast.success('Task Deleted successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        setDeleted((variable) => variable + 1);
      })
      .catch((error) => {
        alert("error occurs");
      });
  }

  async function handleChangeStatus(taskId) {
    fetch(
      `https://64c64bad0a25021fde917f0f.mockapi.io/api/tasks/tasks/${taskId}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ completed: true }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        toast.error('Task Not Completed', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        throw new Error("Failed to update task status");
      })
      .then((updatedTask) => {
        toast.success('Task Completed', {
          position: 'bottom-right',
          autoClose: 3000,
        });

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      })
      .catch((error) => {
        alert("error occurs");
      });
  }

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
    toast.success('Task moved', {
      position: 'bottom-right',
      autoClose: 3000,
    });
  };

  useEffect(() => {
    dispatch({ type: "removeFromtask" });
    dispatch({ type: "addTotask", item: tasks });
  }, [tasks]);

  return (
    <div className="h-screen font-bold bgImage text-white flex flex-col justify-center p-4 items-center overflow-scroll">
      <div className="w-11/12 h-fit p-2 backdrop-blur-sm bg-white/25 m-3 rounded-md flex justify-between mt-4 ">
        <div className=" rounded-lg flex justify-center items-center">
            <p className="p-2 text-cyan-400">{user[0].name}</p>
        </div>
        <div>
          <button
            className="bg-teal-600 p-3 rounded-xl mx-1 shadow-slate-700"
            onClick={() => setButtonPopup(true)}
          >
            Add Task
          </button>
          <button
            className="bg-red-600 p-3 rounded-xl mx-1"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
      <div className="flex justify-center h-5/6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col justify-start "
              >
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
                        <div className="flex flex-col mx-3 my-2 backdrop-blur-sm bg-white/20 w-96 h-fit p-3 rounded-xl  ">
                          <h1 className="text-teal-50-400  font-bold text-start">
                            {" "}
                            {task.title}{" "}
                          </h1>
                          <p className="  font-normal"> {task.description} </p>
                          <div className="flex justify-end mt-2">
                          {task.completed === false ? (
                              <button
                                className="bg-purple-900 px-2 py-2 rounded-lg font-semibold "
                                onClick={() => handleChangeStatus(task.id)}
                              >
                                Incomplete
                              </button>
                            ) : (
                              <button className="bg-green-800 px-2 py-2 rounded-lg font-semibold mx-1" disabled>
                                Completed
                              </button>
                            )}
                            <button className="bg-red-800 px-4 py-2 rounded-lg font-semibold mx-1" onClick={() => handleDelete(task.id)}>
                                Delete
                              </button>
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
  );
}
