import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance';

import { API_PATHS } from '../../utils/apiPaths';
import { PRIORITY_DATA } from '../../utils/data';
import SelectDropDown from '../../components/inputs/SelectDropDown';
import SelectUsers from '../../components/inputs/SelectUsers';
import TodoListInput from '../../components/inputs/TodoListInput';
import AddAttachmentsinput from '../../components/inputs/AddAttachmentsinput';
import { LuTrash } from 'react-icons/lu';
import DeleteAlert from '../../components/layouts/DeleteAlert';

import Modal from '../../components/layouts/Modal';
const CreateTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location?.state?.taskId || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const[currentTask,setCurrentTask]=useState(null);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });

  const[openDeleteAlert,setOpenDeleteAlert]=useState(false);
  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: '',
      dueDate: '',
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
    });
  };

  const createTask = async () => {
     setLoading(true);

     try {
      const todolist=taskData.todoCheckList?.map((item)=>({
        text:item,
        completed:false,
      }));

//  console.log("Submitting Task:", {
//   ...taskData,
//   todoCheckList: taskData.todoCheckList.map(item => ({
//     text: item,
//     completed: false,
//   }))
// });

      const response=await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
        ...taskData,
        dueDate:new Date(taskData.dueDate).toISOString(),
        todoCheckList:todolist,

      });

      toast.success("Task Created Successfully");
      clearData();
      
     } catch (error) {
      console.error("Error creating Task:",error);
      setLoading(false);
      
     }finally{
      setLoading(false);
     }
    };

   

  const updateTask = async () => {
    setLoading(true);

    try {
      const todoList=taskData.todoCheckList?.map((item) => {
        const prevtodoCheckList=currentTask?.todoCheckList || [];
        const matchedTask=prevtodoCheckList.find((task)=> task.text==item);

        return{
          text:item,
          completed: matchedTask ? matchedTask.completed:false,
        };
      });

      const response=await axiosInstance.put(
       API_PATHS.TASKS.UPDATE_TASK(taskId),
       {
        ...taskData,
        dueDate:new Date(taskData.dueDate).toISOString(),
        todoCheckList:todoList,
       }
      );
      toast.success("Task Updated Succesfully");
    } catch (error) {
      console.error("Error creating Task:",error);
       setLoading(false);
    } finally {
      setLoading(false);
    }
  };

 const handleSubmit = async () => {
  setError('');

  if (!taskData.title.trim()) {
    setError('Task title is required');
    toast.error('Task title is required');
    return;
  }
  if (!taskData.description.trim()) {
    setError('Description is required');
    toast.error('Description is required');
    return;
  }

  if (!taskData.dueDate) {
    setError('Due date is required');
    toast.error('Due date is required');
    return;
  }

  if (taskData.assignedTo?.length === 0) {
    setError('Task not assigned to any member');
    toast.error('Assign task to at least one member');
    return;
  }

  if (taskData.todoCheckList?.length === 0) {
    setError('Add at least one todo item');
    toast.error('Add at least one todo item');
    return;
  }

  if (taskId) {
    updateTask();
    return;
  }

  createTask();
};

const getTaskDetailsByID=async()=>{
  try{
    const response=await axiosInstance.get(
      API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
    );
    if(response.data)
    {
      const taskInfo=response.data;
      setCurrentTask(taskInfo);

      setTaskData((prevState) =>( {
        title:taskInfo.title,
        description: taskInfo.description,
        priority:taskInfo.priority,
        dueDate:taskInfo.dueDate
              ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
              : null,
              assignedTo:taskInfo?.assignedTo?.map((item) =>item?._id) || [],
              todoCheckList:taskInfo?.todoCheckList?.map((item)=>item?.text) || [],
              attachments:taskInfo?.attachments || [],
      }));
    }
  }
  catch(error)
  {
    console.error("Error fetching users:",error);
  }

};


//delete task
const deleteTask=async()=>{
  try{
    await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

    setOpenDeleteAlert(false);
    toast.success("Expense details deleted successfully");
    navigate('/admin/tasks');
  }catch(error)
  {
    console.error(
      "Error deleting expense:",
      error.response?.data?.message || error.message
    );
  }
}

useEffect(()=>{
  if(taskId)
  {
    getTaskDetailsByID(taskId)
  }

    return()=>{};
},[taskId])

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='p-4 max-w-4xl mx-auto'>
        <h2 className='text-xl font-semibold mb-4'>
          {taskId ? "Update Task" : "Create Task"}
        </h2>

        {taskId && (
          <button 
    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-50"
          onClick={()=>setOpenDeleteAlert(true)}
          >
            <LuTrash className='text-base'/>Delete
          </button>
        )}

        {/* Title */}
        <div className='mb-3'>
          <label className='text-xs font-medium text-slate-600'>Title</label>
          <input
            type='text'
            className='form-input w-full'
            placeholder='Enter title'
            value={taskData.title}
            onChange={(e) => handleValueChange('title', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className='mb-3'>
          <label className='text-xs font-medium text-slate-600'>Description</label>
          <textarea
            className='form-input w-full'
            placeholder='Describe task'
            rows={4}
            value={taskData.description}
            onChange={(e) => handleValueChange('description', e.target.value)}
          />
        </div>

        {/* Grid Layout */}
        <div className='grid grid-cols-12 gap-4 mt-2'>
          <div className='col-span-6 md:col-span-4'>
            <label className='text-xs font-medium text-slate-600'>Priority</label>
            <SelectDropDown
              options={PRIORITY_DATA}
              value={taskData.priority}
              onChange={(value) => handleValueChange('priority', value)}
              placeholder='Select Priority'
            />
          </div>

          <div className='col-span-6 md:col-span-4'>
            <label className='text-xs font-medium text-slate-600'>Due Date</label>
            <input
              type='date'
              className='form-input w-full'
              value={taskData.dueDate ? moment(taskData.dueDate).format('YYYY-MM-DD') : ''}
              onChange={(e) => handleValueChange('dueDate', e.target.value)}
            />
          </div>

          <div className='col-span-6 md:col-span-4'>
            <label className='text-xs font-medium text-slate-600'>Assign To</label>
            <SelectUsers
              selectedUsers={taskData.assignedTo}
              setSelectedUsers={(value) =>
                {
                   handleValueChange('assignedTo', value)

                }}
            />
          </div>
        </div>

        <div className='mt-3'>
          <label className='text-xs font-medium text-slate-600'>
            TODO Checklist</label>
          <TodoListInput
            todoList={taskData.todoCheckList}
            setTodoList={(value) =>
                handleValueChange("todoCheckList", value)}
          />
        </div>

        <div className='mt-3'>
          <label className='text-xs font-medium text-slate-600'>Add Attachments</label>
          <AddAttachmentsinput
            attachments={taskData.attachments}
            setAttachments={(value) => handleValueChange("attachments", value)}
          />
        </div>

        {error && <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>}

        <div className='flex justify-end mt-7'>
          <button
            className='add-btn'
            onClick={handleSubmit}
            disabled={loading}
          >
            {taskId ? "UPDATE TASK" : "CREATE TASK"}
          </button>
        </div>
      </div>


      <Modal 
      isOpen={openDeleteAlert}
      onClose={()=>setOpenDeleteAlert(false)}
      title="delete task"
      >
        <DeleteAlert
        content="Are you sure you  want to delete this Task?"
        onDelete={()=>deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
