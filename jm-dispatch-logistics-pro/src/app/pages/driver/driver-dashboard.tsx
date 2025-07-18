const [suggestedLoads, setSuggestedLoads] = useState([]);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  fetch(`/api/suggest-loads?email=${user.email}`)
    .then((res) => res.json())
    .then(setSuggestedLoads);
}, []);

...

<h2 className="text-xl font-bold mt-6 mb-2">🚀 Loads recommandés pour vous</h2>
<ul>
  {suggestedLoads.map((l) => (
    <li key={l.id} className="mb-3 border p-3 rounded">
      {l.origin} → {l.destination} (${l.price})  
      <button className="ml-4 px-3 py-1 bg-green-600 text-white rounded">Accepter</button>
    </li>
  ))}
</ul>
function calculateScore({ loads_completed, rating_avg, on_time_pct, acceptance_pct }) {
  return (
    loads_completed * 0.4 +
    rating_avg * 20 * 0.3 +
    on_time_pct * 0.2 +
    acceptance_pct * 0.1
  );
}
