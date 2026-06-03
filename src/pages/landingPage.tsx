import Asks from "../components/landingPage/asks";
import Benefits from "../components/landingPage/benefits";
import Header from "../components/landingPage/header";
import HowWorks from "../components/landingPage/howWorks";
import Principal from "../components/landingPage/principal";

export default function LandingPage() {
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
