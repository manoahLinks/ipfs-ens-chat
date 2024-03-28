import { configureWeb3Modal } from "./connection";
import { ChatContainer, Register } from './components';
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

configureWeb3Modal();

function App() {

  const {address} = useWeb3ModalAccount()

  return (
    <div className="flex flex-col bg-slate-600 w-full h-screen p-2 gap-y-4">
      <div className='flex justify-between p-4'>
        <h4 className='text-[20px] font-bold bg-gradient-to-r from-purple-300 to-red-500 bg-clip-text text-transparent'>SoftChat</h4>
        <w3m-button />
      </div>
      
      <div className='flex-1'>
          {/* <Register/> */}
          <ChatContainer/>
      </div>
    </div>
  )
}

export default App
