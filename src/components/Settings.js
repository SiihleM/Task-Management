import React, { useState } from 'react';

function Settings() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the form data. In a real app, submit to backend.
    console.log('Settings saved:', formData);
    alert('Settings saved successfully!');
  };

  return (
    <section className="settings-page">
      <h2>Settings</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Account Info</legend>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Lily Bloom"
            value={formData.name}
            onChange={handleChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="lily@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <legend>Change Password</legend>
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />

          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <legend>Notifications</legend>
          <label>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
            />
            Enable Email Notifications
          </label>
          <label>
            <input
              type="checkbox"
              name="pushNotifications"
              checked={formData.pushNotifications}
              onChange={handleChange}
            />
            Enable Push Notifications
          </label>
        </fieldset>

        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
}

export default Settings;
