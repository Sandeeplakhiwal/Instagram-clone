// import { useEffect, useRef, useState } from "react";
// import { socket } from "../components/header";
// import { SignalData } from "simple-peer";
// import toast from "react-hot-toast";
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";
// import Peer from "peerjs";
// import { v4 as uuidV4 } from "uuid";

// // import { copyMessageToClipboard } from "../components/inbox/receivedMessage";

// interface CallUserData {
//   userToCall: string;
//   signal: any;
//   from: string;
//   name: string;
// }

// function CallPage() {
//   const [me, setMe] = useState<string>("");
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [receivingCall, setReceivingCall] = useState<boolean>(false);
//   const [caller, setCaller] = useState<string>("");
//   const [callerSignal, setCallerSignal] = useState<SignalData | undefined>();
//   const [callAccepted, setCallAccepted] = useState<boolean>(false);
//   const [idToCall, setIdToCall] = useState<string>("");
//   const [callEnded, setCallEnded] = useState<boolean>(false);
//   const [name, setName] = useState<string>("");
//   const [speakerOff, setSpeakerOff] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);

//   const myVideo = useRef<HTMLVideoElement>(null);
//   const userVideo = useRef<HTMLVideoElement>(null);
//   const connectionRef = useRef<Peer.Instance | null>(null);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

//   const { user } = useSelector((state: RootState) => state.user);

//   useEffect(() => {
//     if (user) {
//       setMe(user._id);
//       setName(user.name);
//     }
//   }, [user]);

//   useEffect(() => {
//     // const has_video = queryParams.get("has_video");
//     const ig_id = queryParams.get("ig_id");
//     if (ig_id) {
//       setIdToCall(ig_id);
//     }
//   }, [location, queryParams]);

//   useEffect(() => {
//     const initializeCameraStream = async () => {
//       try {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         setStream(mediaStream);
//         setMe("Sandeep Lakhiwal");
//         setIdToCall("abc@123");
//         if (myVideo.current) {
//           myVideo.current.srcObject = mediaStream;
//         }
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//       }
//     };
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setStream(stream);
//         if (myVideo.current) {
//           myVideo.current.srcObject = stream;
//         }
//       })
//       .catch((error): void => {
//         console.error("Error accessing media devices:", error);
//       });

//     initializeCameraStream();

//     socket.on("callUser", (data: CallUserData) => {
//       setReceivingCall(true);
//       setCaller(data.from);
//       setName(data.name);
//       setCallerSignal(data.signal);
//     });
//   }, []);

//   // let peer: Peer.Instance;

//   // if (stream) {
//   //   peer = new Peer({
//   //     initiator: true,
//   //     trickle: false,
//   //     stream,
//   //   });
//   // }

//   // Function to make a call to a user
//   const callUser = (id: string) => {
//     console.log("One");
//     if (!stream || !id) {
//       console.error("Stream or ID is not available");
//       return;
//     }
//     console.log("Two");
//     console.log("stream", stream);

//     // Create a new Peer instance

//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream,
//     });
//     console.log("Three");

//     // Check if the call method is available on the Peer instance
//     // if (typeof peer.call !== "function") {
//     //   console.error("Call method is not available on the Peer instance");
//     //   return;
//     // }

//     peer.on("signal", (data) => {
//       console.log("Data on signal", data);
//       socket.emit("callUser", {
//         userToCall: id,
//         signalData: data,
//         from: me,
//         name: name,
//       });
//     });

//     console.log("Four");

//     peer.on("stream", (stream) => {
//       if (userVideo.current) {
//         userVideo.current.srcObject = stream;
//       }
//     });
//     console.log("Five");

//     socket.on("callAccepted", (signal) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });
//     console.log("Six");

//     connectionRef.current = peer;
//     console.log("Seven");
//   };

//   const answerCall = () => {
//     toast.error("We are working on this feature");
//     if (!stream || !callerSignal) return;

//     setCallAccepted(true);

//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: stream,
//     });

//     peer.on("signal", (data) => {
//       socket.emit("answerCall", { signal: data, to: caller });
//     });

//     peer.on("stream", (stream) => {
//       if (userVideo.current) {
//         userVideo.current.srcObject = stream;
//       }
//     });

//     peer.signal(callerSignal);
//     connectionRef.current = peer;
//   };

//   const leaveCall = () => {
//     setCallEnded(true);
//     if (connectionRef.current) {
//       connectionRef.current.destroy();
//     }
//   };

//   const handleCallUser = () => {
//     if (idToCall.trim() === "") return;
//     callUser(idToCall);
//   };

//   function handleSpeakerBtn() {
//     setSpeakerOff(!speakerOff);
//   }

//   const handleToggleMute = () => {
//     setIsMuted((prevMuted) => !prevMuted);
//   };

//   const handleToggleCameraOff = () => {
//     setIsCameraOff(!isCameraOff);
//   };

//   useEffect(() => {
//     document.title = "Instagram Call";
//   }, []);

