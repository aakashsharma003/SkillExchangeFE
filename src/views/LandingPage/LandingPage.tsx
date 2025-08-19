import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import appRoutes from '@/routes/appRoutes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('logged_in_once', 'true');
  }, []);

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Top Nav */}
      <header className='border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-2'>
            <div className='grid size-8 place-items-center rounded-md bg-primary/10 text-sm font-bold text-primary'>SE</div>
            <span className='text-sm font-semibold tracking-tight'>SkillExchange</span>
          </div>
          <nav className='hidden items-center gap-6 md:flex'>
            <button className='text-sm text-muted-foreground hover:text-foreground'>Features</button>
            <button className='text-sm text-muted-foreground hover:text-foreground'>How it works</button>
            <button className='text-sm text-muted-foreground hover:text-foreground'>Community</button>
            <button className='text-sm text-muted-foreground hover:text-foreground'>Pricing</button>
          </nav>
          <div className='flex items-center gap-3'>
            <Button variant='secondary' onClick={() => navigate(appRoutes.login)}>Log in</Button>
            <Button onClick={() => navigate(appRoutes.signup)}>Get started</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className='relative'>
        <div className='pointer-events-none absolute inset-0 -z-10'>
          <div className='absolute left-1/2 top-[-6rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl'></div>
          <div className='absolute left-[20%] top-[8rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl'></div>
        </div>
        <div className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24'>
          <div>
            <Badge className='mb-3'>Exchange skills, not just messages</Badge>
            <h1 className='text-balance text-4xl font-extrabold tracking-tight md:text-6xl'>
              Learn faster. Teach better. Grow together.
            </h1>
            <p className='mt-4 max-w-prose text-pretty text-muted-foreground'>
              Match with peers for 1:1 exchanges, chat in real-time, and track progress with verified milestones.
            </p>
            <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
              <Button size='lg' onClick={() => navigate(appRoutes.signup)}>Create your account</Button>
              <Button size='lg' variant='outline'>Explore skills</Button>
            </div>
            <p className='mt-3 text-xs text-muted-foreground'>No credit card required</p>
          </div>

          <div className='relative'>
            <div className='absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 to-emerald-400/10 blur-2xl'></div>
            <Card className='overflow-hidden'>
              <CardHeader>
                <CardTitle className='text-base'>What you can do</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <Feature title='Smart matching' desc='Find partners who want to learn what you teach—and vice versa.' />
                  <Feature title='Real-time chat' desc='WebSocket-powered messaging for seamless conversations.' />
                  <Feature title='Skill tracking' desc='Set goals, log sessions, and earn verifiable badges.' />
                  <Feature title='Community' desc='Join topic spaces and discover exchange opportunities.' />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Secondary Section */}
      <section className='mx-auto w-full max-w-7xl px-6 pb-16'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Stat label='Learners and mentors' value='10k+' />
          <Stat label='Exchanges completed' value='120k+' />
          <Stat label='Skills available' value='800+' />
        </div>
      </section>

      {/* CTA */}
      <section className='mx-auto w-full max-w-7xl px-6 pb-16'>
        <Card className='overflow-hidden'>
          <div className='grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-2'>
            <div>
              <h2 className='text-2xl font-semibold tracking-tight'>Ready to start your first exchange?</h2>
              <p className='mt-2 text-sm text-muted-foreground'>Create your profile and get matched in minutes.</p>
            </div>
            <div className='flex gap-3 md:justify-end'>
              <Button variant='outline' onClick={() => navigate(appRoutes.login)}>Log in</Button>
              <Button onClick={() => navigate(appRoutes.signup)}>Get started</Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className='border-t bg-card/60 py-8 text-center text-xs text-muted-foreground'>
        © {new Date().getFullYear()} SkillExchange. All rights reserved.
      </footer>
    </div>
  );
};

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <div className='text-sm font-semibold'>{title}</div>
      <div className='mt-1 text-xs text-muted-foreground'>{desc}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className='p-5'>
        <div className='text-2xl font-bold'>{value}</div>
        <div className='text-xs text-muted-foreground'>{label}</div>
      </CardContent>
    </Card>
  );
}

export default LandingPage;
