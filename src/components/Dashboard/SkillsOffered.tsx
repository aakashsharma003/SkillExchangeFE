export default function SkillsOffered({ skills }: { skills: string[] }) {
  return (
    <section className='bg-white rounded-xl p-6 shadow'>
      <h2 className='text-xl font-semibold mb-4'>Skills Offered</h2>
      <ul className='list-disc list-inside text-gray-700 space-y-1'>
        {skills.map((skill, idx) => (
          <li key={idx}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}
