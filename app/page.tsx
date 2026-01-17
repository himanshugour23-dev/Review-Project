import Navbar from '@/components/Navbar';
import NetworkWarningPopup from '@/components/NetworkWarningPopup';
import FeatureOverview from '@/homeComponents/FeatureOverview';
import HomePage from '@/homeComponents/HomePage';

export default function MainPage() {
  return (
    <div>
      <NetworkWarningPopup />
      <HomePage />
      <FeatureOverview />
    </div>
  );
}