// ===================================
// KS IT Solution - Main JavaScript
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = mobileMenuBtn.contains(event.target) || mobileMenu.contains(event.target);
            if (!isClickInside && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    
    // ===================================
    // FAQ Accordion
    // ===================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.classList.add('hidden');
                        }
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                answer.classList.toggle('hidden');
            });
        }
    });
    
    
    // ===================================
    // Contact Form Validation & Submission
    // ===================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            // Validation
            if (!name || !phone || !subject || !message) {
                showMessage('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।', 'error');
                return;
            }
            
            // Phone validation (Bangladesh number)
            const cleanPhone = phone.replace(/[\s-]/g, '');
            const phoneRegex = /^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8})$/;
            if (!phoneRegex.test(cleanPhone)) {
                showMessage('সঠিক মোবাইল নম্বর দিন (যেমন: 01788213414 বা +8801788213414)', 'error');
                return;
            }
            
            // Email validation (if provided)
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showMessage('সঠিক ইমেইল ঠিকানা দিন।', 'error');
                    return;
                }
            }
            
            try {
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add('opacity-70', 'cursor-not-allowed');
                }

                const response = await fetch(contactForm.action, {
                    method: contactForm.method || 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showMessage('আপনার বার্তা সফলভাবে পাঠানো হয়েছে! শীঘ্রই আমরা যোগাযোগ করব।', 'success');
                    contactForm.reset();
                } else {
                    const result = await response.json().catch(() => null);
                    const errorText = result?.message || 'বার্তা পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
                    showMessage(errorText, 'error');
                }
            } catch (error) {
                showMessage('নেটওয়ার্ক সমস্যা হয়েছে। ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।', 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
                }

                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);
            }
        });
    }
    
    function showMessage(msg, type) {
        if (formMessage) {
            formMessage.textContent = msg;
            formMessage.classList.remove('hidden', 'text-green-600', 'text-red-600');
            formMessage.classList.add(type === 'success' ? 'text-green-600' : 'text-red-600');
        }
    }
    
    
    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    
    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.querySelector('nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    
    // ===================================
    // Intersection Observer for Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with loading class
    document.querySelectorAll('.loading').forEach(el => {
        observer.observe(el);
    });
    
    
    // ===================================
    // Back to Top Button (Optional)
    // ===================================
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.remove('hidden');
            } else {
                backToTop.classList.add('hidden');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    
    // ===================================
    // Package Card Hover Effects
    // ===================================
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('transform', 'scale-105');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('transform', 'scale-105');
        });
    });
    
    
    // ===================================
    // Copy Phone Number to Clipboard
    // ===================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('contextmenu', function(e) {
            // Right-click to copy
            const phone = this.textContent.trim();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(phone).then(() => {
                    // Show temporary tooltip
                    showTooltip(this, 'ফোন নম্বর কপি হয়েছে!');
                });
            }
        });
    });
    
    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.className = 'absolute bg-gray-800 text-white px-3 py-2 rounded text-sm z-50';
        tooltip.style.top = '-40px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }
    
    
    // ===================================
    // WhatsApp Message Generator
    // ===================================
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Optionally add a pre-filled message
            const currentUrl = this.getAttribute('href');
            if (!currentUrl.includes('text=')) {
                e.preventDefault();
                const message = encodeURIComponent('নমস্কার! আমি KS IT Solution সম্পর্কে জানতে চাই।');
                window.open(currentUrl + '?text=' + message, '_blank');
            }
        });
    });
    
    
    // ===================================
    // Print Functionality (Future Use)
    // ===================================
    window.printPage = function() {
        window.print();
    };
    
    
    // ===================================
    // Local Storage for User Preferences (Future Use)
    // ===================================
    function savePreference(key, value) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, value);
        }
    }
    
    function getPreference(key) {
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem(key);
        }
        return null;
    }
    
    
    // ===================================
    // Package Comparison (Future Feature)
    // ===================================
    window.comparePackages = function(package1, package2) {
        // Implementation for package comparison
        console.log('Comparing packages:', package1, package2);
    };
    
    
    // ===================================
    // Speed Test Calculator (Future Feature)
    // ===================================
    window.calculateSpeed = function(mbps) {
        // Convert Mbps to practical examples
        const results = {
            hd_streaming: Math.floor(mbps / 5),
            uhd_streaming: Math.floor(mbps / 25),
            downloads: (mbps / 8).toFixed(2) // MB/s
        };
        return results;
    };
    
    
    // ===================================
    // Form Input Formatting
    // ===================================
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 11 digits
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // Format as 01XXX-XXXXXX
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            }
            
            this.value = value;
        });
    });
    
    
    // ===================================
    // Image Lazy Loading (Native)
    // ===================================
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for older browsers
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    
    // ===================================
    // Console Welcome Message
    // ===================================
    console.log('%c🚀 KS IT Solution', 'color: #2563eb; font-size: 24px; font-weight: bold;');
    console.log('%cগাইবান্ধার নির্ভরযোগ্য ইন্টারনেট সেবা', 'color: #059669; font-size: 14px;');
    console.log('%cWebsite developed with ❤️', 'color: #6366f1; font-size: 12px;');
    
    
    // ===================================
    // Analytics (Future Integration)
    // ===================================
    window.trackEvent = function(category, action, label) {
        // Integration with Google Analytics or other analytics services
        console.log('Event tracked:', category, action, label);
    };
    
    
    // ===================================
    // Service Worker Registration (Future PWA)
    // ===================================
    if ('serviceWorker' in navigator) {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    }
    
    
    // ===================================
    // Performance Monitoring
    // ===================================
    window.addEventListener('load', function() {
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (pageLoadTime > 0) {
                console.log('Page load time:', (pageLoadTime / 1000).toFixed(2), 'seconds');
            }
        }
    });
    
    
    // ===================================
    // Error Handling
    // ===================================
    window.addEventListener('error', function(e) {
        console.error('Error occurred:', e.message);
        // Can send to error tracking service
    });
    
    
    // ===================================
    // Online/Offline Detection
    // ===================================
    window.addEventListener('online', function() {
        console.log('Internet connection restored');
        // Show notification to user
    });
    
    window.addEventListener('offline', function() {
        console.log('No internet connection');
        // Show notification to user
    });
    
});

// End of main.js
