import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ProblemGoals from "./components/ProblemGoals";
import Architecture from "./components/Architecture";
import Algorithm from "./components/Algorithm";
import LiveMap from "./components/LiveMap";
import DataModels from "./components/DataModels";
import Infra from "./components/Infra";
import Roadmap from "./components/Roadmap";
import Metrics from "./components/Metrics";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemGoals />
        <Architecture />
        <Algorithm />
        <LiveMap />
        <DataModels />
        <Infra />
        <Roadmap />
        <Metrics />
      </main>
      <Footer />
    </>
  );
}

export default App;