//   useEffect(() => {
//     socket.on("callIsComing", (data) => {
//       toast.success("Call is comming");
//       console.log("Call Is Comming");
//       console.log(data);
//     });
//   }, []);

//   useEffect(() => {
//     const meId = uuidV4();

//     const peer = new Peer();
//   }, []);

//   return 5 > 10 ? (
//     <>
//       <div className=" px-2 h-screen w-screen bg-[#000000] flex justify-center items-center">
//         <div className=" mx-2 flex flex-col justify-center h-full w-full  items-center">
//           <div className=" px-2 h-full w-full flex items-center justify-center ">
//             <div className=" h-full w-full rounded-md  text-right relative">
//               {stream && (
//                 <video
//                   playsInline
//                   muted
//                   ref={myVideo}
//                   autoPlay
//                   className=" h-full w-full rounded-sm   "
//                   style={{
//                     borderRadius: "10px",
//                     height: "100%",
//                     width: "100%",
//                   }}
//                 />
//               )}
//               <div className=" h-12 w-full absolute bottom-0 items-center flex flex-row justify-center my-auto bg-black-light text-white ">
//                 <div className="  flex justify-center mx-auto gap-3">
//                   <button
//                     className={` ${
//                       isCameraOff ? "bg-white" : "bg-black-faded"
//                     } rounded-full px-2 py-2`}
//                     title="Turn off camera"
//                     onClick={handleToggleCameraOff}
//                   >
//                     {isCameraOff ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="black"
//                         className="w-5 h-5"
//                       >
//                         <path d="M.97 3.97a.75.75 0 0 1 1.06 0l15 15a.75.75 0 1 1-1.06 1.06l-15-15a.75.75 0 0 1 0-1.06ZM17.25 16.06l2.69 2.69c.944.945 2.56.276 2.56-1.06V6.31c0-1.336-1.616-2.005-2.56-1.06l-2.69 2.69v8.12ZM15.75 7.5v8.068L4.682 4.5h8.068a3 3 0 0 1 3 3ZM1.5 16.5V7.682l11.773 11.773c-.17.03-.345.045-.523.045H4.5a3 3 0 0 1-3-3Z" />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="white"
//                         className="w-5 h-5"
//                       >
//                         <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
//                       </svg>
//                     )}
//                   </button>
//                   <div className=" relative">
//                     <button
//                       className={`${
//                         isMuted ? "bg-white" : "bg-black-faded"
//                       }  rounded-full px-2 py-2 ${isMuted ? "muted" : ""}`}
//                       title="Mute microphone"
//                       onClick={handleToggleMute}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill={isMuted ? "black" : "currentColor"}
//                         className="w-5 h-5"
//                       >
//                         <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
//                         <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
//                       </svg>
//                     </button>
//                   </div>
//                   <button
//                     className={` ${
//                       speakerOff ? "bg-white" : "bg-black-faded"
//                     }  rounded-full px-2 py-2`}
//                     title="Turn off speaker"
//                     onClick={handleSpeakerBtn}
//                   >
//                     {speakerOff ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="black"
//                         className="w-5 h-5"
//                       >
//                         <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         className="w-5 h-5"
//                       >
//                         <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
//                         <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
//                       </svg>
//                     )}
//                   </button>
//                   <button
//                     className={` bg-red-base rounded-full px-2 py-2`}
//                     title="End call"
//                     // onClick={handleSpeakerBtn}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                       className="w-5 h-5 bg-red-base"
//                     >
//                       <path
//                         fill-rule="evenodd"
//                         d="M15.22 3.22a.75.75 0 0 1 1.06 0L18 4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L19.06 6l1.72 1.72a.75.75 0 0 1-1.06 1.06L18 7.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L16.94 6l-1.72-1.72a.75.75 0 0 1 0-1.06ZM1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
//                         clip-rule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className=" absolute top-0 right-0 rounded-full sm:rounded-lg w-[100px]  sm:w-[200px]  ">
//               {true ? (
//                 <video
//                   playsInline
//                   ref={myVideo}
//                   muted
//                   autoPlay
//                   className=" h-full w-full rounded-full sm:rounded-lg border border-gray-primary"
//                 />
//               ) : null}
//             </div>
//           </div>

