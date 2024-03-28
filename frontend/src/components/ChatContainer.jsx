import React from 'react'
import {HiOutlineUser} from "react-icons/hi2"
import useGetChats from '../hooks/useGetChats'
import useGetEnsByAddr from '../hooks/useGetEnsByAddr';
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

function ChatContainer() {

    const {address} = useWeb3ModalAccount()

    const {loading, data: chats} = useGetChats();

    const {ens} = useGetEnsByAddr(address);

    console.log(ens)

  return (
    <div className='grid grid-cols-8 p-4 gap-x-8 flex-1 h-full'>
        
        <div className='bg-slate-300 rounded-md col-span-2 flex flex-col p-2 gap-y-2'>
            <h4 className='font-bold text-[20px]'>All chats</h4>
            
            <div className='flex flex-col gap-y-2'>
               {chats.length !== 0  && chats.map((chat)=> (
                    <div key={chat.name} className='p-2 flex gap-x-4 shadow items-center hover:cursor-pointer hover:bg-white rounded-lg'>
                        <span className='p-2 rounded-full  bg-gradient-to-r from-purple-300 to-red-500'>
                            <HiOutlineUser size={30}/>
                        </span>
                        <div className='flex flex-col gap-y-1'>
                            <h4 className='font-bold text-slate-400'>{chat.name}</h4>
                            <h4 className='font-light text-[10px]'>{chat.wallet.slice(0, 9)}...</h4>
                        </div>
                    </div>
                 ))
                    
               }
                

            </div>
        </div>

        <div className='bg-slate-300 flex p-2 rounded-md col-span-6'>
            <span className='flex rounded-full shadow p-1 w-full mt-auto'>
                <input 
                    className='w-full rounded-full border-slate-300 placeholder-slate-300'
                    type="text" 
                    placeholder='type message ...'
                />
            </span>
        </div>

    </div>
  )
}

export default ChatContainer