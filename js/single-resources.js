class ResourceDetail {
    constructor() {
        this.resourceId = null;
        this.resources = [];
        this.currentResource = null;
        this.init();
    }

    async init() {
        this.resourceId = this.getResourceIdFromURL();
        if (!this.resourceId) {
            this.showNotFound();
            return;
        }

        await this.loadResources();
        this.loadResourceDetail();
        this.setupShareButtons();
    }

    getResourceIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadResources() {
        try {
            const response = await fetch('../data/data-resources.json');
            const data = await response.json();
            this.resources = data.resources;
        } catch (error) {
            console.error('Error loading resources:', error);
            this.showNotFound();
        }
    }

    loadResourceDetail() {
        this.currentResource = this.resources.find(r => r.id == this.resourceId);

        if (!this.currentResource) {
            this.showNotFound();
            return;
        }

        this.hideLoading();
        this.renderResourceDetail();
        this.showShareSection();
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showNotFound() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('not-found').style.display = 'block';
    }

    showShareSection() {
        document.getElementById('share-section').style.display = 'block';
    }

    renderResourceDetail() {
        const container = document.getElementById('detail-content');
        const resource = this.currentResource;

        container.innerHTML = `
            <article class="resource-detail">
                <div class="resource-header">
                    <div class="meta-info">
                        <span class="meta-item day">${resource.day}</span>
                        <span class="meta-item year">${resource.year}</span>
                        <span class="meta-item semester">${resource.semester}</span>
                        <span class="meta-item subject">${resource.subjectCode}</span>
                    </div>
                    <h1 class="resource-title">${resource.title}</h1>
                    <p class="resource-description">${resource.description}</p>
                </div>
                <div class="resource-body">
                    <div class="full-description">
                        <p>${resource.fullDescription}</p>
                    </div>
                    
                    <div class="resource-actions">
                        <h3>Available Resources</h3>
                        <div class="action-buttons">
                            ${resource.lectureNotesLink ? `<a href="${resource.lectureNotesLink}" target="_blank" class="action-btn lecture">
                                <i class="fas fa-book"></i>
                                Lecture Notes
                            </a>` : ''}
                            ${resource.simpleNoteLink ? `<a href="${resource.simpleNoteLink}" target="_blank" class="action-btn simple">
                                <i class="fas fa-file-alt"></i>
                                Simple Notes
                            </a>` : ''}
                            ${resource.quizLink ? `<a href="${resource.quizLink}" target="_blank" class="action-btn quiz">
                                <i class="fas fa-question-circle"></i>
                                Take Quiz
                            </a>` : ''}
                            ${resource.questionLink ? `<a href="${resource.questionLink}" target="_blank" class="action-btn question">
                                <i class="fas fa-tasks"></i>
                                Practice Questions
                            </a>` : ''}
                            ${resource.activityLink ? `<a href="${resource.activityLink}" target="_blank" class="action-btn activity">
                                <i class="fas fa-puzzle-piece"></i>
                                Activities
                            </a>` : ''}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    setupShareButtons() {
        const resource = this.currentResource;
        const currentURL = window.location.href;
        const title = encodeURIComponent(resource.title);
        const description = encodeURIComponent(resource.description);
        const hashtags = encodeURIComponent('cs-journey,mrnexora,sunexora');

        // Copy link button
        document.getElementById('copy-link').addEventListener('click', () => {
            navigator.clipboard.writeText(currentURL).then(() => {
                const originalText = document.getElementById('copy-link').innerHTML;
                document.getElementById('copy-link').innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
                
                setTimeout(() => {
                    document.getElementById('copy-link').innerHTML = originalText;
                }, 2000);
            });
        });

        // Facebook share
        document.getElementById('share-facebook').href = 
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}&quote=${title} - ${description}`;

        // Twitter share
        document.getElementById('share-twitter').href = 
            `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(currentURL)}&hashtags=${hashtags}`;

        // LinkedIn share
        document.getElementById('share-linkedin').href = 
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentURL)}`;

        // Instagram (direct link as Instagram doesn't have a direct share API)
        document.getElementById('share-instagram').href = 
            `https://www.instagram.com/`;

        // GitHub (direct link as GitHub doesn't have a direct share API)
        document.getElementById('share-github').href = 
            `https://github.com/`;
    }
}

// Initialize the resource detail when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ResourceDetail();
});