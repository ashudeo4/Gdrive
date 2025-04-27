import { atom } from "recoil"

export const isAuthenticatedState = atom({
    key: "isAuthenticate",
    default: false
})

export const userInfo = atom({
    key: "userInfo",
    default: {
        name: "",
        email: ""
    }
})