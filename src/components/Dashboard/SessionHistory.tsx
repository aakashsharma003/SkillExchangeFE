export default function SessionHistory() {
  const sessions = [
    'SkillExchange with Alice Smith - Graphic Design (Completed)',
    'SkillExchange with Bob Johnson - Web Development (In Progress)',
    'SkillExchange with Charlie Brown - Photography (Completed)',
  ];

  return (
    <div className='bg-white p-6 rounded shadow'>
      <h2 className='text-xl font-semibold mb-4'>Session History</h2>
      <ul className='list-disc list-inside text-gray-700 space-y-1'>
        {sessions.map((session, idx) => (
          <li key={idx}>{session}</li>
        ))}
      </ul>
    </div>
  );
}
