import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]); // State to hold favorite games
    const [newGame, setNewGame] = useState(''); // State to hold new game name
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Move token definition here
        if (!token) {
            router.push('/login'); // Redirect to login if no token
            return;
        }

        const fetchUserInfo = async () => {
            const response = await fetch('http://localhost:3000/auth/dashboard', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user); // Set user information
                fetchFavoriteGames(token); // Pass token to fetchFavoriteGames
            } else {
                setError(data.error);
                router.push('/login'); // Redirect to login if unauthorized
            }
        };

        const fetchFavoriteGames = async (token) => { // Accept token as parameter
            const response = await fetch('http://localhost:3000/auth/games', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                setGames(data.games); // Set favorite games
            } else {
                console.error(data.error);
            }
        };

        fetchUserInfo(); // Fetch user info on component mount
    }, [router]);

    const handleAddGame = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/auth/games', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newGame }), // Send the new game name
        });

        const data = await response.json();
        if (response.ok) {
            setGames([...games, data.game]); // Add the new game to the state
            setNewGame(''); // Clear the input
        } else {
            setError(data.error);
        }
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <div>
                    <p>User ID: {user.id}</p>
                    <p>Email: {user.email}</p>
                    <h2>Your Favorite Games</h2>
                    <ul>
                        {games.map((game) => (
                            <li key={game.id}>{game.name}</li>
                        ))}
                    </ul>
                    <form onSubmit={handleAddGame}>
                        <input
                            type="text"
                            placeholder="Add your favorite game"
                            value={newGame}
                            onChange={(e) => setNewGame(e.target.value)}
                        />
                        <button type="submit">Add Game</button>
                    </form>
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default Dashboard;
