import { getHostnameAndPort } from '@/lib/utils';
import { fetch } from '@tauri-apps/plugin-http';
const post_to_server = async (json_data: any) => {
    const url = `http://${getHostnameAndPort()}/mobile/send_mobile_data`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(json_data),

        });

        if (response.status !== 200) {
            throw new Error('Login failed');
        }
        console.log("Server responded:", response);
        return response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export default post_to_server;