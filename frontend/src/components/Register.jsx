import { useState } from 'react';
import {HiCamera} from 'react-icons/hi2';
import axios from "axios";
import {FaSpinner} from "react-icons/fa6";

import { getProvider } from "../constants/providers";
import { getChatContract } from "../constants/contracts";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from 'react-toastify';


function Register() {

  const { walletProvider } = useWeb3ModalProvider();

  const [img, setImg] = useState('');
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 // write function  
  const handleRegisteration = async (name, avatar) => {
   
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getChatContract(signer);

    try {
        const transaction = await contract.registerEns(name, avatar);
        console.log("transaction: ", transaction);
        const receipt = await transaction.wait();

        console.log("receipt: ", receipt);

        if (receipt.status) {
            return console.log("register successful!");
        }

        console.log("register failed!");
    } catch (error) {
        console.log(error);
    }
};


//   pinata setup 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", img);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
          },
        }
      );

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("File URL:", fileUrl);

      await handleRegisteration(name, fileUrl);

      toast.success('succesful')
      
    } catch (error) {
      console.log("Pinata API Error:", error);
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-4/12 m-auto rounded-md p-5 bg-white shadow flex flex-col gap-y-2'>
        <form className='flex flex-col gap-y-4 w-9/12 m-auto'>
            <h4 className='bg-gradient-to-r from-purple-300 to-red-500 bg-clip-text text-transparent font-bold text-[20px] text-center'>Register and chat lets do great things !</h4>
            {img && <img className='w-40 h-40 rounded-full m-auto' src={URL.createObjectURL(img)} alt="" />}
            <input type="file" accept='image/*' hidden id='img' onChange={(e) => setImg(e.target.files[0])}  />
            {!img && <label className='rounded-full m-auto bg-slate-300 p-2' htmlFor="img">
                <HiCamera size={30}/>
            </label>}

            <input 
                type="text" 
                className='border-slate-300 placeholder-slate-300'
                placeholder='@username'
                value={name}
                onChange={(e) => {setName(e.target.value)}}
            />

            <button className='p-2 bg-gradient-to-r from-purple-300 to-red-500 rounded-md font-bold text-white' onClick={handleSubmit}>Register</button>
            {isLoading && <span className='m-auto'><FaSpinner className='animate-spin' size={20}/></span>}
        </form>
    </div>
  )
}

export default Register