import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Asks from "../components/landingPage/asks";
import Benefits from "../components/landingPage/benefits";
import Header from "../components/landingPage/header";
import HowWorks from "../components/landingPage/howWorks";
import Principal from "../components/landingPage/principal";
import Loader from "../components/loader";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (user) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <Loader size="md"/>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Principal />
      <Benefits />
      <HowWorks />
      <Asks />
    </div>
  );
}