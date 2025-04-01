import React, { useState } from 'react';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import ProgressBar from './ProgressBar';

function Form() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    host: '',
    organization: '',
    eventName: '',
    startDate: '',
    startTime: '',
    description: '',
    inviteType: '',
    image: null,
  });

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add logic to submit the form data to the backend
  };

  return (
    <div className="form-container">
      <ProgressBar currentStep={currentStep} />
      {currentStep === 1 && <FormStep1 onNext={handleNext} />}
      {currentStep === 2 && <FormStep2 onNext={handleNext} onBack={handleBack} />}
      {currentStep === 3 && <FormStep3 onSubmit={handleSubmit} onBack={handleBack} />}
    </div>
  );
}

export default Form;