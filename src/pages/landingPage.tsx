import Asks from "../components/landingPage/asks";
import Benefits from "../components/landingPage/benefits";
import Header from "../components/landingPage/header";
import HowWorks from "../components/landingPage/howWorks";
import Plans from "../components/landingPage/plans";
import Principal from "../components/landingPage/principal";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <Principal />
      <Benefits />
      <HowWorks />
      <Asks />
      <Plans />
    </div>
  );
}
