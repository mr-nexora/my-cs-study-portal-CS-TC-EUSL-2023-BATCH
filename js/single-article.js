// single-article.js - Enhanced with tag filtering and related articles
class SingleArticleManager {
    constructor() {
        this.article = null;
        this.allArticles = [];
        this.init();
    }

    async init() {
        await this.loadAllArticles();
        await this.loadArticle();
        this.setupEventListeners();
        this.setupTableOfContents();
        this.setupShareButtons();
    }

    async loadAllArticles() {
        try {
            const response = await fetch('../data/blog-data.json');
            if (!response.ok) throw new Error('Failed to load articles');
            const data = await response.json();
            this.allArticles = data.articles;
        } catch (error) {
            console.error('Error loading articles:', error);
        }
    }

    async loadArticle() {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = parseInt(urlParams.get('id'));
        
        if (!articleId) {
            this.showError();
            return;
        }

        try {
            const response = await fetch('../data/blog-data.json');
            if (!response.ok) throw new Error('Failed to load article');
            const data = await response.json();
            
            this.article = data.articles.find(article => article.id === articleId);
            
            if (!this.article) {
                this.showError();
                return;
            }

            this.renderArticle();
            this.renderAuthorInfo();
            this.renderRelatedArticles();
            document.getElementById('loading-message').style.display = 'none';
            
        } catch (error) {
            console.error('Error loading article:', error);
            this.showError();
        }
    }

    renderArticle() {
        const articleContainer = document.getElementById('article-detail');
        
        const articleHTML = `
            <div class="article-hero">
                <img src="${this.article.imageURL}" alt="${this.article.title}" class="article-hero-image">
                <div class="article-hero-content">
                    <span class="article-category ${this.article.category.replace(/\s+/g, '-')}">${this.article.category}</span>
                    <h1 class="article-title">${this.article.title}</h1>
                    <div class="article-meta">
                        <span class="article-author">
                            <i class="fas fa-user"></i> ${this.article.author}
                        </span>
                        <span class="article-date">
                            <i class="fas fa-calendar"></i> ${new Date(this.article.date).toLocaleDateString()}
                        </span>
                        <span class="article-reading-time">
                            <i class="fas fa-clock"></i> ${this.calculateReadingTime()} min read
                        </span>
                    </div>
                </div>
            </div>
            <div class="article-content">
                ${this.article.content}
                <div class="article-tags">
                    ${this.article.tags.map(tag => 
                        `<a href="tags.html?tag=${encodeURIComponent(tag)}" class="article-tag">
                            <i class="fas fa-tag"></i> ${tag}
                        </a>`
                    ).join('')}
                </div>
            </div>
        `;
        
        articleContainer.innerHTML = articleHTML;
    }

    renderAuthorInfo() {
        document.getElementById('author-avatar').src = this.article.authorAvatar;
        document.getElementById('author-name').textContent = this.article.author;
        document.getElementById('author-bio').textContent = this.article.authorBio;
    }

    renderRelatedArticles() {
        const relatedContainer = document.getElementById('related-articles');
        
        // Find articles with matching tags or same category
        const relatedArticles = this.allArticles
            .filter(article => 
                article.id !== this.article.id && 
                (article.category === this.article.category || 
                 article.tags.some(tag => this.article.tags.includes(tag)))
            )
            .slice(0, 3); // Show max 3 related articles

        if (relatedArticles.length === 0) {
            relatedContainer.innerHTML = '<p>No related articles found.</p>';
            return;
        }

        const relatedHTML = relatedArticles.map(article => `
            <a href="article.html?id=${article.id}" class="related-article">
                <img src="${article.imageURL}" alt="${article.title}" class="related-article-image">
                <div class="related-article-content">
                    <h4>${article.title}</h4>
                    <div class="related-article-meta">
                        <span>${article.category}</span>
                        <span>•</span>
                        <span>${new Date(article.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </a>
        `).join('');

        relatedContainer.innerHTML = relatedHTML;
    }

    calculateReadingTime() {
        const wordsPerMinute = 200;
        const textContent = this.article.content.replace(/<[^>]*>/g, '');
        const wordCount = textContent.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    setupTableOfContents() {
        const tocContainer = document.getElementById('table-of-contents');
        const headings = document.querySelectorAll('.article-content h2, .article-content h3');
        
        if (headings.length === 0) {
            tocContainer.innerHTML = '<p>No headings available.</p>';
            return;
        }

        let tocHTML = '<ul>';
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const level = heading.tagName.toLowerCase();
            const indent = level === 'h3' ? 'style="margin-left: 1rem;"' : '';
            
            tocHTML += `
                <li ${indent}>
                    <a href="#${id}" class="toc-link">${heading.textContent}</a>
                </li>
            `;
        });
        tocHTML += '</ul>';
        
        tocContainer.innerHTML = tocHTML;

        // Add scroll spy functionality
        this.setupScrollSpy();
    }

    setupScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const activeLink = document.querySelector(`.toc-link[href="#${id}"]`);
                    if (activeLink) {
                        document.querySelectorAll('.toc-link').forEach(link => {
                            link.classList.remove('active');
                        });
                        activeLink.classList.add('active');
                    }
                }
            });
        }, { 
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        });

        document.querySelectorAll('.article-content h2, .article-content h3').forEach(heading => {
            observer.observe(heading);
        });
    }

    setupShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', () => {
                const platform = button.dataset.platform;
                this.shareArticle(platform);
            });
        });
    }

    shareArticle(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.article.title);
        const text = encodeURIComponent(this.article.summary);

        let shareUrl = '';

        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(window.location.href).then(() => {
                    this.showCopyFeedback();
                });
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    showCopyFeedback() {
        const copyBtn = document.querySelector('.share-btn.copy-link');
        const originalHTML = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }

    showError() {
        document.getElementById('loading-message').style.display = 'none';
        document.getElementById('error-message').style.display = 'flex';
    }
}

// Initialize the single article manager
const singleArticleManager = new SingleArticleManager();