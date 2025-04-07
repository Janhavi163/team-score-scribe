
import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-7xl mx-auto py-8 px-4">
        {children}
      </main>
      <footer className="bg-muted py-4 text-center text-sm text-muted-foreground">
        <div className="container max-w-7xl mx-auto">
          IPD Team Evaluation System &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
