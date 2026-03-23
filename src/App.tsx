import { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// Layout Components
import { ErrorFallback } from '@/components/layout/ErrorFallback';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// UI Components
import Button from '@/components/common/Button.tsx';
import Input from '@/components/common/Input.tsx';
import Dropdown from '@/components/common/Dropdown.tsx';
import Checkbox from '@/components/common/Checkbox.tsx';
import Popup from '@/components/common/Popup.tsx';

// Demo component for better organization
const DemoContent = ({
  selectedValue,
  setSelectedValue,
  setIsPopupOpen,
}: {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  setIsPopupOpen: (open: boolean) => void;
}) => (
  <div className="page-wrapper">
    <h1 className="heading-2">Signup Flow</h1>
    <Button>Button</Button>
    <Button variant="secondary">Button</Button>
    <Input label="Email Address" placeholder="Enter your email" type="email" required />
    <Input label="Password" type="password" placeholder="Enter your password" required />
    <Dropdown
      label="Select an option"
      placeholder="Choose..."
      options={[
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ]}
      value={selectedValue}
      onChange={setSelectedValue}
      required
    />
    <Checkbox
      label="I agree to the"
      linkText="Terms"
      linkUrl="/terms"
      linkAction="popup"
      onLinkClick={() => {
        setIsPopupOpen(true);
      }}
    />
  </div>
);

// Terms popup content
const TermsPopup = ({ onClose }: { onClose: () => void }) => (
  <Popup isOpen={true} onClose={onClose}>
    <h2 id="popup-title" className="heading-2 mb-4">
      Terms and Conditions
    </h2>
    <p className="body-text mb-6">
      This is the popup content for the Terms and Conditions. You can add your terms here.
    </p>
  </Popup>
);

function App() {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                <DemoContent
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  setIsPopupOpen={setIsPopupOpen}
                />
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>

      {isPopupOpen && <TermsPopup onClose={() => setIsPopupOpen(false)} />}
    </ErrorBoundary>
  );
}

export default App;
