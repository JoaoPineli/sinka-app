import axios from "axios";

const apiURI = import.meta.env.VITE_API_URI;

const get = async function(resource: string, params: string[] = []) {
    return await axios.get(`${apiURI}/${resource}`, {params});
}

const post = async function(resource: string, data = {}) {
    return await axios.post(`${apiURI}/${resource}`, data);
}

const put = async function(resource: string, data = {}) {
    return await axios.put(`${apiURI}/${resource}`, data);
}

const del = async function(resource: string) {
    return await axios.delete(`${apiURI}/${resource}`);
}

export { get, post, put, del };