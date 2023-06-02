import type { SessionConfig } from 'h3';

export const getServerSessionConfig = () => useRuntimeConfig().auth as SessionConfig;
