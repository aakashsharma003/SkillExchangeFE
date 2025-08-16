import { skillsConfig } from '@/api/skills';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Config = { skills: string[] };

type ConfigContextType = { config: Config; loading: boolean };

const ConfigContext = createContext<ConfigContextType>({
  config: { skills: [] },
  loading: true,
});

export const useConfig = () => useContext(ConfigContext);

const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Config>({ skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const res = await skillsConfig();

        if (res.success === true) setConfig({ skills: res.data });
      } catch (err) {
        console.error('Failed to fetch config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
