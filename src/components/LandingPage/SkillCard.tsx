export default function SkillCard({ icon, title, description }: any) {
  return (
    <div className='skill-card cursor-pointer'>
      <img src={icon} alt='Certification' className='skill-icon' />
      <h3 className='text-xl font-semibold mt-6 mb-2'>{title}</h3>
      <p className='text-gray-600 text-sm px-2'>{description} </p>
    </div>
  );
}
