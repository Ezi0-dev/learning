const API_URL = "http://localhost:3000"

const api = {
    async request(endpoint, options = {}) {

        const config = {
            ...options,
            credentials: 'include',
            headers: { "Content-Type": "application/json", ...options.headers }
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            console.log(response)
            const data = await response.json();


            console.log(data)
            return data;

        } catch (err) {
            console.error(err);
        }
    },

    async login(username, password) {

        const response = await this.request("/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });

        return response;
    },

    async me() {

        const response = await this.request("/me", {
            method: "GET"
        })

        return response;
    }
};

export default api;