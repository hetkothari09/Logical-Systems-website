"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEmployee } from '@/contexts/EmployeeContext';
import { FiCalendar, FiClock, FiUsers } from 'react-icons/fi';

export default function Schedule() {
  const { events, getMySchedule } = useEmployee();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');

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
        events: events.filter(event => 
          event.date === prevDate.toISOString().split('T')[0] &&
          event.participants?.includes('John Doe')
        )
      });
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({ 
        date: currentDate,
        isCurrentMonth: true,
        events: events.filter(event => 
          event.date === currentDate.toISOString().split('T')[0] &&
          event.participants?.includes('John Doe')
        )
      });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(selectedDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mySchedule = getMySchedule();

  const filteredEvents = mySchedule.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          My Schedule
        </h1>
        <div className="flex gap-4">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="bg-gray-700/50 rounded-lg px-4 py-2"
          >
            <option value="month">Month View</option>
            <option value="list">List View</option>
          </select>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-700/50 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      {view === 'month' ? (
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-gray-400 py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-gray-700 rounded-lg ${
                  day.isCurrentMonth ? 'bg-gray-800/50' : 'bg-gray-800/20'
                }`}
              >
                <div className="text-sm text-gray-400">
                  {day.date.getDate()}
                </div>
                {day.events.map(event => (
                  <div
                    key={event.id}
                    className="mt-1 p-1 text-xs bg-blue-500/20 text-blue-400 rounded"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/50 p-6 rounded-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-gray-400 mt-1">{event.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FiCalendar />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers />
                  <span>{event.participants?.length} participants</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}