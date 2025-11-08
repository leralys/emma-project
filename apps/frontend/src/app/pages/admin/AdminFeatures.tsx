import { useState } from 'react';

interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

export function AdminFeatures() {
  const [features] = useState<Feature[]>([
    {
      id: '1',
      name: 'Email Notifications',
      description: 'Send email notifications to users',
      enabled: true,
      category: 'Communication',
    },
    {
      id: '2',
      name: 'Push Notifications',
      description: 'Send push notifications to mobile devices',
      enabled: false,
      category: 'Communication',
    },
    {
      id: '3',
      name: 'User Analytics',
      description: 'Track user behavior and analytics',
      enabled: true,
      category: 'Analytics',
    },
    {
      id: '4',
      name: 'Advanced Search',
      description: 'Enable advanced search functionality',
      enabled: false,
      category: 'Search',
    },
  ]);

  const toggleFeature = (featureId: string) => {
    // TODO: Implement feature toggle API call
    console.log('Toggle feature:', featureId);
  };

  const categories = [...new Set(features.map((f) => f.category))];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Feature Management</h1>
        <p className="mt-2 text-gray-600">Enable or disable application features</p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="mb-4 text-lg font-medium text-gray-900">{category}</h2>
          <div className="space-y-4">
            {features
              .filter((feature) => feature.category === category)
              .map((feature) => (
                <div
                  key={feature.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                    </div>
                    <div className="ml-6">
                      <button
                        onClick={() => toggleFeature(feature.id)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none ${
                          feature.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={feature.enabled}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            feature.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        feature.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {feature.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Feature Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Features</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {features.length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Enabled</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {features.filter((f) => f.enabled).length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Disabled</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {features.filter((f) => !f.enabled).length}
          </dd>
        </div>
      </div>
    </div>
  );
}

export default AdminFeatures;
