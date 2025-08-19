import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SkillCard({ icon, title, description }: any) {
  return (
    <Card className='group relative cursor-pointer border-white/20 bg-white/5 text-white backdrop-blur-xl transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.45)] [transform:perspective(1000px)_rotateX(2deg)] hover:[transform:perspective(1000px)_rotateX(0.5deg)]'>
      <CardHeader>
        <CardTitle className='flex items-center gap-3'>
          <img src={icon} alt='' className='h-8 w-8 drop-shadow' />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='text-white/80'>{description}</CardContent>
    </Card>
  );
}
