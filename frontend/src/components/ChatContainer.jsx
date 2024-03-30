import React, { useEffect, useState } from 'react'
import {HiOutlineUser} from "react-icons/hi2"
import useGetChats from '../hooks/useGetChats'
import useGetEnsByAddr from '../hooks/useGetEnsByAddr';
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getChatContract, getMessageContract } from '../constants/contracts';
import { readOnlyProvider } from '../constants/providers';
import { ethers } from 'ethers';
import { FaSpinner } from 'react-icons/fa6';
import useGetMessages from '../hooks/useGetMessages';
import { toast } from 'react-toastify';



function ChatContainer() {

    const [message, setMessage] = useState('');

    const [to, setTo] = useState('')

    const [selectedMsg, setSelectedMsg] = useState([])

    const {address} = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider();

    const {loading, data: chats} = useGetChats();
    const [isPending, setIsPending] = useState(false)

    const [ens, setEns] = useState([{
        loading: true,
        data: [] 
    }]);


    useEffect(() => {
        const fetchData = async () => {
            const contract = getChatContract(readOnlyProvider);

            contract
            .getEnsByAddress(address)
            .then((res) => {

                const _home = {
                    name: res[0],
                }
                setEns({
                    loading: false,
                    data: [res],
                });
            })
            .catch((err) => {
                console.error("error fetching ens: ", err.message);
                setEns((prev) => ({ ...prev, loading: false }));
            });
        }

        fetchData()
    }, [])

    const [messages, setMessages] = useState();

    // get messages
    useEffect(() => {

        const fetchData = async () => {
            const msgContract = getMessageContract(readOnlyProvider);

            const msgs = await msgContract.getUsersMessages(address, to)

            const converted = msgs.map((item) => ({
                id: item.id.toString(),
                from: item.from,
                to: item.to,
                content: item.content
            }));

            setMessages(converted);

            console.log(converted)
        }

        fetchData()

        console.log(messages)

    }, [to, messages]);
    
    const sendMessage = async () => {

        const Message = {
            from : address.toString() || '',
            to: '',
            message: "texting texting texting"
        }

        const transaction = {
            from : address.toString() || '',
            to: to,
            message: message
        }

        const provider = new ethers.BrowserProvider(walletProvider);

        try {

            setIsPending(true)

            const signer = await provider.getSigner();
            const signature = await signer.signMessage(JSON.stringify(transaction));

            console.log(signature)

            const response = await fetch('http://localhost:4500/send-tx', {
                method: "POST",
                body: JSON.stringify({...transaction, signature: signature}),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const json = await response.json()

            if(response.ok) {
                console.log(json)
                setIsPending(false)
                toast.success("Msg sent...")
            }else{
                console.log(json)
                setIsPending(false)
                toast.error("failed")
            }
            
        } catch (error) {
            console.log(error)
        }

    }  

  return (
    <div className='grid grid-cols-8 p-4 gap-x-8 flex-1 h-full'>
        
        <div className='bg-slate-300 rounded-md col-span-2 flex flex-col p-2 gap-y-2'>
            <h4 className='font-bold text-[20px]'>All chats</h4>
            
            <div className='flex flex-col gap-y-2'>
               {chats.length !== 0  && chats.map((chat)=> (
                    <div onClick={() => {setTo(chat.wallet)}} key={chat.name} className='p-2 flex gap-x-2 shadow items-center hover:cursor-pointer bg-slate-200  hover:bg-white rounded-lg'>
                        {/* <span className='p-2 rounded-full  bg-gradient-to-r from-purple-300 to-red-500'> */}
                            {/* <HiOutlineUser size={30}/> */}
                            <img 
                                src={chat.avatar} 
                                classeName='w-50 h-50 rounded-full' 
                                alt="ipfs img" 
                            />
                        {/* </span> */}
                        <div className='flex flex-col gap-y-1'>
                            <h4 className='font-bold text-slate-400'>{chat.name}</h4>
                            <h4 className='font-light text-[10px]'>{chat.wallet.slice(0, 9)}...</h4>
                        </div>
                    </div>
                 ))
                    
               }
                
                {loading && <span className='m-auto'><FaSpinner className='animate-spin' size={15}/></span>}

            </div>
        </div>

        <div className='bg-slate-300 flex flex-col p-2 rounded-md col-span-6'>
            <div className='flex-1 flex flex-col gap-y-4'>
                <small className='text-center p-2 rounded-full bg-white  mx-auto'><span className='font-bold'>To:</span>  {to != '' && to}</small>
               <div className='flex flex-col gap-y-2'>
                {messages && messages.length > 0 && messages.map((msg) => (
                      
                       <div className={`${msg.from == address ? `bg-blue-300` : ` bg-green-300`} p-2`}>
                           <small>{msg.content}</small> 
                        </div>
                    ))}
               </div>

            </div>
            <span className='flex rounded-full shadow p-1 w-full mt-auto'>
                <input 
                    className='w-full rounded-full border-slate-300 placeholder-slate-300'
                    type="text" 
                    placeholder='type message ...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value) }
                />
                <button 
                    className='px-6 rounded-full items-center flex bg-blue-500 text-white'
                    onClick={sendMessage}
                > 
                    <h4>send</h4>
                
                    {isPending && <span className='m-auto'><FaSpinner className='animate-spin' size={15}/></span>}
                </button>
            </span>
        </div>

    </div>
  )
}

export default ChatContainer