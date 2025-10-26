// tags.js - Fixed and Enhanced Version
class TagsManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentTag = null;
        this.currentPage = 1;
        this.articlesPerPage = 9;
        this.init();
    }

    async init() {
        await this.loadArticles();
        this.setupTagFromURL();
        this.filterArticles();
        this.renderArticles();
        this.renderPopularTags();
        this.setupEventListeners();
        this.setupPagination();
    }

    async loadArticles() {
        try {
            const response = await fetch('../data/blog-data.json');
            if (!response.ok) throw new Error('Failed to load articles');
            const data = await response.json();
            this.articles = data.articles;
            
            // Remove loading message
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error loading articles:', error);
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.textContent = 'Error loading articles. Please refresh the page.';
                loadingMessage.style.color = '#e74c3c';
            }
        }
    }

    setupTagFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');
        
        if (tag) {
            this.currentTag = decodeURIComponent(tag);
            this.updateUIForTag();
        } else {
            this.currentTag = null;
        }
    }

    updateUIForTag() {
        const subtitle = document.getElementById('tag-subtitle');
        if (subtitle && this.currentTag) {
            subtitle.textContent = `Articles tagged with "${this.currentTag}"`;
        }

        // Remove existing active tag header if any
        const existingHeader = document.querySelector('.active-tag-header');
        if (existingHeader) {
            existingHeader.remove();
        }

        // Create active tag header if we have a tag
        if (this.currentTag) {
            const activeTagHeader = document.createElement('div');
            activeTagHeader.className = 'active-tag-header';
            activeTagHeader.innerHTML = `
                <div class="active-tag">
                    <i class="fas fa-tag"></i>
                    ${this.currentTag}
                </div>
                <br>
                <a href="tags.html" class="clear-tag-filter">
                    <i class="fas fa-times"></i>
                    Clear Filter
                </a>
            `;
            
            const filtersSection = document.querySelector('.tags-filter-section');
            if (filtersSection) {
                filtersSection.parentNode.insertBefore(activeTagHeader, filtersSection.nextSibling);
            }
        }
    }

    filterArticles() {
        if (this.currentTag) {
            // Filter articles that have the current tag
            this.filteredArticles = this.articles.filter(article => 
                article.tags && article.tags.some(tag => 
                    tag.toLowerCase() === this.currentTag.toLowerCase()
                )
            );
        } else {
            // If no tag, show all articles
            this.filteredArticles = [...this.articles];
        }
        
        console.log(`Filtered ${this.filteredArticles.length} articles for tag: ${this.currentTag}`);
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
        
        // Show/hide pagination
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
            <article class="tags-article-card" data-id="${article.id}">
                <img src="${article.imageURL}" alt="${article.title}" class="tags-article-image" loading="lazy">
                <div class="tags-article-content">
                    <span class="tags-article-category ${categoryClass}">${article.category}</span>
                    <h2 class="tags-article-title">${article.title}</h2>
                    <p class="tags-article-summary">${article.summary}</p>
                    <div class="tags-article-tags">
                        ${article.tags ? article.tags.map(tag => 
                            `<a href="tags.html?tag=${encodeURIComponent(tag)}" class="tags-article-tag" onclick="event.stopPropagation(); tagsManager.handleTagClick('${tag}')">
                                ${tag}
                            </a>`
                        ).join('') : ''}
                    </div>
                    <div class="tags-article-meta">
                        <span class="tags-article-author">By ${article.author}</span>
                        <span class="tags-article-date">${new Date(article.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </article>
        `;
    }

    renderPopularTags() {
        // Remove existing popular tags section if any
        const existingSection = document.querySelector('.popular-tags');
        if (existingSection) {
            existingSection.remove();
        }

        // Calculate tag frequencies
        const tagCounts = {};
        this.articles.forEach(article => {
            if (article.tags) {
                article.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        // Only show popular tags if we have tags
        if (Object.keys(tagCounts).length === 0) {
            return;
        }

        const tagsCloud = document.createElement('div');
        tagsCloud.className = 'tags-cloud';
        
        // Create tag cloud items
        const popularTags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15) // Show top 15 tags
            .map(([tag, count]) => {
                const size = Math.min(5, Math.ceil(count / 2)); // Size based on frequency
                return `
                    <a href="tags.html?tag=${encodeURIComponent(tag)}" 
                       class="tag-cloud-item size-${size}"
                       onclick="tagsManager.handleTagClick('${tag}')">
                        ${tag} (${count})
                    </a>
                `;
            }).join('');

        tagsCloud.innerHTML = popularTags;

        // Insert popular tags section
        const popularTagsSection = document.createElement('section');
        popularTagsSection.className = 'popular-tags';
        popularTagsSection.innerHTML = `
            <h2>Popular Tags</h2>
        `;
        popularTagsSection.appendChild(tagsCloud);

        // Insert after filters section
        const filtersSection = document.querySelector('.tags-filter-section');
        if (filtersSection) {
            filtersSection.parentNode.insertBefore(popularTagsSection, filtersSection.nextSibling);
        }
    }

    handleTagClick(tag) {
        this.currentTag = tag;
        this.currentPage = 1;
        
        // Update URL
        const newUrl = `tags.html?tag=${encodeURIComponent(tag)}`;
        window.location.href = newUrl;
    }

    navigateToArticle(articleId) {
        window.location.href = `article.html?id=${articleId}`;
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
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Article card click events
        document.addEventListener('click', (e) => {
            const articleCard = e.target.closest('.tags-article-card');
            if (articleCard) {
                const articleId = articleCard.dataset.id;
                this.navigateToArticle(parseInt(articleId));
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.setupTagFromURL();
            this.filterArticles();
            this.renderArticles();
            this.setupPagination();
        });
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term === '') {
            // If search is empty, show filtered articles based on current tag
            this.filterArticles();
        } else {
            // Filter based on search term and current tag
            if (this.currentTag) {
                this.filteredArticles = this.articles.filter(article => 
                    article.tags && article.tags.some(tag => 
                        tag.toLowerCase() === this.currentTag.toLowerCase()
                    ) &&
                    (article.title.toLowerCase().includes(term) ||
                     article.summary.toLowerCase().includes(term) ||
                     article.author.toLowerCase().includes(term) ||
                     (article.tags && article.tags.some(tag => tag.toLowerCase().includes(term))))
                );
            } else {
                this.filteredArticles = this.articles.filter(article => 
                    article.title.toLowerCase().includes(term) ||
                    article.summary.toLowerCase().includes(term) ||
                    article.author.toLowerCase().includes(term) ||
                    (article.tags && article.tags.some(tag => tag.toLowerCase().includes(term)))
                );
            }
        }
        
        this.currentPage = 1;
        this.renderArticles();
        this.setupPagination();
    }
}

// Initialize the tags manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.tagsManager = new TagsManager();
});