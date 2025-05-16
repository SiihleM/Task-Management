import React, { useState } from 'react';

function CalendarView({ tasks, onAddTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // Get last day of the month
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  // Get day of week for first day (0=Sunday, 6=Saturday)
  const startDay = firstDayOfMonth.getDay();

  // Generate array of dates to display in calendar grid (including previous month's trailing days)
  const daysInMonth = lastDayOfMonth.getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  // Helper to format date to YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];

  // Group tasks by due date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    if (!acc[task.dueDate]) acc[task.dueDate] = [];
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  // Handlers for month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Handle day click to select date
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  // Generate calendar cells
  const calendarCells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startDay + 1;
    let cellDate = null;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    }
    calendarCells.push(cellDate);
  }

  // Weekday labels
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section className="calendar-view" style={{ width: '100%', height: '100vh', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', backgroundColor: '#FCFCFC', border: '1px solid #ccc', borderRadius: '8px', padding: '10px 20px' }}>
        <h2 style={{ margin: 0 }}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => {
            if (selectedDate) {
              onAddTask(formatDate(selectedDate));
            } else {
              onAddTask(formatDate(currentDate));
            }
          }}
          style={{ backgroundColor: '#E94E4E', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '16px', border: 'none', cursor: 'pointer' }}
        >
          Add New Task
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <button onClick={prevMonth}>Previous</button>
        <button onClick={nextMonth}>Next</button>
      </div>
      <div className="calendar-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', flexGrow: 1, display: 'grid', gap: '5px', overflowY: 'auto' }}>
        {weekdays.map((day) => (
          <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '5px 0' }}>
            {day}
          </div>
        ))}
        {calendarCells.map((date, idx) => {
          if (!date) {
            return <div key={idx} className="calendar-day" style={{ backgroundColor: '#f0f0f0' }}></div>;
          }
          const dateStr = formatDate(date);
          const dayTasks = tasksByDate[dateStr] || [];
          const isSelected = selectedDate && dateStr === formatDate(selectedDate);
          return (
            <div
              key={dateStr}
              className="calendar-day"
              onClick={() => handleDayClick(date)}
              style={{
                minHeight: '80px',
                textAlign: 'left',
                padding: '5px',
                overflowY: 'auto',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#E94E4E' : '#FCFCFC',
                color: isSelected ? '#fff' : '#000',
                borderRadius: '8px',
                userSelect: 'none',
              }}
            >
              <strong>{date.getDate()}</strong>
              {dayTasks.map((task) => (
                <div key={task.id} className="task-box" title={task.title} style={{ backgroundColor: '#fff', color: '#000', padding: '2px 4px', borderRadius: '4px', marginTop: '4px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarView;
