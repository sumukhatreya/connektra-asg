import { useState, useEffect } from 'react';

export default function TriggerPopUpForm({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceIntegrated, setServiceIntegrated] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        const res = await fetch(
          'http://localhost:3000/connectors/airtable/is-integrated',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: signal,
          }
        );
        if (res.ok) {
          console.log('In res ok', res);
          setServiceIntegrated(true);
        } else {
          console.log('Res is not ok', res);
          setServiceIntegrated(false);
        }
      } catch (error) {
        setServiceIntegrated(false);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const connectToService = async () => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      await fetch('http://localhost:3000/connectors/airtable/redirect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: signal,
      });
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const triggerData = {
      event
    }
    console.log('Form submitted');
    onClose(triggerData);
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
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              zIndex: 10,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}
              >
                Loading...
              </div>
            </div>
          </div>
        )}

        {!serviceIntegrated && (
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <button
              onClick={connectToService}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '16px 48px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '300px',
              }}
            >
              Connect
            </button>
          </div>
        )}

        {serviceIntegrated && (
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
                Trigger Event
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
                <option value='create'>Create record</option>
                <option value='update'>Update record</option>
              </select>
            </div>

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
        )}
        {error && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              color: '#c00',
              fontSize: '14px',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
