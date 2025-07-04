import React from 'react'

const Progress = ({progress,status}) => {

    const getColor=()=>{
        switch(status){
            case "In Progress":
            return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

              case "Completed":
            return "text-lime-500 bg-lime-50 border border-lime-500/20"

              default :
            return "text-violet-500 bg-violet-50 border border-violet-500/10"
        }
    }
  return (
    <div className='w-full bg-gray-200 rounded-full h-1.5'>
        <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{width: `{Progress}%`}}>

        </div>
      
    </div>
  )
}

export default Progress
