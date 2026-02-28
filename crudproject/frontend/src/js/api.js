const API_URL = "http://localhost:3000"


class API {
    constructor() {
        this.baseURL = API_URL
        this.token = null
        this.isRefreshing = false
        this.requestQueue = []
        this.onTokenRefresh = null
    }

    setToken(token) {
        this.token = token
    }

    enqueue() {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ resolve, reject })
        })
    }

    flushQueue(error = null) {
        this.requestQueue.forEach(({ resolve, reject}) => {
            error ? reject(error) : resolve()
        })
        this.requestQueue = []
    }

    async tryRefreshToken() {
        const data = await this.refresh()
        this.setToken(data.accessToken)

        if (this.onTokenRefresh) {
            this.onTokenRefresh(data.accessToken, data.user)
        }
    }

    // Core request

    async request(method, endpoint, body = null) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                ...(body && { 'Content-Type': 'application/json' })
            },
            ...(body && { body: JSON.stringify(body) })
        })

        if (response.status === 401) {
            return this.handleUnauthorized(method, endpoint, body)
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }

    async handleUnauthorized(method, endpoint, body) {
        console.log('401 on endpoint:', endpoint)  // ← what endpoint is hitting 401?
        console.log('current token:', this.token)   // ← is token null or expired?

        if (endpoint === '/refresh') {
            window.location.href = '/login'
            return
        }

        if (this.isRefreshing) {
            await this.enqueue()
            return this.request(method, endpoint, body)
        }

        this.isRefreshing = true

        try {
            await this.tryRefreshToken()
            this.flushQueue()
            console.log('token refreshed, retrying:', endpoint) // ← does this log?
            console.log('current token:', this.token)   // ← is token null or expired?
            return this.request(method, endpoint, body)
        } catch (err) {
            this.flushQueue(err)
            window.location.href = '/login'
            throw err
        } finally {
            this.isRefreshing = false
        }
    }

    // Methods

    get(endpoint)          { return this.request('GET', endpoint) }
    post(endpoint, body)   { return this.request('POST', endpoint, body) }
    put(endpoint, body)    { return this.request('PUT', endpoint, body) }
    delete(endpoint)       { return this.request('DELETE', endpoint) }

    async refresh() {
        const response = await fetch(`${this.baseURL}/refresh`, {
            method: 'POST',
            credentials: 'include'
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    }
}

export default new API;