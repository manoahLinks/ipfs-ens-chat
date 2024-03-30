import { useEffect, useState } from "react";
import { getMessageContract } from "../constants/contracts";
import { readOnlyProvider } from "../constants/providers";


function useGetMessages(_from, _to) {
    const [messages, setMessages] = useState({
        loading: true,
        data: [],
    });

    useEffect(() => {
        const contract = getMessageContract(readOnlyProvider);

        contract
            .getUsersMessages(_from, _to)
            .then((res) => {
                const converted = res.map((item) => ({
                    id: item.id,
                    from: item.from,
                    to: item.to,
                    content: item.content
                }));
                setMessages({
                    loading: false,
                    data: converted,
                });
            })
            .catch((err) => {
                console.error("error fetching messages: ", err);
                setMessages((prev) => ({ ...prev, loading: false }));
            });
    }, []);

    return messages;
}

export default useGetMessages;