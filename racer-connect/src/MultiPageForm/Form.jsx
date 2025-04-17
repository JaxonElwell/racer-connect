import React, { useState } from 'react';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import ProgressBar from './ProgressBar';
import Modal from '../components/Modal';

function Form() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    host: '',
    organization: '',
    eventName: '',
    startDate: '',
    startTime: '',
    description: '',
    location: '',
    inviteType: '',
    image: null,
  });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const eventDate = formData.startDate;
    const eventTime = formData.startTime;
    const eventDateTime = `${eventDate}T${eventTime}:00`;
  
    const eventData = {
      organization_id: formData.organization || null,
      name: formData.eventName,
      event_date: eventDateTime,
      location: formData.location,
      description: formData.description,
      image: formData.image, // Use the image URL
    };
  
    console.log('Event Data:', eventData);
  
    if (!eventData.organization_id || !eventData.name || !eventData.event_date || !eventData.location) {
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
        body: JSON.stringify(eventData), // Send the image URL in the JSON
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Event created successfully:', result);
        setModal({
          isOpen: true,
          title: 'Success',
          message: 'Event created successfully!',
        });
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

  return (
    <div className="form-container">
      <ProgressBar currentStep={currentStep} />
      {currentStep === 1 && <FormStep1 onNext={handleNext} />}
      {currentStep === 2 && <FormStep2 onNext={handleNext} onBack={handleBack} />}
      {currentStep === 3 && <FormStep3 onSubmit={handleSubmit} onBack={handleBack} />}

      {/* Modal */}
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