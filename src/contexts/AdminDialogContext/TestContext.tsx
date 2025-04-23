"use client";
import { createContext, useState, type ReactNode } from "react";

interface TestContextType {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

export const TestContext = createContext<TestContextType | null>(null);

export function TestProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState(0);
  return (
    <TestContext.Provider value={{ value, setValue }}>
      {children}
    </TestContext.Provider>
  );
}
