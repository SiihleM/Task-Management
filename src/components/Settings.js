import React from 'react';

function Settings() {
  return (
    <section className="settings-page">
      <h2>Settings</h2>

      <form>
        <fieldset>
          <legend>Account Info</legend>
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" placeholder="Lily Bloom" />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="lily@example.com" />
        </fieldset>

        <fieldset>
          <legend>Change Password</legend>
          <label htmlFor="current-password">Current Password</label>
          <input type="password" id="current-password" />

          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" />
        </fieldset>

        <fieldset>
          <legend>Notifications</legend>
          <label>
            <input type="checkbox" defaultChecked />
            Enable Email Notifications
          </label>
          <label>
            <input type="checkbox" />
            Enable Push Notifications
          </label>
        </fieldset>

        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
}

export default Settings;
