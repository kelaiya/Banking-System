import {useState, useEffect} from "react";

export default function useUsers(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("https://jsonplaceholder.typicode.com/users");
                if(!res.ok) throw new Error("Network error");
                const data = await res.json();
                setUsers(data);
            } catch (err){
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);
    return {users, loading, error}; 
}