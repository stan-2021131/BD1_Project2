const backendBaseUrl = "http://localhost:3000/api";

export const api = {
    get: async (endpoint: string) => {
        try {
            const response = await fetch(`${backendBaseUrl}/${endpoint}`);
            const responseData = await response.json();

            if (!response.ok) {
                throw responseData;
            }
            return responseData;
        } catch (error) {
            api.handleError(error);
        }
    },
    post: async (endpoint: string, data: any) => {
        try {
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
        } catch (error) {
            api.handleError(error);
        }
    },
    put: async (endpoint: string, data: any) => {
        try {
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
        } catch (error) {
            api.handleError(error);
        }
    },
    delete: async (endpoint: string) => {
        try {
            const response = await fetch(`${backendBaseUrl}/${endpoint}`, {
                method: "DELETE"
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw responseData;
            }

            return responseData;
        } catch (error) {
            api.handleError(error);
        }
    },
    handleError: (error: any) => {
        console.log(error);
    },
}