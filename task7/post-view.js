class PostView {
    constructor() {
       
        this.postsContainer = document.getElementById('postsContainer');
        this.loader = document.getElementById('loader');
        this.endMessage = document.getElementById('endMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.postsCount = document.getElementById('postsCount');
        this.searchInput = document.getElementById('searchInput');
        this.scrollTrigger = document.getElementById('scrollTrigger');
    }

    createPostCard(post) {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <h2>${this.escapeHtml(post.title)}</h2>
            <p class="post-body">${this.escapeHtml(post.body)}</p>
            <p class="post-author">Автор (userId): ${post.userId}</p>
        `;
        return card;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    renderPosts(posts) {
        const fragment = document.createDocumentFragment();
        posts.forEach(post => {
            fragment.appendChild(this.createPostCard(post));
        });
        this.postsContainer.appendChild(fragment);
    }

    rerenderPosts(posts) {
        this.postsContainer.innerHTML = '';
        this.renderPosts(posts);
    }

    updatePostsCount(loaded, total) {
        this.postsCount.textContent = `Загружено: ${loaded} / ${total}`;
    }

    showLoader() {
        this.loader.classList.remove('hidden');
    }

    hideLoader() {
        this.loader.classList.add('hidden');
    }

    showEndMessage() {
        this.endMessage.classList.remove('hidden');
    }

    hideEndMessage() {
        this.endMessage.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = `Ошибка: ${message}`;
        this.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    clearSearch() {
        this.searchInput.value = '';
    }
}