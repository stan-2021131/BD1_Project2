const backendBaseUrl = "http://localhost:3000/api";

export const api = {
    get: async (endpoint: string) => {
        const response = await fetch(`${backendBaseUrl}/${endpoint}`);
        const responseData = await response.json();

        if (!response.ok) {
            throw responseData;
        }
        return responseData;
    },

    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${backendBaseUrl}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw responseData;
        }

        return responseData;
    },

    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${backendBaseUrl}/${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw responseData;
        }

        return responseData;
    },

    delete: async (endpoint: string) => {
        const response = await fetch(`${backendBaseUrl}/${endpoint}`, {
            method: "DELETE",
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw responseData;
        }

        return responseData;
    },
};