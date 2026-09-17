import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ModeProvider } from './lib/mode';
import Shell from './components/Shell';

import Landing from './pages/Landing';
import Access from './pages/Access';
import CommandCenter from './pages/CommandCenter';
import SurveillanceMap from './pages/SurveillanceMap';
import DiseaseIntelligence from './pages/DiseaseIntelligence';
import SignalEngine from './pages/SignalEngine';
import AlertCenter from './pages/AlertCenter';
import XAI from './pages/XAI';
import MLLab from './pages/MLLab';
import ModelEvaluation from './pages/ModelEvaluation';
import ModelCards from './pages/ModelCards';
import Genomic from './pages/Genomic';
import BioSignals from './pages/BioSignals';
import Environmental from './pages/Environmental';
import Events from './pages/Events';
import Africa from './pages/Africa';
import Connectors from './pages/Connectors';
import DataQuality from './pages/DataQuality';
import Workspace from './pages/Workspace';
import Experiments from './pages/Experiments';
import Decisions from './pages/Decisions';
import Architecture from './pages/Architecture';
import Health from './pages/Health';
import Responsible from './pages/Responsible';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/access" element={<Access />} />
          <Route path="/app" element={<Shell />}>
            <Route index element={<CommandCenter />} />
            <Route path="map" element={<SurveillanceMap />} />
            <Route path="disease" element={<DiseaseIntelligence />} />
            <Route path="signals" element={<SignalEngine />} />
            <Route path="alerts" element={<AlertCenter />} />
            <Route path="xai" element={<XAI />} />
            <Route path="ml-lab" element={<MLLab />} />
            <Route path="evaluation" element={<ModelEvaluation />} />
            <Route path="model-cards" element={<ModelCards />} />
            <Route path="genomic" element={<Genomic />} />
            <Route path="biosignals" element={<BioSignals />} />
            <Route path="environmental" element={<Environmental />} />
            <Route path="events" element={<Events />} />
            <Route path="africa" element={<Africa />} />
            <Route path="connectors" element={<Connectors />} />
            <Route path="quality" element={<DataQuality />} />
            <Route path="workspace" element={<Workspace />} />
            <Route path="experiments" element={<Experiments />} />
            <Route path="decisions" element={<Decisions />} />
            <Route path="architecture" element={<Architecture />} />
            <Route path="health" element={<Health />} />
            <Route path="responsible" element={<Responsible />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ModeProvider>
  );
}
