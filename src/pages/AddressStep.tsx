import { getStepContent } from '../config/stepsConfig';
import { useOnboardingStore } from '../store/onboardingStore';
import { useState, useEffect, useMemo } from 'react';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import Button from '../components/common/Button';
import { LockIcon } from '../components/common/Icons';
import { type ResidencyInfoFormData } from '../utils/validation';
import {
  validateResidencyField,
  validateResidencyFormForSubmit,
  formatAddressFieldError,
} from '../utils/addressUtils';

const mutableCountryOptions: Array<{value: string; label: string}> = [
  { value: 'SI', label: 'Slovenia' },
  { value: 'US', label: 'USA' },
  { value: 'EN', label: 'England' },
];

const AddressStep = () => {
  const { accountType, residencyInfo, setResidencyInfo, goToStep } = useOnboardingStore();
  const stepContent = getStepContent(3, accountType || undefined);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [userEdits, setUserEdits] = useState<Partial<ResidencyInfoFormData>>({});

  const formData = useMemo(
    () => ({
      address: userEdits.address ?? residencyInfo.address,
      country: userEdits.country ?? residencyInfo.country ?? '',
    }),
    [residencyInfo, userEdits]
  );

  const handleInputChange = (field: keyof ResidencyInfoFormData) => (value: string) => {
    setUserEdits((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    const touchedFields = Object.keys(touched).filter(
      (key) => touched[key as keyof typeof touched]
    );

    touchedFields.forEach((field) => {
      const fieldName = field as keyof ResidencyInfoFormData;
      const value = formData[fieldName];

      if (value && value.trim() !== '') {
        const error = validateResidencyField(fieldName, value);
        if (error) {
          newErrors[fieldName] = error;
        }
      } else if (touched[fieldName] && (!value || value.trim() === '')) {
        newErrors[fieldName] = formatAddressFieldError(fieldName);
      }
    });

    const timer = setTimeout(() => {
      setErrors(newErrors);
    }, 0);

    return () => clearTimeout(timer);
  }, [formData, touched, submitAttempted]);

  const validateForm = () => {
    const result = validateResidencyFormForSubmit(formData);
    setErrors(result.errors);
    return result.isValid;
  };

  const isFormValid = () => {
    const allRequiredFilled = formData.address?.trim() !== '' && formData.country?.trim() !== '';

    const hasErrors = Object.keys(errors).length > 0;

    return allRequiredFilled && !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    setTouched({
      address: true,
      country: true,
    });

    if (validateForm()) {
      setResidencyInfo({
        address: formData.address,
        country: formData.country || null,
      });
      goToStep(4);
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
          label="Your address"
          value={formData.address}
          onChange={(e) => handleInputChange('address')(e.target.value)}
          placeholder="Enter your street address"
          error={errors.address}
          required
        />

        <Dropdown
          label="Country"
          options={mutableCountryOptions}
          value={formData.country}
          onChange={(value) => handleInputChange('country')(value)}
          placeholder="Select your country"
          error={errors.country}
          required
          className="w-full"
        />

        {submitAttempted && (errors.address || errors.country) && (
          <div className="error-text">Please fill in all required fields</div>
        )}

        <Button type="submit" disabled={!isFormValid()} className="w-full">
          Continue
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-center gap-2">
        <LockIcon className="w-4 h-4" />
        <span className="security-text">Your Info is safely secured</span>
      </div>
    </div>
  );
};

export default AddressStep;
