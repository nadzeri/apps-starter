'use client';

import { AppProgressProvider as Provider } from '@bprogress/next';

const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider
      height="4px"
      color="#000"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </Provider>
  );
};

export default ProgressProvider;
