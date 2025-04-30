import React, { useState, useEffect } from 'react';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import ProgressBar from './ProgressBar';
import Modal from '../components/Modal';

function Form({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  const [formData, setFormData] = useState({
    host: '',
    organization: '',
    eventName: '',
    startDate: '',
    startTime: '',
    description: '',
    location: '',
    inviteType: '',
    image: '',
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const eventDateTime = `${formData.startDate}T${formData.startTime}:00`;

    const eventData = {
      organization_id: formData.organization || null,
      name: formData.eventName,
      event_date: eventDateTime,
      location: formData.location,
      description: formData.description,
      image: formData.image,
      inviteType: formData.inviteType,
    };

    console.log('Event Data:', eventData);

    if (!eventData.name || !eventData.event_date || !eventData.location) {
      setModal({
        isOpen: true,
        title: 'Error',
        message: 'Please fill out all required fields.',
      });
      return;
    }

    try {
      const response = await fetch('/api/Events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Event created successfully:', result);

        alert('Event created successfully!');

        setModal({
          isOpen: true,
          title: 'Success',
          message: 'Event created successfully!',
        });
        setFormComplete(true);
        onClose();
      } else {
        const error = await response.text();
        console.error('Error creating event:', error);
        setModal({
          isOpen: true,
          title: 'Error',
          message: 'Failed to create event. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setModal({
        isOpen: true,
        title: 'Error',
        message: 'An error occurred. Please try again.',
      });
    }
  };

  useEffect(() => {
    if (currentStep === 4) {
      handleSubmit();
    }
  }, [currentStep]);

  return (
    <div className="form-container">
      {!formComplete && (
        <>
          <ProgressBar currentStep={currentStep} />
          {currentStep === 1 && <FormStep1 onNext={handleNext} />}
          {currentStep === 2 && <FormStep2 onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <FormStep3 onNext={handleNext} onBack={handleBack} />}
        </>
      )}

      {modal.isOpen && (
        <Modal
          title={modal.title}
          message={modal.message}
          onClose={() => setModal({ isOpen: false, title: '', message: '' })}
        />
      )}
    </div>
  );
}

export default Form;