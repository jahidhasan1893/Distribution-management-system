let slideIndex = 0;

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    slideIndex++;
    
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    slides[slideIndex - 1].style.display = "block";
    
    setTimeout(showSlides, 2000); // Change image every 2 seconds (2000 milliseconds)
}

showSlides(); // Call the function to start the slideshow

setTimeout(() => {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = ''; // Clear existing images

    const newImages = [
        'images/moyda1.png',
        'images/rice1.png',
        'images/water1.png'
    ];

    newImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'New Image';
        imageContainer.appendChild(img);
    });
}, 3000); // Replace images after 3 seconds
