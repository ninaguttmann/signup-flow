import React from 'react';
import Button from './Button';
import Popup from './Popup';

interface TermsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsPopup: React.FC<TermsPopupProps> = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-4">
        <h2 className="heading-2-5 pb-4 text-center">Terms & Conditions</h2>

        <div className="max-h-96 space-y-4 overflow-y-auto border-t pt-4" role="document">
          <section>
            <h3 className="heading-3 mb-2" id="terms-1">
              1. Acceptance of Terms
            </h3>
            <p className="text-caption text-text-secondary">
              By accessing and using this service, you accept and agree to be bound by the terms and
              provision of this agreement. These terms and conditions govern your use of our Service
              and constitute a legally binding agreement between you and our company.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-2">
              2. Privacy Policy
            </h3>
            <p className="text-caption text-text-secondary">
              Your use of this Service is also governed by our Privacy Policy. Please review our
              Privacy Policy, which also governs the Site and informs users of our data collection
              practices. By using this Service, you consent to the collection and use of information
              in accordance with our privacy policy.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-3">
              3. User Account
            </h3>
            <p className="text-caption text-text-secondary">
              You are responsible for maintaining the confidentiality of your account and password
              and for restricting access to your computer, and you agree to accept responsibility
              for all activities that occur under your account or password. You must notify us
              immediately upon becoming aware of any breach of security or unauthorized use of your
              account.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-4">
              4. User Conduct
            </h3>
            <p className="text-caption text-text-secondary">
              You agree not to use the Service for any unlawful or prohibited purpose, or in any way
              which could damage, disable, overburden, or impair the Service. You may not attempt to
              gain unauthorized access to any portion of the Service, other accounts, computer
              systems, or networks connected to the Service.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-5">
              5. Intellectual Property
            </h3>
            <p className="text-caption text-text-secondary">
              The Service and its original content, features and functionality are and will remain
              the exclusive property of the Service and its licensors. The Service is protected by
              copyright, trademark, and other laws of both foreign and domestic countries.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-6">
              6. Termination
            </h3>
            <p className="text-caption text-text-secondary">
              We may terminate or suspend your account and bar access to the Service immediately,
              without prior notice or liability, under our sole discretion, for any reason
              whatsoever and without limitation.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-7">
              7. Limitation of Liability
            </h3>
            <p className="text-caption text-text-secondary">
              In no event shall our company, nor its directors, employees, partners, agents,
              suppliers, or affiliates, be liable for any indirect, incidental, special,
              consequential, or punitive damages, including loss of profits, data, use, or other
              intangible losses.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-8">
              8. Governing Law
            </h3>
            <p className="text-caption text-text-secondary">
              These terms shall be interpreted and governed by the laws of the jurisdiction in which
              our company operates, without regard to its conflict of law provisions. Any disputes
              arising from these terms will be resolved in the appropriate courts of that
              jurisdiction.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-9">
              9. Changes to Terms
            </h3>
            <p className="text-caption text-text-secondary">
              We reserve the right, at our sole discretion, to modify or replace these Terms of
              Service at any time. If a revision is material, we will provide at least 30 days
              notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h3 className="heading-3 mb-2" id="terms-10">
              10. Contact Information
            </h3>
            <p className="text-caption text-text-secondary">
              If you have any questions about these Terms and Conditions, you can contact us at
              legal@company.com or by mail at our corporate headquarters.
            </p>
          </section>
        </div>

        <div className="flex justify-center border-t pt-4">
          <Button
            onClick={handleClose}
            className="max-w-xs"
            aria-label="Close terms and conditions popup"
          >
            Close
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default TermsPopup;
