"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import Modal from '@/components/admin/Modal';

export default function Employees() {
  const { employees, addEmployee, removeEmployee, editEmployee, updateEmployeeStatus } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    status: 'Active',
    joinDate: '',
    tasks: 0
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addEmployee(newEmployee);
    setNewEmployee({
      name: '',
      role: '',
      email: '',
      phone: '',
      status: 'Active',
      joinDate: '',
      tasks: 0
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editEmployee(selectedEmployee.id, selectedEmployee);
    setIsEditModalOpen(false);
  };

  const handleStatusChange = (id, status) => {
    updateEmployeeStatus(id, status);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      removeEmployee(id);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Employee Management
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 p-4 rounded-xl">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
        />
      </div>

      {/* Employees Table */}
      <div className="bg-gray-800/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Tasks</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredEmployees.map((employee) => (
              <motion.tr
                key={employee.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-700/30"
              >
                <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    employee.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.tasks}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Role
            </label>
            <select
              required
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            >
              <option value="">Select Role</option>
              <option value="Technician">Technician</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Join Date
            </label>
            <input
              type="date"
              required
              value={newEmployee.joinDate}
              onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Employee
          </button>
        </form>
      </Modal>

            {/* Edit Employee Modal */}
            <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee"
      >
        {selectedEmployee && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={selectedEmployee.name}
                onChange={(e) => setSelectedEmployee({
                  ...selectedEmployee,
                  name: e.target.value
                })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Role
              </label>
              <select
                required
                value={selectedEmployee.role}
                onChange={(e) => setSelectedEmployee({
                  ...selectedEmployee,
                  role: e.target.value
                })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              >
                <option value="">Select Role</option>
                <option value="Technician">Technician</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={selectedEmployee.email}
                onChange={(e) => setSelectedEmployee({
                  ...selectedEmployee,
                  email: e.target.value
                })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                value={selectedEmployee.phone}
                onChange={(e) => setSelectedEmployee({
                  ...selectedEmployee,
                  phone: e.target.value
                })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Join Date
              </label>
              <input
                type="date"
                required
                value={selectedEmployee.joinDate}
                onChange={(e) => setSelectedEmployee({
                  ...selectedEmployee,
                  joinDate: e.target.value
                })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <select
                value={selectedEmployee.status}
                onChange={(e) => setSelectedEmployee({
                  ...selectedEmployee,
                  status: e.target.value
                })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}