import { useEffect, useState } from "react";
import { getChatContract } from "../constants/contracts";
import { readOnlyProvider } from "../constants/providers";


function useGetChats() {
    const [chats, setChats] = useState({
        loading: true,
        data: [],
    });

    useEffect(() => {
        const contract = getChatContract(readOnlyProvider);

        contract
            .getAllEns()
            .then((res) => {
                const converted = res.map((item) => ({
                    name: item.name,
                    wallet: item.walletAddress,
                    avatar: item.avatar,
                    isRegistered: item.isRegistered
                }));
                setChats({
                    loading: false,
                    data: converted,
                });
            })
            .catch((err) => {
                console.error("error fetching proposals: ", err);
                setChats((prev) => ({ ...prev, loading: false }));
            });
    }, []);

    return chats;
}

export default useGetChats;