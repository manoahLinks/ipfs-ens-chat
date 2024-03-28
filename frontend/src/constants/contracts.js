import { ethers } from "ethers";
import Abi from "../Abi/ensAbi.json";

export const getChatContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_ens_contract_address,
        Abi,
        providerOrSigner
    );