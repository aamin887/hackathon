import { useState } from "react";
import { Home, Library, Heart, User, Leaf } from "lucide-react";
import { AnimatePresence } from "motion/react";

import HomePage from "./components/HomePage";
import CopingPage from "./components/CopingPage";
import ResourcesPage from "./components/ResourcesPage";
// import ProfilePage from "./components/ProfilePage";

import { Haptics } from "./lib/haptics";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      Haptics.light();
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage key="home" />;
      case "coping":
        return <CopingPage key="coping" />;
      case "resources":
        return <ResourcesPage key="resources" />;
      // case "profile":
      // return <ProfilePage key="profile" />;
      default:
        return <HomePage key="home" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-primary font-headline tracking-tight">
            Name of the App
          </h1>
        </div>

        <button
          onClick={() => Haptics.warning()}
          className="bg-error-container text-on-error-container px-5 py-2 rounded-xl font-headline font-bold text-sm tracking-wide active:scale-95 transition-transform"
        >
          CRISIS
        </button>
      </header>

      {/* Page Content */}
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-xl rounded-t-[2rem] shadow-[0_-4px_24px_rgba(45,52,50,0.06)]">
        <NavItem
          icon={<Home className="w-6 h-6" />}
          label="Home"
          active={activeTab === "home"}
          onClick={() => handleTabChange("home")}
        />

        <NavItem
          icon={<Library className="w-6 h-6" />}
          label="Resources"
          active={activeTab === "resources"}
          onClick={() => handleTabChange("resources")}
        />

        <NavItem
          icon={<Heart className="w-6 h-6" />}
          label="Coping"
          active={activeTab === "coping"}
          onClick={() => handleTabChange("coping")}
        />

        {/* <NavItem
          icon={<User className="w-6 h-6" />}
          label="Profile"
          active={activeTab === "profile"}
          onClick={() => handleTabChange("profile")}
        /> */}
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 transition-all active:scale-90 ${
        active
          ? "bg-primary-container text-primary"
          : "text-on-surface/50 hover:text-on-surface/80"
      }`}
    >
      {icon}
      <span className="font-headline text-[10px] font-medium tracking-wide mt-1">
        {label}
      </span>
    </button>
  );
}
