import { io } from 'socket.io-client';
import { getHostnameAndPort } from './utils';

// "undefined" means the URL will be computed from the `window.location` object
const URL = `http://${getHostnameAndPort()}/mobile/send_mobile_data`;

export const socket = io(URL, {
    autoConnect: false
});