import { getStepContent } from '../config/stepsConfig';
import { useOnboardingStore } from '../store/onboardingStore';
import { useState, useEffect, useMemo } from 'react';
import Input from '../components/common/Input';
import Checkbox from '../components/common/Checkbox';
import Button from '../components/common/Button';
import TermsPopup from '../components/common/TermsPopup';
import { LockIcon } from '../components/common/Icons';
import { personalInfoSchema, type PersonalInfoFormData } from '../utils/validation';
import {
  formatFieldError,
  validateField,
  validateFormForSubmit,
  PASSWORD_HELPER_TEXT,
} from '../utils/personalInfoUtils';

const PersonalInfoStep = () => {
  const { accountType, personalInfo, setPersonalInfo, goToStep } = useOnboardingStore();
  const stepContent = getStepContent(2, accountType || undefined);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  const [formData, setFormData] = useState<PersonalInfoFormData>(personalInfo);

  useEffect(() => {
    setFormData(personalInfo);
  }, [personalInfo]);

  const isPasswordValid = useMemo(() => {
    return (password: string) => {
      try {
        personalInfoSchema.pick({ password: true }).parse({ password });
        return true;
      } catch {
        return false;
      }
    };
  }, []);

  const getPasswordHelperText = () => {
    if (!formData.password || formData.password.length === 0) {
      return PASSWORD_HELPER_TEXT;
    }
    if (isPasswordValid(formData.password)) {
      return '';
    }
    return PASSWORD_HELPER_TEXT;
  };

  const handleInputChange = (field: keyof PersonalInfoFormData) => (value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    const touchedFields = Object.keys(touched).filter(
      (key) => touched[key as keyof typeof touched]
    );

    touchedFields.forEach((field) => {
      const fieldName = field as keyof PersonalInfoFormData;
      const value = formData[fieldName];

      if (typeof value === 'string') {
        const error = validateField(fieldName, value);
        if (error) {
          newErrors[fieldName] = error;
        }
      } else if (typeof value === 'boolean' && touched[fieldName]) {
        if (submitAttempted && !value) {
          newErrors[fieldName] = formatFieldError(fieldName);
        } else {
          delete newErrors[fieldName];
        }
      }
    });

    setErrors(newErrors);
  }, [formData, touched, submitAttempted]);

  const validateForm = () => {
    const result = validateFormForSubmit(formData);
    setErrors(result.errors);
    return result.isValid;
  };

  const isFormValid = () => {
    const allRequiredFilled =
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password !== '' &&
      formData.termsAccepted;

    const hasErrors = Object.keys(errors).length > 0;

    return allRequiredFilled && !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (validateForm()) {
      setPersonalInfo(formData);
      goToStep(3);
    }
  };

  return (
    <div>
      <div className="mb-9">
        <h2 className="heading-2 mb-2.5">{stepContent.displayTitle}</h2>
        <p className="body-text">{stepContent.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name')(e.target.value)}
          placeholder="Enter your full name"
          error={errors.name}
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email')(e.target.value)}
          placeholder="Enter your email"
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password')(e.target.value)}
          placeholder="Create a password"
          error={errors.password}
          helperText={getPasswordHelperText()}
          required
        />

        <Checkbox
          label="I agree to"
          linkText="terms & conditions"
          linkAction="popup"
          onLinkClick={() => setShowTermsPopup(true)}
          checked={formData.termsAccepted}
          onChange={(e) => handleInputChange('termsAccepted')(e.target.checked)}
          error={errors.termsAccepted}
        />

        <Button type="submit" disabled={!isFormValid()} className="w-full">
          Register Account
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-center gap-2">
        <LockIcon className="w-4 h-4" />
        <span className="security-text">Your Info is safely secured</span>
      </div>

      <TermsPopup isOpen={showTermsPopup} onClose={() => setShowTermsPopup(false)} />
    </div>
  );
};

export default PersonalInfoStep;
