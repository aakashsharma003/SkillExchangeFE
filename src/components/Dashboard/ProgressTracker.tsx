export default function ProgressTracker({ learningProgress }: { learningProgress: Record<string, number> }) {
  const entries = Object.entries(learningProgress ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className='bg-white p-6 rounded shadow'>
      <h2 className='text-xl font-semibold mb-4'>Skill-Learning Progress</h2>
      {entries.length === 0 ? (
        <p className='text-gray-600'>No learning progress yet.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([skill, value]) => (
            <div key={skill}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{skill}</span>
                <span className="text-gray-500">{Math.round(value)}%</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className='bg-blue-500 h-3 rounded-full'
                  style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
