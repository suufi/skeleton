import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
console.log(endpoint)
export const socket = socketIOClient('https://5000-tan-bear-2oio48np.ws-us03.gitpod.io');
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});
