import { configureWeb3Modal } from "./connection";
import { ChatContainer, Register } from './components';
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
// import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { getChatContract } from './constants/contracts';
import { readOnlyProvider } from './constants/providers';
import { useEffect, useState } from "react";


configureWeb3Modal();

function App() {

  const {address} = useWeb3ModalAccount()

    // const {loading, data: chats} = useGetChats();

    // const {ens} = useGetEnsByAddr();

    const [ens, setEns] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            const contract = getChatContract(readOnlyProvider);

            contract
            .getEnsByAddress(address)
            .then((res) => {

                const _home = {
                    name: res[0],
                    // wallet: res[1],

                }
                // console.log(res[0])
                setEns(
                    // loading: false,
                    res[0],
                );
            })
            .catch((err) => {
                console.error("error fetching ens: ", err.message);
                // setEns((prev) => ({ ...prev, loading: false }));
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
    </div>
  )
}

export default App
