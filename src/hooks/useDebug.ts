import { useAppSelector } from 'app/hooks';

const useDebug = (componentName: string, ...args: string[]): void => {
  const isDebug = useAppSelector((state) => state.app.debug === true);

  if (isDebug) {
    console.log.apply(console, [componentName, ...args]);
  }
};

export default useDebug;
