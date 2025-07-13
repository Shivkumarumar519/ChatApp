// import { createContext, useState, useContext } from "react";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//     const [roomId, setRoomId] = useState('');
//     const [currentUser, setCurrentUser] = useState('');
//     const [connected, setConnected] = useState(false);

//     return (
//         <ChatContext.Provider value={{ roomId, setRoomId, currentUser, setCurrentUser, connected, setConnected }}>
//             {children}
//         </ChatContext.Provider>
//     );
// };

// const useChatContext = () => useContext(ChatContext);

// export default useChatContext;
import { createContext, useState, useContext, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [roomId, setRoomId] = useState(localStorage.getItem("roomId") || '');
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser") || '');
    const [connected, setConnected] = useState(localStorage.getItem("connected") === 'true');

    useEffect(() => {
        localStorage.setItem("roomId", roomId);
    }, [roomId]);

    useEffect(() => {
        localStorage.setItem("currentUser", currentUser);
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem("connected", connected);
    }, [connected]);

    return (
        <ChatContext.Provider value={{ roomId, setRoomId, currentUser, setCurrentUser, connected, setConnected }}>
            {children}
        </ChatContext.Provider>
    );
};

const useChatContext = () => useContext(ChatContext);

export default useChatContext;
