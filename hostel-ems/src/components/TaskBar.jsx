import { IoHome, IoSearch, IoSettings } from 'react-icons/io5';
import { GoGraph } from "react-icons/go";
import '../index.css'; 

export default function Taskbar() {
  return(
    <div className='w-screen'>
      <div className='w-screen h-[3rem] flex justify-left pl-[2rem] items-center bg-red-500 gap-[2rem]'>
        
        <div className='flex justify-center rounded-[5px] pl-[5px] pr-[5px] items-center gap-[5px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-400'><IoHome /><p>Home</p></div>
        
        <div className='flex justify-center rounded-[5px] pl-[5px] pr-[5px] items-center gap-[5px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-400'><GoGraph /><p>Analytics</p></div>
        
        <div className='flex justify-center rounded-[5px] pl-[5px] pr-[5px] items-center gap-[5px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-400'><IoSettings /><p>Settings</p></div>

      </div>
    </div>
  );
}
