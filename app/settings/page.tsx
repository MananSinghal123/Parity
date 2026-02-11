"use client";

import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account and preferences</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Account Settings */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Account</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Wallet Address</label>
              <input
                type="text"
                value="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
                readOnly
                className="w-full bg-surface-light border border-border rounded px-3 py-2 text-text-primary"
              />
            </div>
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Email (optional)</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-surface-light border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-secondary">Price alerts</span>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-secondary">Event market updates</span>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-secondary">Portfolio changes</span>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </label>
          </div>
        </div>

        {/* Risk Preferences */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Risk Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Risk Tolerance</label>
              <select className="w-full bg-surface-light border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-primary">
                <option>Conservative</option>
                <option>Moderate</option>
                <option>Aggressive</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Auto-hedge threshold</label>
              <input
                type="number"
                placeholder="30"
                className="w-full bg-surface-light border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-text-tertiary mt-1">
                Suggest hedges when position risk exceeds this percentage
              </p>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Theme</label>
              <select className="w-full bg-surface-light border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-primary">
                <option>Dark (default)</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
