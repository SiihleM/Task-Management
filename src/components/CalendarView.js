import React, { useState } from 'react';

const urgencyColors = {
  high: '#E94E4E',
  medium: '#F4A261',
  low: '#2A9D8F',
};

function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = firstDayOfMonth.getDay();

  const daysInMonth = lastDayOfMonth.getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    if (!acc[task.dueDate]) acc[task.dueDate] = [];
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const calendarCells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startDay + 1;
    let cellDate = null;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    }
    calendarCells.push(cellDate);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section className="calendar-view" style={{ width: '100%', height: '100vh', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', backgroundColor: '#FCFCFC', border: '1px solid #ccc', borderRadius: '8px', padding: '10px 20px' }}>
        <h2 style={{ margin: 0 }}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '30px', fontSize: '32px', fontWeight: 'bold' }}>
        <span
          style={{
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'transform 0.2s, color 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#E94E4E';
            e.target.style.transform = 'scale(1.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '';
            e.target.style.transform = 'scale(1)';
          }}
          onClick={prevMonth}
        >
          ⯇
        </span>
        <strong style={{ fontSize: '24px' }}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </strong>
        <span
          style={{
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'transform 0.2s, color 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#E94E4E';
            e.target.style.transform = 'scale(1.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '';
            e.target.style.transform = 'scale(1)';
          }}
          onClick={nextMonth}
        >
          ⯈
        </span>
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
                <div
                  key={task.id}
                  className="task-box"
                  title={task.title}
                  style={{
                    backgroundColor: urgencyColors[task.urgency] || '#fff',
                    color: '#fff',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    marginTop: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskClick(task);
                  }}
                >
                  {task.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedTask.title}</h3>
            <p><strong>Description:</strong> {selectedTask.description || 'No description available.'}</p>
            <p><strong>Priority:</strong> {selectedTask.urgency || 'N/A'}</p>
            <p><strong>Tag:</strong> {selectedTask.tag || 'N/A'}</p>
            <p><strong>Due Date:</strong> {selectedTask.dueDate || 'N/A'}</p>
            <button onClick={closeModal} style={{ marginTop: '10px', backgroundColor: '#E94E4E', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CalendarView;
