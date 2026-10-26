document.addEventListener('DOMContentLoaded', () => {
    const model = new PostModel();
    const view = new PostView();
    const controller = new PostController(model, view);

    controller.init();
});