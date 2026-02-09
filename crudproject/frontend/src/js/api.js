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
            method: 'GET',
            credentials: 'include'
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }

    async post(endpoint, body) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(body)
        })

        console.log("this is body : ", body)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }

}

export default new API;