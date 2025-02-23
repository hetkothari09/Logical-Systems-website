"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import Modal from '@/components/admin/Modal';

export default function Schedule() {
  const { events, employees, addEvent } = useAdmin();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'meeting',
    participants: [],
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent(newEvent);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      type: 'meeting',
      participants: [],
      description: ''
    });
    setIsAddModalOpen(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add previous month's days
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.push({ 
        date: prevDate,
        isCurrentMonth: false,
        events: events.filter(event => event.date === prevDate.toISOString().split('T')[0])
      });
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({ 
        date: currentDate,
        isCurrentMonth: true,
        events: events.filter(event => event.date === currentDate.toISOString().split('T')[0])
      });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(selectedDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Schedule Planner
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add Event
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
            }}
            className="text-gray-400 hover:text-white"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
            }}
            className="text-gray-400 hover:text-white"
          >
            →
          </button>
        </div>
        <div className="flex space-x-2">
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-lg capitalize ${
                view === v
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-gray-800/50 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-700">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 text-center text-gray-400 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-700">
          {calendarDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`min-h-[100px] p-2 ${
                day.isCurrentMonth ? 'bg-gray-800' : 'bg-gray-800/50'
              }`}
            >
              <div className="text-sm text-gray-400">
                {day.date.getDate()}
              </div>
              {day.events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-1 p-1 rounded text-xs ${
                    event.type === 'meeting'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  <div className="font-medium">{event.title}</div>
                  <div>{event.time}</div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-gray-800/50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {getUpcomingEvents().map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
            >
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-400">
                  {event.date} at {event.time}
                </p>
                <p className="text-sm text-gray-400">{event.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex -space-x-2">
                  {event.participants.map((participant, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm"
                    >
                      {participant.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Event"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Event Type
            </label>
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            >
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Participants
            </label>
            <select
              multiple
              value={newEvent.participants}
              onChange={(e) => setNewEvent({
                ...newEvent,
                participants: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Event
          </button>
        </form>
      </Modal>
    </div>
  );
}