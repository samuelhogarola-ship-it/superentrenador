import { Route } from "react-router-dom";
import { LandingPage } from "../marketplace/pages/LandingPage";
import { TrainerProfilePage } from "../marketplace/pages/TrainerProfilePage";

export function MarketplaceRoutes() {
  return (
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/trainers/:slug" element={<TrainerProfilePage />} />
    </>
  );
}
