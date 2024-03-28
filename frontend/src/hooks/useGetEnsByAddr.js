import { useEffect, useState } from "react";
import { getChatContract } from "../constants/contracts";
import { readOnlyProvider } from "../constants/providers";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

function useGetEnsByAddr() {

    const {address} = useWeb3ModalAccount()

    const [ens, setEns] = useState({
        loading: true,
        data: {},
    });

    useEffect(() => {
        const contract = getChatContract(readOnlyProvider);

        contract
            .getEnsByAddress("0xc408235a9A01767d70B41C98d92F2dC7B0d959f4")
            .then((res) => {
                // const converted = res.map((item) => ({
                //     name: item.name,
                //     wallet: item.walletAddress,
                //     avatar: item.avatar,
                //     isRegistered: item.isRegistered
                // }));
                setEns({
                    loading: false,
                    data: res,
                });
            })
            .catch((err) => {
                console.error("error fetching ens: ", err);
                setEns((prev) => ({ ...prev, loading: false }));
            });
    }, []);

    return ens;
}

export default useGetEnsByAddr;