export default function SearchInput({ value, onChange}) {
    return (
        <input 
        type="text"
        placeholder="Search by name"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{padding: 8, width: "100%", marginBottom: 10}}
        />
    );    
}