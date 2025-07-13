import React, { useState } from "react";
import chatIcon from "../assets/chat.png"
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";



const JoinCreateChat = () => {

    const [detail, setDetail] = useState({
        roomId: '',
        userName: ''
    });

    const { roomId, setRoomId, currentUser, setCurrentUser, connected, setConnected } = useChatContext();
    const navigate = useNavigate();

    function handleFormInputChange(event) {
        setDetail({
            ...detail,
            [event.target.name]: event.target.value,

        });
    }

    function validateForm() {
        if (detail.userName === '' || detail.roomId === '') {
            toast.error('Invalid Input');
            return false;
        }
        return true;

    }


    async function joinChat() {
        if (validateForm()) {

            try {
                const room = await joinChatApi(detail.roomId);
                setRoomId(room.roomId);
                setCurrentUser(detail.userName);
                setConnected(true);
                navigate('/chat');
                toast.success('Joined...');

            } catch (error) {
                if (error.status == 400) {
                    toast.error(error.response.data);
                } else {
                    toast.error('Error in joining room');
                }

            }

        }
    }

    async function createRoom() {
        if (validateForm()) {
            console.log('Creating room with id:', detail);
            //call api to create room on backend
            try {
                const response = await createRoomApi(detail.roomId);
                console.log(response);
                toast.success('Room created successfully');
                setRoomId(response.roomId);
                setCurrentUser(detail.userName);
                setConnected(true);
                navigate('/chat');
                //redirect to chat page
                // navigate('/chat', { state: { roomId: response.roomId, userName: detail.userName } });

            } catch (error) {
                console.log(error);
                if (error.status == 400) {
                    toast.error('Room already exists');
                } else {
                    toast.error('Error in creating room');
                }


            }

        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className=" p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow ">
                <div>
                    <img src={chatIcon} className="w-24 mx-auto"></img>
                </div>
                <h1 className="text-2xl font-semibold text-center">Join Room / Create Room</h1>
                <div className="">
                    <label htmlFor="name" className="block font-medium mb-2">
                        Your Name
                    </label>
                    <input
                        onChange={handleFormInputChange}
                        value={detail.userName}
                        type="text"
                        id="name"
                        name="userName"
                        className="w-full px-4 py-2 dark:bg-gray-600 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"></input>
                </div>

                <div className="">
                    <label htmlFor="roomId" className="block font-medium mb-2">
                        Room ID / Create Room
                    </label>
                    <input
                        onChange={handleFormInputChange}
                        value={detail.roomId}
                        type="text"
                        id="roomId"
                        name="roomId"
                        className="w-full px-4 py-2 dark:bg-gray-600 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Room Id"></input>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    <button onClick={joinChat} className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-md">Join Room</button>
                    <button onClick={createRoom} className="px-3 py-2 dark:bg-green-500 hover:dark:bg-green-800 rounded-md">Create Room</button>

                </div>


            </div>

        </div>
    )
};

export default JoinCreateChat;