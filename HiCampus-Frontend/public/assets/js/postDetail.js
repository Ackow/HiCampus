class ImageSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.image-slider');
        this.images = Array.from(this.slider.querySelectorAll('.detail-image'));
        this.indicators = container.querySelector('.image-indicators');
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.currentIndex = 0;

        this.init();
    }

    init() {
        // 创建指示器
        this.images.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicators.appendChild(indicator);
        });

        // 添加按钮事件监听
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // 初始化显示
        this.updateSlide();
    }

    updateSlide() {
        // 更新图片显示
        this.images.forEach((img, index) => {
            img.classList.toggle('active', index === this.currentIndex);
        });

        // 更新指示器
        const indicators = this.indicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // 更新按钮状态
        this.prevBtn.style.display = this.currentIndex === 0 ? 'none' : 'flex';
        this.nextBtn.style.display = this.currentIndex === this.images.length - 1 ? 'none' : 'flex';
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlide();
        }
    }

    nextSlide() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateSlide();
        }
    }
}

// 初始化图片轮播
document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.detail-image-container');
    if (imageContainer) {
        new ImageSlider(imageContainer);
    }
}); 