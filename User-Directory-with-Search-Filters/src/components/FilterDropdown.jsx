export default function FilterDropdown({value, onChange, options}){
    return(
        <select value={value} onChange={e => onChange(e.target.value)} style={{padding: 8, marginBottom: 10}}>
            <option value="">All Cities</option>
            {options.map(city => (
                <option key={city} value={city}>{city}</option>
            ))}
        </select>
    );
}