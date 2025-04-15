import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getTimeBetter() {
    const now = new Date();
    return now.toISOString(); // Formats as YYYY-MM-DDTHH:mm:ss.sssZ
}

export function log(msg: string) {
    return `[${getTimeBetter().slice(11, -1)}]`.concat(" ", msg);
}

export function getHostnameAndPort() {
    return "42.114.88.18:32400";
}