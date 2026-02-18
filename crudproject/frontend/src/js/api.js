const API_URL = "http://localhost:3000"


class API {
    constructor() {
        this.baseURL = API_URL
        this.token = null
    }

    setToken(token) {
        this.token = token
    }

    async get(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Authorization': `Bearer ${this.token}` }
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }

    // Ugly fix imo, can def improve
    async refresh() {
        const response = await fetch(`${this.baseURL}/refresh`, {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }

    async post(endpoint, body) {
        const options = {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Authorization': `Bearer ${this.token}`
            }
        };

        if (body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, options);

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }

    async put(endpoint, body) {
        const options = {
            method: 'PUT',
            credentials: 'include',
            headers: { 
                'Authorization': `Bearer ${this.token}`
            }
        };

        if (body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, options);

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }

    async delete(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 
                'Authorization': `Bearer ${this.token}`
            },
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }

}

export default new API;