export async function checkAuth() {
    try {
        const response = await fetch('/auth/check', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Non authentifié');
        const data = await response.json();

        if (!data.isAuthenticated) throw new Error('Non authentifié');
        return data.user;
    } catch (error) {
        window.location.href = '/login';
    }
}
