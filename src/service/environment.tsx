"use server"

export async function Environment() {
    return {
        SERVER: process.env.SERVER,
        WS_SERVER: process.env.WS_SERVER
    }
}