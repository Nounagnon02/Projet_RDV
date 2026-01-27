import Sidebar from './Sidebar';
import { DarkModeToggle } from '../ui';

const MemberLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* Header/Top Bar (Optional, can just be a padding or a search bar) */}
                <header className="h-16 flex items-center justify-end px-8 gap-4">
                    <DarkModeToggle />
                    {/* User profile small avatar can go here */}
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MemberLayout;
