'use client';

import { ProgressProvider as BProgressProvider } from '@bprogress/next/app';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <BProgressProvider
      height="2px"
      color="#00a3ff"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </BProgressProvider>
  );
}