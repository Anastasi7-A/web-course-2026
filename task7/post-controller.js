class PostController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.observer = null;
        this.searchTimeout = null; 
        this.isSearchActive = false;
    }

    async init() {
        this.setupSearchListener();
        this.setupIntersectionObserver();
        await this.loadInitialPosts();
    }

    async loadInitialPosts() {
        try {
            this.view.hideError();
            this.view.showLoader();

            const newPosts = await this.model.fetchPosts();
            
            if (newPosts) {
                this.view.renderPosts(newPosts);
                this.updateUI();
            }

            this.checkEndCondition();
        } catch (error) {
            this.view.showError(error.message || 'Не удалось загрузить посты');
        } finally {
            this.view.hideLoader();
        }
    }

    async loadMorePosts() {

        if (this.isSearchActive || !this.model.hasMorePosts()) return;

        try {
            this.view.hideError();
            this.view.showLoader();

            const newPosts = await this.model.fetchPosts();
            
            if (newPosts) {
                this.view.renderPosts(newPosts);
                this.updateUI();
            }

            this.checkEndCondition();
        } catch (error) {
            this.view.showError(error.message || 'Ошибка при загрузке');
        } finally {
            this.view.hideLoader();
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.1 
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadMorePosts();
                }
            });
        }, options);

        this.observer.observe(this.view.scrollTrigger);
    }

    setupSearchListener() {
        this.view.searchInput.addEventListener('input', (e) => {
            const query = e.target.value;

            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {
                this.handleSearch(query);
            }, 300);
        });
    }

    handleSearch(query) {
        this.model.setSearchQuery(query);
        this.isSearchActive = query.trim().length > 0;

        const filteredPosts = this.model.getFilteredPosts();
        this.view.rerenderPosts(filteredPosts);

        if (this.isSearchActive) {
            this.view.hideEndMessage();
        } else {
            this.checkEndCondition();
        }
    }

    updateUI() {
        this.view.updatePostsCount(
            this.model.getLoadedCount(),
            this.model.totalPosts
        );
    }

    checkEndCondition() {
        if (!this.model.hasMorePosts() && !this.isSearchActive) {
            this.view.showEndMessage();
        } else {
            this.view.hideEndMessage();
        }
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        clearTimeout(this.searchTimeout);
    }
}