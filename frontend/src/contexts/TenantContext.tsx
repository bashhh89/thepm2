import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TenantContextProps {
  tenantId: string | null;
  setTenantId: (tenantId: string | null) => void;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenantId, setTenantId] = useState<string | null>(null);

  return (
    <TenantContext.Provider value={{ tenantId, setTenantId }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};