export function AdminLetters() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Letter Management</h1>
        <p className="mt-2 text-gray-600">Manage and monitor user letters and communications</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="py-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">✉️</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No letters yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Letter management functionality will be implemented here.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <span className="mr-2">+</span>
              Create Letter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Letters</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Sent Today</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Pending</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
        </div>
      </div>
    </div>
  );
}

export default AdminLetters;
