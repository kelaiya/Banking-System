import {memo} from "react";

const UserList = memo(function UserList({users}){
    if(!users.length) return <p>No users found.</p>;

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    {user.name} - {user.address.city}
                </li>
            ))}
        </ul>
    );
});

export default UserList;