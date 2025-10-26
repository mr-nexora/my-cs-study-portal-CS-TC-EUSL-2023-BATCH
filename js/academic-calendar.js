class AcademicCalendar {
    constructor() {
        this.resources = [];
        this.currentDate = new Date();
        this.selectedDate = null;
        this.resourcesByDate = {};
        this.currentView = 'month'; // 'month' or 'week'
        
        this.init();
    }

    async init() {
        await this.loadResources();
        this.groupResourcesByDate();
        this.renderCalendar();
        this.setupEventListeners();
        this.updateStats();
        this.showWelcomeState();
    }

    async loadResources() {
        try {
            const response = await fetch('../data/data-resources.json');
            const data = await response.json();
            this.resources = data.resources;
        } catch (error) {
            console.error('Error loading resources:', error);
        }
    }

    groupResourcesByDate() {
        this.resourcesByDate = {};
        
        this.resources.forEach(resource => {
            if (resource.date) {
                if (!this.resourcesByDate[resource.date]) {
                    this.resourcesByDate[resource.date] = [];
                }
                this.resourcesByDate[resource.date].push(resource);
            }
        });
    }

    updateStats() {
        // Total resources
        document.getElementById('total-resources').textContent = this.resources.length;
        
        // Days with resources
        const daysWithResources = Object.keys(this.resourcesByDate).length;
        document.getElementById('days-with-resources').textContent = daysWithResources;
        
        // Total subjects
        const uniqueSubjects = new Set(this.resources.map(r => r.subjectCode)).size;
        document.getElementById('total-subjects').textContent = uniqueSubjects;
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const monthYearElement = document.getElementById('current-month-year');
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Set month/year header
        monthYearElement.textContent = this.currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        
        if (this.currentView === 'month') {
            this.renderMonthView(calendarGrid);
        } else {
            this.renderWeekView(calendarGrid);
        }
    }

    renderMonthView(calendarGrid) {
        calendarGrid.className = 'calendar-grid month-view';
        
        // Create calendar header (days of week)
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-header';
            dayElement.textContent = day.substring(0, 3);
            calendarGrid.appendChild(dayElement);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dateString = this.formatDate(date);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.dataset.date = dateString;
            
            // Check if this is today
            if (date.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }
            
            // Check if this date has resources
            if (this.resourcesByDate[dateString]) {
                dayElement.classList.add('has-resources');
            }
            
            // Check if this date is selected
            if (this.selectedDate === dateString) {
                dayElement.classList.add('selected');
            }
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);
            
            // Add resource indicators
            if (this.resourcesByDate[dateString]) {
                const resourcesContainer = document.createElement('div');
                resourcesContainer.className = 'day-resources';
                
                // Show resource type dots
                const resourceTypes = this.getResourceTypesForDate(dateString);
                resourceTypes.forEach(type => {
                    const dot = document.createElement('div');
                    dot.className = `resource-dot ${type}`;
                    resourcesContainer.appendChild(dot);
                });
                
                dayElement.appendChild(resourcesContainer);
                
                // Add resource count badge
                const resourceCount = document.createElement('div');
                resourceCount.className = 'resource-count';
                resourceCount.textContent = this.resourcesByDate[dateString].length;
                dayElement.appendChild(resourceCount);
            }
            
            // Add click event
            dayElement.addEventListener('click', () => {
                this.selectDate(dateString);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }

    renderWeekView(calendarGrid) {
        calendarGrid.className = 'calendar-grid week-view';
        
        // Add time slots header
        const timeHeader = document.createElement('div');
        timeHeader.className = 'calendar-header';
        timeHeader.textContent = 'Time';
        calendarGrid.appendChild(timeHeader);
        
        // Create calendar header (days of week)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        // Get current week dates
        const weekDates = this.getWeekDates();
        
        // Add time slots and day cells
        for (let hour = 8; hour <= 17; hour++) {
            // Time slot
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = `${hour}:00`;
            calendarGrid.appendChild(timeSlot);
            
            // Day cells for this time slot
            weekDates.forEach(date => {
                const dateString = this.formatDate(date);
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.dataset.date = dateString;
                
                // Check if this is today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (date.getTime() === today.getTime()) {
                    dayElement.classList.add('today');
                }
                
                // Check if this date has resources
                if (this.resourcesByDate[dateString]) {
                    dayElement.classList.add('has-resources');
                }
                
                // Check if this date is selected
                if (this.selectedDate === dateString) {
                    dayElement.classList.add('selected');
                }
                
                // Add resource indicators for this time (simplified)
                if (this.resourcesByDate[dateString]) {
                    const resourceCount = document.createElement('div');
                    resourceCount.className = 'resource-count';
                    resourceCount.textContent = this.resourcesByDate[dateString].length;
                    resourceCount.style.position = 'absolute';
                    resourceCount.style.top = '5px';
                    resourceCount.style.right = '5px';
                    dayElement.appendChild(resourceCount);
                }
                
                // Add click event
                dayElement.addEventListener('click', () => {
                    this.selectDate(dateString);
                });
                
                calendarGrid.appendChild(dayElement);
            });
        }
    }

    getWeekDates() {
        const dates = [];
        const current = new Date(this.currentDate);
        const day = current.getDay();
        const diff = current.getDate() - day;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(current.setDate(diff + i));
            dates.push(new Date(date));
        }
        
        return dates;
    }

    getResourceTypesForDate(dateString) {
        const resources = this.resourcesByDate[dateString] || [];
        const types = new Set();
        
        resources.forEach(resource => {
            if (resource.lectureNotesLink) types.add('lecture');
            if (resource.simpleNoteLink) types.add('simple');
            if (resource.quizLink) types.add('quiz');
            if (resource.questionLink) types.add('question');
            if (resource.activityLink) types.add('activity');
        });
        
        return Array.from(types);
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    selectDate(dateString) {
        // Remove selected class from all days
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selected class to clicked day
        const selectedDay = document.querySelector(`[data-date="${dateString}"]`);
        if (selectedDay) {
            selectedDay.classList.add('selected');
        }
        
        this.selectedDate = dateString;
        this.displayResourcesForDate(dateString);
    }

    displayResourcesForDate(dateString) {
    const resourcesList = document.getElementById('resources-list');
    const selectedDateTitle = document.getElementById('selected-date-title');
    const selectedDateSubtitle = document.getElementById('selected-date-subtitle');
    
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    selectedDateTitle.textContent = `Resources for ${formattedDate}`;
    selectedDateSubtitle.textContent = `Available study materials for ${formattedDate}`;
    
    if (this.resourcesByDate[dateString] && this.resourcesByDate[dateString].length > 0) {
        resourcesList.innerHTML = '';
        
        this.resourcesByDate[dateString].forEach(resource => {
            const resourceItem = document.createElement('div');
            resourceItem.className = 'resource-item';
            
            // Create buttons array for cleaner code
            const buttons = [];
            
            if (resource.lectureNotesLink) {
                buttons.push(`<a href="${resource.lectureNotesLink}" target="_blank" class="resource-action-btn lecture">
                    <i class="fas fa-book"></i>Lecture Notes
                </a>`);
            }
            
            if (resource.simpleNoteLink) {
                buttons.push(`<a href="${resource.simpleNoteLink}" target="_blank" class="resource-action-btn simple">
                    <i class="fas fa-file-alt"></i>Simple Notes
                </a>`);
            }
            
            if (resource.quizLink) {
                buttons.push(`<a href="${resource.quizLink}" target="_blank" class="resource-action-btn quiz">
                    <i class="fas fa-question-circle"></i>Take Quiz
                </a>`);
            }
            
            if (resource.questionLink) {
                buttons.push(`<a href="${resource.questionLink}" target="_blank" class="resource-action-btn question">
                    <i class="fas fa-tasks"></i>Questions
                </a>`);
            }
            
            if (resource.activityLink) {
                buttons.push(`<a href="${resource.activityLink}" target="_blank" class="resource-action-btn activity">
                    <i class="fas fa-puzzle-piece"></i>Activities
                </a>`);
            }
            
            resourceItem.innerHTML = `
                <div class="resource-meta">
                    <span class="subject">${resource.subjectCode}</span>
                    <span class="year">${resource.year}</span>
                    <span class="semester">${resource.semester}</span>
                    <span class="day">${resource.day}</span>
                </div>
                <h4 class="resource-title">${resource.title}</h4>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-actions">
                    ${buttons.join('')}
                </div>
            `;
            
            resourcesList.appendChild(resourceItem);
        });
    } else {
        resourcesList.innerHTML = `
            <div class="no-resources">
                <i class="fas fa-calendar-times"></i>
                <h3>No Resources Available</h3>
                <p>There are no study materials scheduled for this date.</p>
                <p>Check other dates or contact your instructor for more information.</p>
            </div>
        `;
    }
}


    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        document.getElementById('prev-year').addEventListener('click', () => {
            this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('next-year').addEventListener('click', () => {
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
            this.renderCalendar();
        });
        
        // View toggle buttons
        document.getElementById('month-view').addEventListener('click', () => {
            this.currentView = 'month';
            document.getElementById('month-view').classList.add('active');
            document.getElementById('week-view').classList.remove('active');
            this.renderCalendar();
        });
        
        document.getElementById('week-view').addEventListener('click', () => {
            this.currentView = 'week';
            document.getElementById('week-view').classList.add('active');
            document.getElementById('month-view').classList.remove('active');
            this.renderCalendar();
        });
        
        // Go to today button
        document.getElementById('go-today').addEventListener('click', () => {
            this.currentDate = new Date();
            this.renderCalendar();
            const todayString = this.formatDate(new Date());
            this.selectDate(todayString);
        });
    }
}

// Initialize the academic calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AcademicCalendar();
});