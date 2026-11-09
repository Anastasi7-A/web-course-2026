class PostModel {
    constructor() {
        this.apiUrl = 'https://jsonplaceholder.typicode.com/posts';
        this.posts = [];           
        this.currentPage = 1; 
        this.limit = 10;   
        this.totalPosts = 100; 
        this.isLoading = false;
        this.searchQuery = '';
    }

    async fetchPosts() {
        if (this.isLoading) return null;
        if (this.posts.length >= this.totalPosts) return null;

        this.isLoading = true;



        try {
            const response = await fetch(
                `${this.apiUrl}?_page=${this.currentPage}&_limit=${this.limit}`
            );

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const newPosts = await response.json();

            this.posts = [...this.posts, ...newPosts];
            this.currentPage++;
            this.isLoading = false;

            return newPosts;
        } catch (error) {
            this.isLoading = false;
            throw error;
        }
    }

    getFilteredPosts() {
        if (!this.searchQuery.trim()) {
            return this.posts;
        }

        const query = this.searchQuery.toLowerCase();
        return this.posts.filter(post => 
            post.title.toLowerCase().includes(query)
        );
    }

    setSearchQuery(query) {
        this.searchQuery = query;
    }

    hasMorePosts() {
        return this.posts.length < this.totalPosts;
    }

    getLoadedCount() {
        return this.posts.length;
    }

    reset() {
        this.posts = [];
        this.currentPage = 1;
        this.searchQuery = '';
    }
}