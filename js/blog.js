// blog.js - Complete Enhanced Version with Tag Filtering
class BlogManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 12;
        this.init();
    }

    async init() {
        await this.loadArticles();
        this.renderFeaturedArticles();
        this.renderArticles();
        this.setupEventListeners();
        this.setupPagination();
        this.updateStats();
    }

    async loadArticles() {
        try {
            const response = await fetch('../data/blog-data.json');
            if (!response.ok) {
                throw new Error('Failed to load articles');
            }
            const data = await response.json();
            this.articles = data.articles;
            this.filteredArticles = [...this.articles];
            
            // Hide loading message
            document.getElementById('loading-message').style.display = 'none';
            
        } catch (error) {
            console.error('Error loading articles:', error);
            const loadingMessage = document.getElementById('loading-message');
            loadingMessage.textContent = 'Error loading articles. Please refresh the page.';
            loadingMessage.style.color = '#e74c3c';
        }
    }

    renderFeaturedArticles() {
        const featuredContainer = document.getElementById('featured-articles');
        
        if (!featuredContainer || this.articles.length === 0) return;
        
        // Get first 3 articles as featured
        const featuredArticles = this.articles.slice(0, 3);
        
        if (featuredArticles.length === 0) {
            featuredContainer.style.display = 'none';
            return;
        }
        
        let featuredHTML = '<h2 class="section-title">Featured Articles</h2><div class="featured-grid">';
        
        // Main featured article
        featuredHTML += `
            <div class="featured-main" data-id="${featuredArticles[0].id}">
                <img src="${featuredArticles[0].imageURL}" alt="${featuredArticles[0].title}" loading="lazy">
                <div class="featured-main-content">
                    <span class="featured-category ${featuredArticles[0].category.replace(/\s+/g, '-')}">${featuredArticles[0].category}</span>
                    <h2 class="featured-title">${featuredArticles[0].title}</h2>
                    <div class="featured-meta">
                        <span class="featured-author">By ${featuredArticles[0].author}</span>
                        <span class="featured-date">${new Date(featuredArticles[0].date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="featured-side">
        `;
        
        // Side featured articles
        for (let i = 1; i < featuredArticles.length; i++) {
            featuredHTML += `
                <div class="featured-side-item" data-id="${featuredArticles[i].id}">
                    <img src="${featuredArticles[i].imageURL}" alt="${featuredArticles[i].title}" loading="lazy">
                    <div class="featured-side-content">
                        <span class="featured-category ${featuredArticles[i].category.replace(/\s+/g, '-')}">${featuredArticles[i].category}</span>
                        <h3 class="featured-side-title">${featuredArticles[i].title}</h3>
                    </div>
                </div>
            `;
        }
        
        featuredHTML += '</div></div>';
        featuredContainer.innerHTML = featuredHTML;
    }

    renderArticles() {
        const container = document.getElementById('article-list');
        const noArticlesMessage = document.getElementById('no-articles-message');

        if (!container) {
            console.error('Article list container not found');
            return;
        }

        if (this.filteredArticles.length === 0) {
            container.innerHTML = '';
            if (noArticlesMessage) {
                noArticlesMessage.style.display = 'flex';
            }
            const pagination = document.getElementById('pagination');
            if (pagination) {
                pagination.style.display = 'none';
            }
            return;
        }

        if (noArticlesMessage) {
            noArticlesMessage.style.display = 'none';
        }
        
        // Calculate articles to show for current page
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);
        
        container.innerHTML = articlesToShow.map(article => this.createArticleCard(article)).join('');
        
        // Show pagination if needed
        const pagination = document.getElementById('pagination');
        if (pagination) {
            if (this.filteredArticles.length > this.articlesPerPage) {
                pagination.style.display = 'flex';
            } else {
                pagination.style.display = 'none';
            }
        }
    }

    createArticleCard(article) {
        const categoryClass = article.category.replace(/\s+/g, '-');
        
        return `
            <article class="article-card" data-id="${article.id}">
                <img src="${article.imageURL}" alt="${article.title}" class="article-image" loading="lazy">
                <div class="article-content">
                    <span class="article-category ${categoryClass}">${article.category}</span>
                    <h2 class="article-title">${article.title}</h2>
                    <p class="article-summary">${article.summary}</p>
                    <div class="article-tags">
                        ${article.tags ? article.tags.map(tag => 
                            `<span class="article-tag" data-tag="${tag}">${tag}</span>`
                        ).join('') : ''}
                    </div>
                    <div class="article-meta">
                        <span class="article-author">By ${article.author}</span>
                        <span class="article-date">${new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <button class="read-more-btn" data-id="${article.id}">
                        Read More <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </article>
        `;
    }

    filterArticles() {
        const categoryFilter = document.getElementById('category-filter').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const sortBy = document.getElementById('sort-by').value;

        this.filteredArticles = this.articles.filter(article => {
            const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
            const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                                article.summary.toLowerCase().includes(searchTerm) ||
                                article.author.toLowerCase().includes(searchTerm) ||
                                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
            
            return matchesCategory && matchesSearch;
        });

        // Sort articles
        this.sortArticles(sortBy);

        this.currentPage = 1;
        this.renderArticles();
        this.setupPagination();
        
        // Show/hide clear search button
        const clearSearchBtn = document.getElementById('clear-search');
        if (clearSearchBtn) {
            clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
        }
    }

    sortArticles(sortBy) {
        switch(sortBy) {
            case 'newest':
                this.filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title':
                this.filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                // Default to newest
                this.filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }

    filterByTag(tag) {
        // Navigate to tags page with the selected tag
        window.location.href = `tags.html?tag=${encodeURIComponent(tag)}`;
    }

    navigateToArticle(articleId) {
        window.location.href = `article.html?id=${articleId}`;
    }

    updateStats() {
        const totalArticlesElement = document.getElementById('total-articles');
        if (totalArticlesElement) {
            totalArticlesElement.textContent = this.articles.length;
        }
        
        // Calculate unique categories
        const uniqueCategories = new Set(this.articles.map(article => article.category));
        const totalCategoriesElement = document.getElementById('total-categories');
        if (totalCategoriesElement) {
            totalCategoriesElement.textContent = uniqueCategories.size;
        }
    }

    setupPagination() {
        const pageNumbersContainer = document.getElementById('page-numbers');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (!pageNumbersContainer || !prevBtn || !nextBtn) {
            return;
        }

        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);

        // Clear existing page numbers
        pageNumbersContainer.innerHTML = '';

        // Add page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                this.currentPage = i;
                this.renderArticles();
                this.setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pageNumbersContainer.appendChild(pageNumber);
        }

        // Setup previous and next buttons
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderArticles();
                this.setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        nextBtn.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderArticles();
                this.setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
    }

    setupEventListeners() {
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterArticles();
            });
        }

        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterArticles();
            });
        }

        // Sort options
        const sortBy = document.getElementById('sort-by');
        if (sortBy) {
            sortBy.addEventListener('change', () => {
                this.filterArticles();
            });
        }

        // Clear search button
        const clearSearch = document.getElementById('clear-search');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                document.getElementById('search-input').value = '';
                this.filterArticles();
            });
        }

        // Tag click events
        document.addEventListener('click', (e) => {
            // Handle article tag clicks
            if (e.target.classList.contains('article-tag')) {
                e.preventDefault();
                e.stopPropagation();
                const tag = e.target.dataset.tag || e.target.textContent.trim();
                this.filterByTag(tag);
                return;
            }

            // Handle featured article clicks
            const featuredArticle = e.target.closest('.featured-main, .featured-side-item');
            if (featuredArticle) {
                const articleId = featuredArticle.dataset.id;
                this.navigateToArticle(parseInt(articleId));
                return;
            }

            // Handle article card clicks
            const articleCard = e.target.closest('.article-card');
            if (articleCard && !e.target.classList.contains('read-more-btn') && !e.target.classList.contains('article-tag')) {
                const articleId = articleCard.dataset.id;
                this.navigateToArticle(parseInt(articleId));
                return;
            }

            // Handle read more button clicks
            if (e.target.classList.contains('read-more-btn') || e.target.closest('.read-more-btn')) {
                const button = e.target.classList.contains('read-more-btn') ? e.target : e.target.closest('.read-more-btn');
                const articleId = button.dataset.id;
                this.navigateToArticle(parseInt(articleId));
                return;
            }
        });

        // Keyboard navigation for search
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filterArticles();
                }
            });
        }
    }
}

// Initialize the blog manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});

// Add some utility functions
const BlogUtils = {
    // Format date
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Debounce function for search
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Get reading time
    getReadingTime: (content) => {
        const wordsPerMinute = 200;
        const textContent = content.replace(/<[^>]*>/g, '');
        const wordCount = textContent.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogManager, BlogUtils };
}