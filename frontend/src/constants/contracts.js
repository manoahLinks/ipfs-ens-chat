import { ethers } from "ethers";
import Abi from "../Abi/ensAbi.json";
import MsgAbi from "../Abi/messageAbi.json";

export const getChatContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_ens_contract_address,
        Abi,
        providerOrSigner
    );


export const getMessageContract = (providerOrSigner) => 
    new ethers.Contract(
        import.meta.env.VITE_message_contract_address,
        MsgAbi,
        providerOrSigner
    )
