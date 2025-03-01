// filepath: e:\nexus-suite\frontend\src\components\SuspenseWrapper.tsx
import { type ReactNode, Suspense } from "react";

export const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
      {children}
    </Suspense>
  );
};