//           <div>
//             {receivingCall && !callAccepted ? (
//               <div>
//                 <h1>{name} is calling...</h1>
//                 <button
//                   onClick={answerCall}
//                   className=" bg-blue-medium text-white font-bold text-xs py-2 px-4"
//                 >
//                   Answer
//                 </button>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </>
//   ) : (
//     <div className=" px-2 h-screen w-screen bg-[#000000] flex justify-center items-center">
//       <div className=" mx-2 flex flex-col sm:flex-row justify-center h-full w-full  items-center">
//         <div className=" px-2 h-1/2 sm:h-full w-full sm:w-[400px] sm:max-w-xl flex items-center justify-end ">
//           <div className=" rounded-md  text-right relative">
//             {stream && (
//               <video
//                 playsInline
//                 muted
//                 ref={myVideo}
//                 autoPlay
//                 className=" h-full w-full rounded-sm   "
//                 style={{ borderRadius: "10px" }}
//               />
//             )}
//             <div className=" h-12 w-full absolute bottom-0 items-center flex flex-row justify-center my-auto bg-black-light text-white ">
//               <div className="  flex justify-center mx-auto gap-3">
//                 <button
//                   className={` ${
//                     isCameraOff ? "bg-white" : "bg-black-faded"
//                   } rounded-full px-2 py-2`}
//                   title="Turn off camera"
//                   onClick={handleToggleCameraOff}
//                 >
//                   {isCameraOff ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="black"
//                       className="w-5 h-5"
//                     >
//                       <path d="M.97 3.97a.75.75 0 0 1 1.06 0l15 15a.75.75 0 1 1-1.06 1.06l-15-15a.75.75 0 0 1 0-1.06ZM17.25 16.06l2.69 2.69c.944.945 2.56.276 2.56-1.06V6.31c0-1.336-1.616-2.005-2.56-1.06l-2.69 2.69v8.12ZM15.75 7.5v8.068L4.682 4.5h8.068a3 3 0 0 1 3 3ZM1.5 16.5V7.682l11.773 11.773c-.17.03-.345.045-.523.045H4.5a3 3 0 0 1-3-3Z" />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="white"
//                       className="w-5 h-5"
//                     >
//                       <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
//                     </svg>
//                   )}
//                 </button>
//                 <div className=" relative">
//                   <button
//                     className={`${
//                       isMuted ? "bg-white" : "bg-black-faded"
//                     }  rounded-full px-2 py-2 ${isMuted ? "muted" : ""}`}
//                     title="Mute microphone"
//                     onClick={handleToggleMute}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill={isMuted ? "black" : "currentColor"}
//                       className="w-5 h-5"
//                     >
//                       <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
//                       <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
//                     </svg>
//                   </button>
//                 </div>
//                 <button
//                   className={` ${
//                     speakerOff ? "bg-white" : "bg-black-faded"
//                   }  rounded-full px-2 py-2`}
//                   title="Turn off speaker"
//                   onClick={handleSpeakerBtn}
//                 >
//                   {speakerOff ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="black"
//                       className="w-5 h-5"
//                     >
//                       <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                       className="w-5 h-5"
//                     >
//                       <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
//                       <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="video border border-gray-primary bg-red-primary">
//             {callAccepted && !callEnded ? (
//               <video playsInline ref={userVideo} className=" w-[300px]" />
//             ) : null}
//           </div>
//         </div>
//         <div className=" mt-2 sm:mt-0 py-2 h-auto sm:h-[60%] w-full sm:w-auto rounded-md  box-border  flex flex-col px-4 bg-black-light justify-center items-center sm:min-w-60 sm:max-h-80">
//           {/*           <input
//             type="text"
//             aria-label="Name"
//             placeholder="Name"
//             id="filled-basic"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className=" mb-5"
//           />
//           {name && (
//             <button
//               className=" bg-blue-medium text-white font-bold text-xs py-2 px-4"
//               onClick={() => copyMessageToClipboard("SandeepLakhiwal")}
//             >
//               Copy Id
//             </button>
//           )}
//           <input
//             type="text"
//             aria-label="ID to call"
//             placeholder="Id to call"
//             value={idToCall}
//             onChange={(e) => setIdToCall(e.target.value)}
//           />
//           <div className="call-button">
//             {callAccepted && !callEnded ? (
//               <button onClick={leaveCall}>End Call</button>
//             ) : (
//               <button
//                 className=" bg-blue-medium text-white font-bold text-xs py-2 px-4"
//                 onClick={handleCallUser}
//               >
//                 Call User
//               </button>
//             )}
//             {idToCall}
//           </div> */}
//           <div className=" px-2 h-full w-full flex flex-col gap-3 justify-center">
//             <div className=" text-center flex justify-center">
//               <img
//                 src="/images/avatars/dali.jpg"
//                 alt="default"
//                 className=" h-14 w-14 rounded-full text-center"
//               />
//             </div>
//             <div className=" text-center">
//               <h1 className=" text-white font-bold text-center">
//                 Sandeep Lakhiwal
//               </h1>
//               <p className=" mt-[1px] text-center text-xs text-white">
//                 Ready to call?
//               </p>
//             </div>
//             <div className=" text-center">
//               <button
//                 onClick={handleCallUser}
//                 className=" text-center text-white font-bold text-xs bg-blue-medium rounded-lg px-4 py-2"
//               >
//                 Start call
//               </button>
//             </div>
//           </div>
//         </div>
//         <div>
//           {receivingCall && !callAccepted ? (
//             <div>
//               <h1>{name} is calling...</h1>
//               <button
//                 onClick={answerCall}
//                 className=" bg-blue-medium text-white font-bold text-xs py-2 px-4"
//               >
//                 Answer
//               </button>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CallPage;

// import React from "react";

function CallPage() {
  return <div>CallPage</div>;
}

export default CallPage;
