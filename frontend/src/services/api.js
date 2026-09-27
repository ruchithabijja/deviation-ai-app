import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/deviations";


export const analyzeDeviation = async ({
    text,
    file
}) => {

    const formData = new FormData();

    if (file) {
        formData.append("file", file);
    } else {
        formData.append("text", text);
    }

    const response = await axios.post(
        `${API_URL}/analyze`,
        formData
    );

    return response.data;
};


export const saveDeviation = async (data) => {

    const response = await axios.post(
        `${API_URL}/`,
        data
    );

    return response.data;
};