class ResourceManager {
    constructor() {
        this.resources = [];
        this.filteredResources = [];
        this.currentPage = 1;
        this.resourcesPerPage = 12;
        this.filters = {
            year: 'all',
            semester: 'all',
            subjectCode: 'all'
        };
        
        this.init();
    }

    async init() {
        await this.loadResources();
        this.populateFilterOptions();
        this.setupEventListeners();
        this.updateStats();
        this.renderResources();
        this.renderPagination();
    }

    async loadResources() {
        try {
            const response = await fetch('../data/data-resources.json');
            const data = await response.json();
            this.resources = data.resources;
            this.filteredResources = [...this.resources];
        } catch (error) {
            console.error('Error loading resources:', error);
        }
    }

    populateFilterOptions() {
        const years = [...new Set(this.resources.map(r => r.year))];
        const semesters = [...new Set(this.resources.map(r => r.semester))];
        const subjects = [...new Set(this.resources.map(r => r.subjectCode))];

        this.populateSelect('year-filter', years);
        this.populateSelect('semester-filter', semesters);
        this.populateSelect('subject-filter', subjects);
    }

    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        options.sort().forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    setupEventListeners() {
        // Filter change listeners
        document.getElementById('year-filter').addEventListener('change', (e) => {
            this.filters.year = e.target.value;
            this.applyFilters();
        });

        document.getElementById('semester-filter').addEventListener('change', (e) => {
            this.filters.semester = e.target.value;
            this.applyFilters();
        });

        document.getElementById('subject-filter').addEventListener('change', (e) => {
            this.filters.subjectCode = e.target.value;
            this.applyFilters();
        });

        // Reset filters button
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Toggle filters button
        document.getElementById('toggle-filters').addEventListener('click', () => {
            this.toggleFilters();
        });

        // Academic calendar button (already in HTML, no event listener needed as it's a link)
    }

    toggleFilters() {
        const filterContent = document.getElementById('filter-content');
        const toggleBtn = document.getElementById('toggle-filters');
        
        if (filterContent.style.display === 'none' || filterContent.style.display === '') {
            filterContent.style.display = 'block';
            toggleBtn.innerHTML = '<i class="fas fa-times"></i><span>Hide Filters</span>';
        } else {
            filterContent.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-filter"></i><span>Show Filters</span>';
        }
    }

    applyFilters() {
        this.filteredResources = this.resources.filter(resource => {
            return (this.filters.year === 'all' || resource.year === this.filters.year) &&
                   (this.filters.semester === 'all' || resource.semester === this.filters.semester) &&
                   (this.filters.subjectCode === 'all' || resource.subjectCode === this.filters.subjectCode);
        });

        this.currentPage = 1;
        this.renderResources();
        this.renderPagination();
    }

    resetFilters() {
        this.filters = {
            year: 'all',
            semester: 'all',
            subjectCode: 'all'
        };

        document.getElementById('year-filter').value = 'all';
        document.getElementById('semester-filter').value = 'all';
        document.getElementById('subject-filter').value = 'all';

        this.filteredResources = [...this.resources];
        this.currentPage = 1;
        this.renderResources();
        this.renderPagination();
    }

    updateStats() {
        document.getElementById('total-resources').textContent = this.resources.length;
        
        const uniqueSubjects = new Set(this.resources.map(r => r.subjectCode)).size;
        document.getElementById('total-subjects').textContent = uniqueSubjects;
    }

    renderResources() {
        const container = document.getElementById('resource-container');
        const countElement = document.getElementById('resource-count');
        const noResultsElement = document.getElementById('no-results');

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.resourcesPerPage;
        const endIndex = startIndex + this.resourcesPerPage;
        const paginatedResources = this.filteredResources.slice(startIndex, endIndex);

        countElement.textContent = `Showing ${this.filteredResources.length} of ${this.resources.length} resources`;

        if (this.filteredResources.length === 0) {
            container.innerHTML = '';
            noResultsElement.style.display = 'block';
            return;
        }

        noResultsElement.style.display = 'none';
        container.innerHTML = '';

        paginatedResources.forEach(resource => {
            const card = this.createResourceCard(resource);
            container.appendChild(card);
        });
    }

    createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';

        card.innerHTML = `
            <div class="card-header" onclick="window.location.href='single-resources.html?id=${resource.id}'">
                <div class="day-subject">
                    <span class="day">${resource.day}</span>
                    <span class="subject-code">${resource.subjectCode}</span>
                </div>
                <h3 class="card-title">${resource.title}</h3>
                <p class="card-description">${resource.description}</p>
            </div>
            <div class="card-body">
                <a href="single-resources.html?id=${resource.id}" class="get-resources-btn">Get Resources</a>
            </div>
        `;

        return card;
    }

    renderPagination() {
        const paginationElement = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredResources.length / this.resourcesPerPage);

        if (totalPages <= 1) {
            paginationElement.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage - 1}">Previous</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" disabled>Previous</button>`;
        }

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="pagination-btn active" data-page="${i}">${i}</button>`;
            } else {
                paginationHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
            }
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Next</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" disabled>Next</button>`;
        }

        paginationElement.innerHTML = paginationHTML;

        // Add event listeners to pagination buttons
        paginationElement.querySelectorAll('.pagination-btn:not(:disabled)').forEach(button => {
            if (!button.classList.contains('active')) {
                button.addEventListener('click', (e) => {
                    this.currentPage = parseInt(e.target.dataset.page);
                    this.renderResources();
                    this.renderPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        });
    }
}

// Initialize the resource manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ResourceManager();
});