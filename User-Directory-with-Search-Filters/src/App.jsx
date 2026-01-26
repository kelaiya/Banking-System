import {useState, useMemo} from "react";
import useUsers from "./hooks/useUsers";
import SearchInput from "./components/SearchInput";
import FilterDropdown from "./components/FilterDropdown";
import UserList from "./components/UserList";
import Status from "./components/Status";
import "./index.css";

export default function App(){
    const {users, loading, error} = useUsers();
    const [ search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const filteredUsers = useMemo(() => {
        let result = users.filter(u => {
            if(!search) return true;
            const matchesName = u.name.toLowerCase().includes(search.toLowerCase());
            const matchesCity = city ? u.address.city == city : true
            return matchesName && matchesCity
        });
        result = [...result].sort((a, b) => {
            if (sortOrder === "asc") {
            return a.name.localeCompare(b.name);
            }
            return b.name.localeCompare(a.name);
        });
        return result;
    }, [users, search, city, sortOrder]);

    const cityOptions = useMemo(() => {
        const cities = users.map(u => u.address.city);
        return [...new Set(cities)];
    }, [users]);

    return (
        <div className="container">
            <aside className="sidebar">
                <SearchInput value={search} onChange={setSearch} />
                <FilterDropdown value={city} onChange={setCity} options={cityOptions} />
            </aside>

            <main className="content">
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="asc">Name A-Z</option>
                    <option value="desc">Name Z-A</option>
                </select>
                <Status loading={loading} error={error} />
                <UserList users={filteredUsers} />
            </main>
        </div>
    );
}