import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { LandingNavbar } from '../components/Landing/LandingNavbar';
import { HeroSection } from '../components/Landing/HeroSection';
import { ProductOverview } from '../components/Landing/ProductOverview';
import { HowItWorks } from '../components/Landing/HowItWorks';
import { CapabilitiesSection } from '../components/Landing/CapabilitiesSection';
import { ProductShowcase } from '../components/Landing/ProductShowcase';
import { ImageAnalysisSection } from '../components/Landing/ImageAnalysisSection';
import { VideoInspectionSection } from '../components/Landing/VideoInspectionSection';
import { MeasurementSection } from '../components/Landing/MeasurementSection';
import { RecommendationSection } from '../components/Landing/RecommendationSection';
import { EvaluationSection } from '../components/Landing/EvaluationSection';
import { DatasetSection } from '../components/Landing/DatasetSection';
import { TechnologySection } from '../components/Landing/TechnologySection';
import { UseCasesSection } from '../components/Landing/UseCasesSection';
import { FinalCTA } from '../components/Landing/FinalCTA';
import { LandingFooter } from '../components/Landing/LandingFooter';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI-PAVE — AI-Based Pavement Inspection & Severity Assessment System';
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        scrollBehavior: 'smooth',
      }}
    >
      {/* 1. Sticky Navigation */}
      <LandingNavbar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Product Introduction & 6-Step Workflow */}
      <ProductOverview />

      {/* 4. Technical Pipeline: How AI-PAVE Works */}
      <HowItWorks />

      {/* 5. Core Capabilities */}
      <CapabilitiesSection />

      {/* 6. Product Showcase & Hotspots */}
      <ProductShowcase />

      {/* 7. Image Analysis In-Depth */}
      <ImageAnalysisSection />

      {/* 8. Video Inspection & Temporal Tracking */}
      <VideoInspectionSection />

      {/* 9. Measurement & Depth Metrology */}
      <MeasurementSection />

      {/* 10. Severity & Maintenance Recommendations */}
      <RecommendationSection />

      {/* 11. Model Evaluation & Benchmark Rigor */}
      <EvaluationSection />

      {/* 12. Dataset Provenance (RDD2022) */}
      <DatasetSection />

      {/* 13. System Architecture & Tech Stack */}
      <TechnologySection />

      {/* 14. Operational Use Cases */}
      <UseCasesSection />

      {/* 15. Final Call-to-Action */}
      <FinalCTA />

      {/* 16. Professional Multi-Column Footer */}
      <LandingFooter />
    </Box>
  );
};

export default LandingPage;
