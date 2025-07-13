import React, { useState, useRef, useEffect } from 'react';
import { MdSend, MdAttachFile } from 'react-icons/md';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { baseURL } from '../config/AxiosHelper';
import { getMessagesApi } from '../services/RoomService';
import { timeAgo } from '../config/helper'

const ChatPage = () => {

    const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!connected) {
            navigate('/');
        }
    }, [connected, roomId, currentUser]);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Load messages
    useEffect(() => {
        async function loadMessages() {
            try {
                const messages = await getMessagesApi(roomId);
                setMessages(messages);
            } catch (error) {
                // handle error if needed
            }
        }
        if (connected) {
            loadMessages();
        }
    }, [connected, roomId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    // Initialize stompClient and websocket connection
    useEffect(() => {
        const connectWebSocket = () => {
            const sock = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(sock);
            client.connect({}, () => {
                setStompClient(client);
                toast.success("Connected to chat");
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            });
        };
        if (connected) {
            connectWebSocket();
        }
    }, [roomId, connected]);

    // Detect scroll to show/hide scroll-to-bottom button
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
            if (scrollHeight - scrollTop - clientHeight > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        const chatBox = chatBoxRef.current;
        if (chatBox) {
            chatBox.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (chatBox) {
                chatBox.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // Send message function
    const sendMessage = () => {
        if (stompClient && connected && input.trim()) {
            const message = {
                content: input,
                sender: currentUser,
                roomId: roomId
            };
            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            setInput("");
        }
    };

    // Scroll to bottom on button click
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // Logout function
    const handleLogout = () => {
        if (stompClient) {
            stompClient.disconnect();
        }
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate('/');
    };

    const roomName = roomId;
    const userName = currentUser;

    return (
        <div className="dark:bg-gray-950 text-white min-h-screen flex flex-col">
            {/* Header */}
            <header
                className="fixed top-0 w-full z-10 dark:bg-gray-800 shadow flex items-center px-4"
                style={{ height: '64px' }}
            >
                <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-semibold">Room: {roomName.split(" ")[0]}</h1>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">User: {userName.split(" ")[0]}</h1>
                    </div>
                    <div>
                        <button onClick={handleLogout} className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full">
                            Leave
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Messages */}
            <main
                ref={chatBoxRef}
                className="max-w-3xl mx-auto w-full px-10 overflow-auto dark:bg-slate-900 rounded-lg hide-scrollbar"
                style={{
                    height: 'calc(100vh - 64px - 64px)',
                    marginTop: '64px',
                    marginBottom: '64px'
                }}
            >
                <div className="message_container space-y-1 py-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.sender.trim().toLowerCase() === currentUser.trim().toLowerCase()
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div
                                className={`p-3 max-w-xs sm:max-w-sm md:max-w-md rounded-xl text-white shadow-sm ${message.sender.trim().toLowerCase() === currentUser.trim().toLowerCase()
                                    ? "bg-blue-900"
                                    : "bg-gray-700"
                                    }`}
                            >
                                <div className="flex flex-row gap-3 items-start">
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src="https://avatar.iran.liara.run/public/43"
                                        alt="avatar"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-semibold text-white">{message.sender}</p>
                                        <p className="text-sm text-gray-100 break-words">{message.content}</p>
                                        <p className="text-xs text-gray-400 text-right italic">
                                            {timeAgo(message.timeStamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Scroll to bottom arrow button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="fixed bottom-20 right-5 bg-gray-600 hover:bg-gray-800 text-white p-2 rounded-full shadow-lg transition-all text-xl"
                    title="Scroll to bottom"
                >
                    ↓
                </button>
            )}

            {/* Bottom Message Box */}
            <div
                className="fixed bottom-0 left-0 right-0 px-4 dark:bg-gray-900"
                style={{ height: '64px' }}
            >
                <div className="flex items-center max-w-3xl bg-gray-800 mx-auto px-3 py-2 rounded-lg shadow-lg border border-gray-700" style={{ height: '100%' }}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        className="flex-1 px-4 py-4 bg-gray-900 text-white rounded-full focus:outline-none min-w-0"
                    />
                    <label
                        htmlFor="fileInput"
                        className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-md flex items-center justify-center cursor-pointer"
                    >
                        <MdAttachFile size={18} />
                        <input id="fileInput" type="file" className="hidden" />
                    </label>
                    <button
                        onClick={sendMessage}
                        className="ml-2 p-2 bg-green-600 hover:bg-green-700 rounded-full text-white shadow-md flex items-center justify-center"
                    >
                        <MdSend size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
