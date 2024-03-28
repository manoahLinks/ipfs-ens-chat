import { useEffect, useState } from "react";
import { getChatContract } from "../constants/contracts";
import { readOnlyProvider } from "../constants/providers";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

function useGetEnsByAddr() {

    const {address} = useWeb3ModalAccount()

    const [ens, setEns] = useState('');

    useEffect(() => {
        const contract = getChatContract(readOnlyProvider);

        contract
            .getEnsByAddress(address)
            .then((res) => {
                // const converted = res.map((item) => ({
                //     name: item.name,
                //     wallet: item.walletAddress,
                //     avatar: item.avatar,
                //     isRegistered: item.isRegistered
                // }));

                const _home = {
                    name: res[0],
                    // wallet: res[1],

                }
                console.log(res[0])
                setEns({
                    loading: false,
                    data: res[0],
                });
            })
            .catch((err) => {
                console.error("error fetching ens: ", err.message);
                // setEns((prev) => ({ ...prev, loading: false }));
            });
    }, []);

    return ens;
}

export default useGetEnsByAddr;