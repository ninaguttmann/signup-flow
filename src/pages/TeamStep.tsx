import { getStepContent } from '../config/stepsConfig';
import { useState, useCallback } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { RemoveIcon, PlusIcon } from '../components/common/Icons';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { VALIDATION_RULES, ERROR_MESSAGES, type PersonalInfoFormData } from '../utils/validation';
import { useOnboardingStore } from '../store/onboardingStore';
import { validateField } from '../utils/personalInfoUtils';
import { useRegisterMutation } from '../hooks/useRegisterMutation';

const TeamStep = () => {
  const stepContent = getStepContent(4);
  const { team, setTeam } = useOnboardingStore();
  const [emails, setEmails] = useState<string[]>(team || ['']);
  const [errors, setErrors] = useState<string[]>(['']);
  const [touched, setTouched] = useState<boolean[]>([false]);
  const [limitError, setLimitError] = useState('');
  const [registrationError, setRegistrationError] = useState<{message: string; details?: string} | null>(null);
  
  const handleRegistrationError = useCallback((message: string, details?: string) => {
    setRegistrationError({ message, details });
  }, []);

  const registerMutation = useRegisterMutation(handleRegistrationError);

  const isValidEmail = useCallback((email: string): boolean => {
    if (!email || email.trim() === '') {
      return false;
    }

    try {
      const error = validateField('email' as keyof PersonalInfoFormData, email);
      return !error;
    } catch (error) {
      console.error('Email validation error:', error);
      return false;
    }
  }, []);

  const validateEmail = useCallback((email: string): string => {
    if (!email || email.trim() === '') {
      return '';
    }

    try {
      const error = validateField('email' as keyof PersonalInfoFormData, email);
      return error || '';
    } catch (error) {
      console.error('Email validation error:', error);
      return ERROR_MESSAGES.email;
    }
  }, []);

  const handleEmailChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setEmails((prev) => {
        const newEmails = [...prev];
        newEmails[index] = value;
        return newEmails;
      });

      setTouched((prev) => {
        const newTouched = [...prev];
        newTouched[index] = true;
        return newTouched;
      });

      const error = validateEmail(value);
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = error;
        return newErrors;
      });
    },
    [validateEmail]
  );

  const handleBlur = useCallback(
    (index: number) => () => {
      setTouched((prev) => {
        const newTouched = [...prev];
        newTouched[index] = true;
        return newTouched;
      });

      const error = validateEmail(emails[index]);
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = error;
        return newErrors;
      });
    },
    [emails, validateEmail]
  );

  const handleRemoveEmail = useCallback(
    (index: number) => () => {
      if (emails.length > 1) {
        setEmails((prev) => prev.filter((_, i) => i !== index));
        setErrors((prev) => prev.filter((_, i) => i !== index));
        setTouched((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [emails.length]
  );

  const handleAddEmail = useCallback(() => {
    if (emails.length >= VALIDATION_RULES.team.maxMembers) {
      setLimitError(ERROR_MESSAGES.teamMax);
      return;
    }

    setEmails((prev) => [...prev, '']);
    setErrors((prev) => [...prev, '']);
    setTouched((prev) => [...prev, false]);
    setLimitError('');
  }, [emails.length]);

  const canAddAnotherTeammate = useCallback(() => {
    return emails.every((email) => isValidEmail(email));
  }, [emails, isValidEmail]);

  const canSaveAndContinue = useCallback(() => {
    return emails.every((email) => {
      if (!email || email.trim() === '') {
        return true;
      }
      return isValidEmail(email);
    });
  }, [emails, isValidEmail]);

  const handleSubmit = useCallback(() => {
    const validationResults = emails.map((email) => validateEmail(email));
    const hasErrors = validationResults.some((error) => error !== '');

    if (hasErrors) {
      setErrors(validationResults);
      setTouched(emails.map(() => true));
      return;
    }

    const validEmails = emails.filter((email) => email && email.trim() !== '');
    setTeam(validEmails);
    
    // Trigger the registration mutation
    registerMutation.mutate();
  }, [emails, validateEmail, setTeam, registerMutation]);

  return (
    <div>
      <div className="mb-9">
        <h2 className="heading-2 mb-2.5">{stepContent.displayTitle}</h2>
        <p className="body-text">{stepContent.subtitle}</p>
      </div>
      <form>
        <div className="space-y-4">
          {emails.map((email, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  className="w-full"
                  label={index === 0 ? 'Teammate email' : ''}
                  type="email"
                  value={email}
                  onChange={handleEmailChange(index)}
                  onBlur={handleBlur(index)}
                  error={touched[index] ? errors[index] : undefined}
                  placeholder="Enter team member email"
                />
              </div>
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={handleRemoveEmail(index)}
                  className="text-text-secondary transition-colors hover:text-error focus:text-error focus:outline-none"
                  aria-label={`Remove team member ${index + 1}`}
                >
                  <RemoveIcon />
                </button>
              )}
            </div>
          ))}

          {limitError && <div className="mt-2 text-sm text-error">{limitError}</div>}
        </div>

        {emails.length < VALIDATION_RULES.team.maxMembers && (
          <button
            type="button"
            onClick={handleAddEmail}
            disabled={!canAddAnotherTeammate()}
            className={`mt-4 flex items-center gap-2 transition-colors ${
              canAddAnotherTeammate()
                ? 'hover:text-primary-dark focus:text-primary-dark text-primary-main focus:outline-none'
                : 'cursor-not-allowed text-text-secondary opacity-50'
            }`}
          >
            <PlusIcon />
            Add another teammate
          </button>
        )}

        {registrationError && (
          <div className="mt-6">
            <ErrorMessage 
              message={registrationError.message} 
              details={registrationError.details}
              onDismiss={() => setRegistrationError(null)}
            />
          </div>
        )}

        <div className="mt-8">
          <Button 
            onClick={handleSubmit} 
            disabled={!canSaveAndContinue() || registerMutation.isPending} 
            className="w-full"
          >
            {registerMutation.isPending ? 'Registering...' : 'Save & Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeamStep;
