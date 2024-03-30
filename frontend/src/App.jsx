import { configureWeb3Modal } from "./connection";
import { ChatContainer, Register } from './components';
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { getChatContract } from './constants/contracts';
import { readOnlyProvider } from './constants/providers';
import { useEffect, useState } from "react";

// library imports
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


configureWeb3Modal();

function App() {

  const {address} = useWeb3ModalAccount()

    const [ens, setEns] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            const contract = getChatContract(readOnlyProvider);

            contract
            .getEnsByAddress(address)
            .then((res) => {

                const _home = {
                    name: res[0],
                }
                setEns(
                    res[0],
                );
            })
            .catch((err) => {
                console.error("error fetching ens: ", err.message);
            });
        }

        fetchData()
    }, [address])

    console.log(ens)

  return (
    <div className="flex flex-col bg-slate-600 w-full h-screen p-2 gap-y-4">
      <div className='flex justify-between p-4'>
        <h4 className='text-[20px] font-bold bg-gradient-to-r from-purple-300 to-red-500 bg-clip-text text-transparent'>SoftChat</h4>
        <w3m-button />
      </div>
      
      <div className='flex-1'>
          {ens && ens.toString() !== '' ? (
            <ChatContainer/>
          ): (
            <Register/>
            
          ) }
          
          
      </div>
      <ToastContainer/>
    </div>
  )
}

export default App
