import { AiOutlineSearch } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';
import { FaEdit, FaHeart, FaPlus, FaTrash, FaUser } from 'react-icons/fa';
import { HiCog, HiHome, HiMenu, HiUser } from 'react-icons/hi';
import { MdEmail, MdNotifications } from 'react-icons/md';

/**
 * Example component showcasing react-icons usage with Tailwind CSS
 */
export function IconExamples() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">React Icons Examples</h1>

      {/* Basic Icons */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Basic Icons</h2>
        <div className="flex items-center gap-4">
          <FaHeart className="text-red-500" size={24} />
          <FaUser className="text-blue-500" size={24} />
          <MdEmail className="text-gray-700" size={24} />
          <HiHome size={32} />
          <MdNotifications className="text-yellow-500" size={28} />
        </div>
      </section>

      {/* Navigation */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Navigation</h2>
        <nav className="flex gap-6">
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-500">
            <HiHome size={24} />
            <span className="text-sm">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-500">
            <HiUser size={24} />
            <span className="text-sm">Profile</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-500">
            <HiCog size={24} />
            <span className="text-sm">Settings</span>
          </button>
        </nav>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            <FaPlus /> Add Item
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            <FaEdit /> Edit
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
            <FaTrash /> Delete
          </button>
        </div>
      </section>

      {/* Loading Spinner */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Loading Spinner</h2>
        <BiLoaderAlt className="animate-spin text-blue-500" size={32} />
      </section>

      {/* Search Input */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Search Input</h2>
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
          />
          <AiOutlineSearch
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </section>

      {/* Menu Button */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Menu Button</h2>
        <button className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100">
          <HiMenu size={24} />
        </button>
      </section>

      {/* Icon Sizes */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Different Sizes</h2>
        <div className="flex items-end gap-4">
          <FaHeart className="text-red-500" size={16} />
          <FaHeart className="text-red-500" size={24} />
          <FaHeart className="text-red-500" size={32} />
          <FaHeart className="text-red-500" size={48} />
          <FaHeart className="text-red-500" size={64} />
        </div>
      </section>
    </div>
  );
}
