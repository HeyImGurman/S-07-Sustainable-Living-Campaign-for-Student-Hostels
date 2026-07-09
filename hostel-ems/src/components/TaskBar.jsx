import { IoHome, IoSearch, IoSettings } from 'react-icons/io5';
import { GoGraph } from "react-icons/go";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { CgDarkMode } from "react-icons/cg";
import '../index.css'; 

export default function Taskbar() {
  return(
    <div className='w-screen font-pliant'>
      <div className='w-screen h-[3rem] flex justify-left pl-[2rem] items-center bg-red-500 gap-[2rem]'>
        
        <div className='flex justify-center rounded-[5px] pl-[5px] pr-[5px] items-center gap-[5px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-400'><IoHome /><p>Home</p></div>
        
        <div className='flex justify-center rounded-[5px] pl-[5px] pr-[5px] items-center gap-[5px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-400'><GoGraph /><p>Analytics</p></div>

        <div className='flex justify-center rounded-[5px] pl-[5px] pr-[5px] items-center gap-[5px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-400'><HiOutlineDocumentReport /><p>Logs</p></div>

        <div className='flex justify-center rounded-[5px] pl-[5px] pr-[5px] items-center gap-[5px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-400'><IoSettings /><p>Settings</p></div>

        <button className='ml-auto mr-[2rem] rounded-[5px] pl-[5px] pr-[5px] pt-[5px] pb-[5px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-400'><CgDarkMode size={20}/></button>
      </div>
    </div>
  );
}
