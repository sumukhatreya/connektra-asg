import { useState, useEffect } from 'react';

export default function ActionPopUpForm({ onClose }) {
  const [error, setError] = useState(null);
  const [service, setService] = useState('');
  const [event, setEvent] = useState('');

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const actionData = {
      actioneNode: service,
      actionEvent: event
    }
    console.log('Form submitted');
    onClose(actionData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
          padding: '24px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
              }}
            >
              Action Node
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <option value=''>Select an option</option>
              {/* <option value='airtable'>Airtable</option> */}
              <option value='elevenlabs'>Eleven Labs</option>
            </select>
          </div>

          {service === 'airtable' && (
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px',
                }}
              >
                Action Event
              </label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value=''>Select an option</option>
                <option value='update'>Update record</option>
              </select>
            </div>
          )}

          {service === 'elevenlabs' && (
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px',
                }}
              >
                Action Event
              </label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value=''>Select an option</option>
                <option value='speech'>Generate speech</option>
                {/* <option value='clone'>Create voice clone</option> */}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type='submit'
              style={{
                flex: 1,
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
            <button
              type='button'
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#e5e7eb',
                color: '#374151',
                padding: '10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        {error && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              color: '#c00',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
