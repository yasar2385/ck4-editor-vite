export function getClientConfig() {
    return {
        env: import.meta.env.VITE_ENV || 'local',
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        version: import.meta.env.VITE_VERSION || 'v0.0.1',
        debug: import.meta.env.VITE_DEBUG === 'true',
        userName: localStorage.getItem('username') || 'Anonymous',
    };
}
