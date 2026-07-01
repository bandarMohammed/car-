// --------------------------------------------------------------------------
//                         Fermi Luxury Motors - Core Logic
// --------------------------------------------------------------------------

// 1. البيانات الأساسية للسيارات الافتراضية
const defaultCars = [
    {
        id: 1,
        brand: "Ferrari",
        name: "Ferrari SF90 Stradale",
        arabicName: "فيراري SF90 سترادال",
        year: "2026",
        price: 1850000,
        mileage: "0",
        engine: "هايبرد",
        image: "assets/ferrari_sf90.png",
        desc: "أيقونة السرعة والهندسة الإيطالية الفائقة. سيارة فيراري SF90 سترادال هايبرد بقوة إجمالية تبلغ 1000 حصان، تسارع من 0 إلى 100 كم/س في 2.5 ثانية فقط. تتميز بلون أحمر فيراري الأصلي، مقصورة من ألياف الكربون الفاخرة وجلد ألكانتارا، مع أحدث أنظمة القيادة الديناميكية المتكاملة.",
        status: "جديدة كلياً"
    },
    {
        id: 2,
        brand: "Porsche",
        name: "Porsche 911 GT3 RS",
        arabicName: "بورشه 911 جي تي 3 آر إس",
        year: "2025",
        price: 1250000,
        mileage: "1,200",
        engine: "بنزين",
        image: "assets/porsche_911.png",
        desc: "وحش الحلبات المهيأ للطرقات العامة. بورشه 911 GT3 RS بمحرك سحب طبيعي بسعة 4.0 لتر يولد قوة 525 حصان وسقف ديناميكي متطور لزيادة القوة الضاغطة السفلى. طلاء فضي ميتاليك فاخر، جنوط رياضية خفيفة الوزن وحزمة ويساش (Weissach Package) الخاصة للأداء الفائق.",
        status: "شبه جديدة"
    },
    {
        id: 3,
        brand: "Mercedes",
        name: "Mercedes-Benz G63 AMG",
        arabicName: "مرسيدس جي 63 إيه إم جي",
        year: "2025",
        price: 980000,
        mileage: "4,500",
        engine: "بنزين",
        image: "assets/mercedes_g63.png",
        desc: "رمز الهيبة والقوة على مختلف التضاريس. مرسيدس-بنز G63 AMG بلون أسود مطفي (Matte Black) فاخر وإصدار حصرى Night Edition. محرك V8 ثنائي التوربو يولد قوة 577 حصان، مقصورة جلدية فاخرة بنقش ديزاينو الحصري باللون الأحمر والأسود، ونظام صوتي محيطي ثلاثي الأبعاد Burmester.",
        status: "شبه جديدة"
    },
    {
        id: 4,
        brand: "Tesla",
        name: "Tesla Roadster",
        arabicName: "تيسلا رودستر",
        year: "2026",
        price: 920000,
        mileage: "0",
        engine: "كهربائي",
        image: "assets/tesla_roadster.png",
        desc: "أسرع تسارع لسيارة إنتاجية في العالم. تيسلا رودستر الكهربائية بالكامل، تسارع خارق من 0 إلى 100 كم/س في غضون 2.1 ثانية فقط ومدى قيادة هائل يصل إلى 1000 كم في الشحنة الواحدة. سقف زجاجي بانورامي قابل للإزالة، تصميم مستقبلي انسيابي فريد ومقصورة ذكية متكاملة.",
        status: "جديدة كلياً"
    }
];

// تهيئة المتغيرات الأساسية للمشروع
let carsList = [];
let uploadedImageBase64 = "";

// 2. عند تحميل الصفحة (Initialization)
document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    loadCars();
    renderGallery(carsList);
    setupEventListeners();
    setupScrollProgress();
    setupRevealAnimations();
    setupActiveNav();
});

// شاشة التحميل
function initPreloader() {
    const preloader = document.getElementById("preloader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            preloader.classList.add("hidden");
            document.body.style.overflow = "";
            animateCounters();
        }, 1700);
    });
    document.body.style.overflow = "hidden";
}

// شريط تقدم التمرير
function setupScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (scrolled / total * 100) + "%";

        // تأثير الهيدر عند التمرير
        const header = document.querySelector(".header");
        header.classList.toggle("scrolled", scrolled > 50);
    }, { passive: true });
}

// أنيميشن الظهور عند التمرير
function setupRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// تفعيل الرابط في القائمة بناءً على القسم المرئي
function setupActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove("active"));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add("active");
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));
}

// عداد متحرك للإحصائيات
function animateCounters() {
    const counters = document.querySelectorAll(".stat-card h3");
    counters.forEach(el => {
        const text = el.textContent.trim();
        const num = parseFloat(text.replace(/[^0-9.]/g, ""));
        const prefix = text.match(/^[^0-9]*/)[0];
        const suffix = text.match(/[^0-9.]*$/)[0];
        const isDecimal = text.includes(".");
        let start = 0;
        const duration = 1800;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = eased * num;
            el.textContent = prefix + (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

// تحميل البيانات من LocalStorage ودمجها مع البيانات الافتراضية
function loadCars() {
    const storedCars = localStorage.getItem("fermi_cars");
    if (storedCars) {
        try {
            const parsedCars = JSON.parse(storedCars);
            // ندمج السيارات المضافة من المستخدم لتعرض أولاً ثم السيارات الافتراضية
            carsList = [...parsedCars, ...defaultCars];
        } catch (e) {
            console.error("Error parsing stored cars:", e);
            carsList = [...defaultCars];
        }
    } else {
        carsList = [...defaultCars];
    }
}

// 3. دالة رسم شبكة المعرض (Render Gallery)
function renderGallery(cars) {
    const galleryContainer = document.getElementById("car-gallery");
    const noResults = document.getElementById("no-results");
    
    // تفريغ المعرض
    galleryContainer.innerHTML = "";
    
    const countEl = document.getElementById("results-count");

    if (cars.length === 0) {
        noResults.classList.remove("hidden");
        galleryContainer.classList.add("hidden");
        if (countEl) countEl.innerHTML = "";
        return;
    }

    noResults.classList.add("hidden");
    galleryContainer.classList.remove("hidden");
    if (countEl) countEl.innerHTML = `عرض <span>${cars.length}</span> سيارة`;
    
    cars.forEach(car => {
        const carCard = document.createElement("div");
        carCard.className = "car-card";
        carCard.setAttribute("data-id", car.id);
        
        // تنسيق السعر بالأرقام العربية الأنيقة والفاصلة
        const formattedPrice = car.price.toLocaleString("ar-SA");
        
        carCard.innerHTML = `
            <div class="car-card-img-wrapper">
                <img src="${car.image}" alt="${car.arabicName || car.name}" onerror="this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'">
                <span class="car-card-badge">${car.status || "فاخرة"}</span>
            </div>
            <div class="car-card-content">
                <span class="car-card-brand">${translateBrandToArabic(car.brand)}</span>
                <h3 class="car-card-title">${car.arabicName || car.name}</h3>
                <div class="car-card-specs">
                    <span class="spec-pill"><i class="fa-solid fa-calendar-day"></i> ${car.year}</span>
                    <span class="spec-pill"><i class="fa-solid fa-gauge"></i> ${car.mileage} كم</span>
                    <span class="spec-pill"><i class="fa-solid fa-charging-station"></i> ${car.engine}</span>
                </div>
                <div class="car-card-footer">
                    <div class="car-card-price">
                        <span class="price-unit">السعر المطلوبة</span>
                        <span class="price-tag">${formattedPrice} <span style="font-size:0.8rem; font-weight:600;">ريال</span></span>
                    </div>
                    <button class="btn btn-outline btn-view-details" onclick="openCarModal(${car.id})">
                        عرض التفاصيل <i class="fa-solid fa-arrow-left" style="margin-right: 5px; font-size: 0.8rem;"></i>
                    </button>
                </div>
            </div>
        `;
        galleryContainer.appendChild(carCard);

        // أنيميشن ظهور البطاقة بتأخير متسلسل
        setTimeout(() => {
            carCard.style.opacity = "0";
            carCard.style.transform = "translateY(30px)";
            carCard.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    carCard.style.opacity = "1";
                    carCard.style.transform = "translateY(0)";
                });
            });
        }, 0);
    });
}

// 4. منطق التصفية والبحث (Filtering Logic)
function applyFilters() {
    const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
    const brandFilter = document.getElementById("brand-filter").value;
    const priceFilter = document.getElementById("price-filter").value;
    const yearFilter = document.getElementById("year-filter").value;
    
    const filtered = carsList.filter(car => {
        // تصفية البحث بالاسم
        const matchSearch = car.name.toLowerCase().includes(searchQuery) || 
                            (car.arabicName && car.arabicName.toLowerCase().includes(searchQuery)) ||
                            car.brand.toLowerCase().includes(searchQuery) ||
                            translateBrandToArabic(car.brand).includes(searchQuery);
                            
        // تصفية الماركة
        const matchBrand = (brandFilter === "all" || car.brand.toLowerCase() === brandFilter.toLowerCase());
        
        // تصفية السعر
        let matchPrice = true;
        if (priceFilter === "under-500k") {
            matchPrice = car.price < 500000;
        } else if (priceFilter === "500k-1m") {
            matchPrice = car.price >= 500000 && car.price <= 1000000;
        } else if (priceFilter === "above-1m") {
            matchPrice = car.price > 1000000;
        }
        
        // تصفية السنة
        const matchYear = (yearFilter === "all" || car.year === yearFilter);
        
        return matchSearch && matchBrand && matchPrice && matchYear;
    });
    
    renderGallery(filtered);
}

// 5. إعداد مستمعي الأحداث (Event Listeners Setup)
function setupEventListeners() {
    // تفعيل قائمة التنقل بالهواتف المحمولة
    const mobileMenuBtn = document.querySelector(".mobile-nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    
    mobileMenuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        const icon = mobileMenuBtn.querySelector("i");
        if (navMenu.classList.contains("open")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // إغلاق قائمة الهامبرغر عند النقر على أي رابط
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            mobileMenuBtn.querySelector("i").className = "fa-solid fa-bars";
            
            // تغيير الرابط الفعال
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // البحث والتصفية الفورية
    document.getElementById("search-input").addEventListener("input", applyFilters);
    document.getElementById("brand-filter").addEventListener("change", applyFilters);
    document.getElementById("price-filter").addEventListener("change", applyFilters);
    document.getElementById("year-filter").addEventListener("change", applyFilters);
    
    // زر إعادة تعيين التصفية
    document.getElementById("reset-filters").addEventListener("click", () => {
        document.getElementById("search-input").value = "";
        document.getElementById("brand-filter").value = "all";
        document.getElementById("price-filter").value = "all";
        document.getElementById("year-filter").value = "all";
        renderGallery(carsList);
    });

    // إغلاق النافذة المنبثقة عند الضغط على زر الإغلاق أو الخلفية
    const modal = document.getElementById("car-modal");
    document.querySelector(".modal-close-btn").addEventListener("click", closeCarModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeCarModal();
        }
    });

    // معالجة ملف رفع الصورة وعرض المعاينة
    const imageInput = document.getElementById("form-image");
    const previewContainer = document.getElementById("image-preview-container");
    const previewImg = document.getElementById("image-preview");
    const removePreviewBtn = document.getElementById("remove-preview-btn");
    const fileUploadTrigger = document.querySelector(".file-upload-trigger");

    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            // التحقق من حجم الملف (الحد الأقصى 2.5 ميجابايت لتخزين LocalStorage بكفاءة)
            if (file.size > 2.5 * 1024 * 1024) {
                alert("يرجى اختيار صورة أصغر من 2.5 ميجابايت لضمان سرعة المعالجة والحفظ.");
                imageInput.value = "";
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadedImageBase64 = event.target.result;
                previewImg.src = uploadedImageBase64;
                previewContainer.classList.remove("hidden");
                fileUploadTrigger.classList.add("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // زر إزالة الصورة من المعاينة
    removePreviewBtn.addEventListener("click", () => {
        imageInput.value = "";
        uploadedImageBase64 = "";
        previewContainer.classList.add("hidden");
        fileUploadTrigger.classList.remove("hidden");
    });

    // منطق إرسال نموذج إضافة سيارة
    const sellCarForm = document.getElementById("sell-car-form");
    sellCarForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const brand = document.getElementById("form-brand").value;
        const modelName = document.getElementById("form-model").value;
        const year = document.getElementById("form-year").value;
        const price = parseInt(document.getElementById("form-price").value);
        const mileage = parseInt(document.getElementById("form-mileage").value).toLocaleString("ar-SA");
        const engine = document.getElementById("form-engine").value;
        const desc = document.getElementById("form-desc").value || "سيارة فاخرة ممتازة بحالة الوكالة ومواصفات وتجهيزات متكاملة.";
        
        if (!uploadedImageBase64) {
            alert("يرجى رفع صورة للسيارة لإتمام عملية الإدراج.");
            return;
        }

        // إنشاء كائن سيارة جديدة
        const newCar = {
            id: Date.now(), // استخدام التوقيت كمعرف فريد
            brand: brand,
            name: `${brand} ${modelName}`,
            arabicName: `${translateBrandToArabic(brand)} ${modelName}`,
            year: year,
            price: price,
            mileage: mileage,
            engine: engine,
            image: uploadedImageBase64,
            desc: desc,
            status: "معروضة حديثاً"
        };

        // الحصول على قائمة سيارات المستخدم الحالية وحفظها في LocalStorage
        let storedCars = localStorage.getItem("fermi_cars");
        let userCars = storedCars ? JSON.parse(storedCars) : [];
        userCars.unshift(newCar); // إضافة السيارة الجديدة في البداية
        
        localStorage.setItem("fermi_cars", JSON.stringify(userCars));
        
        // إعادة تحميل القائمة ورسمها
        loadCars();
        renderGallery(carsList);
        
        // إعادة تعيين النموذج وإظهار رسالة النجاح الفاخرة
        sellCarForm.reset();
        uploadedImageBase64 = "";
        previewContainer.classList.add("hidden");
        fileUploadTrigger.classList.remove("hidden");
        
        // التمرير بسلاسة إلى صالة العرض لمشاهدة السيارة المضافة
        setTimeout(() => {
            document.getElementById("showroom").scrollIntoView({ behavior: "smooth" });
            
            // تنبيه نجاح مخصص
            showToast(`تم إدراج سيارتك ${newCar.arabicName} بنجاح في صالة العرض الفاخرة!`);
        }, 300);
    });
}

// 6. منطق النافذة المنبثقة للتفاصيل (Modal Logic)
function openCarModal(carId) {
    const car = carsList.find(c => c.id === carId);
    if (!car) return;
    
    const modal = document.getElementById("car-modal");
    
    // تعبئة البيانات في المودال ديناميكياً
    document.getElementById("modal-car-image").src = car.image;
    document.getElementById("modal-car-image").alt = car.arabicName || car.name;
    document.getElementById("modal-car-brand-badge").textContent = translateBrandToArabic(car.brand);
    document.getElementById("modal-car-name").textContent = car.arabicName || car.name;
    document.getElementById("modal-car-price").textContent = `${car.price.toLocaleString("ar-SA")} ريال`;
    
    document.getElementById("modal-car-year").textContent = car.year;
    document.getElementById("modal-car-mileage").textContent = `${car.mileage} كم`;
    document.getElementById("modal-car-engine").textContent = car.engine;
    document.getElementById("modal-car-status").textContent = car.status || "حالة ممتازة";
    document.getElementById("modal-car-desc").textContent = car.desc;
    
    // إعداد رابط واتساب برسالة تفاعلية ذكية
    const whatsappMessage = encodeURIComponent(
        `السلام عليكم ورحمة الله وبركاته، أنا مهتم بشراء سيارة [${car.arabicName || car.name}] موديل [${car.year}] المعروضة في صالة فيرمي للسيارات الفاخرة. أرجو إفادتي بمدى توفرها وإجراءات الشراء. وشكراً.`
    );
    // محاكاة رقم واتساب فاخر للشركة
    document.getElementById("modal-whatsapp-btn").href = `https://wa.me/966114009000?text=${whatsappMessage}`;
    
    // تهيئة زر حجز تجربة قيادة
    const bookBtn = document.getElementById("modal-book-btn");
    bookBtn.onclick = () => {
        alert(`شكراً لاهتمامك بـ ${car.arabicName || car.name}. تم تسجيل طلبك لحجز تجربة القيادة، سيتواصل معك أحد مستشاري المبيعات النخبة خلال 24 ساعة لتأكيد الموعد.`);
    };

    // إظهار المودال بالانتقال السلس
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // منع سكرول الصفحة الرئيسية خلف النافذة
}

function closeCarModal() {
    const modal = document.getElementById("car-modal");
    modal.classList.add("hidden");
    document.body.style.overflow = ""; // استعادة سكرول الصفحة الرئيسية
}

// 7. دالة إظهار التنبيه الفاخر (Toast Notification)
function showToast(message) {
    // التحقق من وجود توست قديم وإزالته
    const oldToast = document.querySelector(".custom-toast");
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check" style="color:#d4af37; font-size:1.3rem;"></i>
        <span>${message}</span>
    `;
    
    // تنسيق التوست بالـ CSS ديناميكياً
    Object.assign(toast.style, {
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%) translateY(100px)",
        background: "rgba(15, 15, 21, 0.95)",
        border: "1px solid #d4af37",
        color: "#ffffff",
        padding: "16px 30px",
        borderRadius: "16px",
        zIndex: "9999",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.2)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontWeight: "600",
        fontFamily: "'Cairo', sans-serif",
        fontSize: "0.95rem",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
    });
    
    document.body.appendChild(toast);
    
    // حركة الدخول
    setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(0)";
    }, 50);
    
    // الخروج والتدمير تلقائياً بعد 4 ثوانٍ
    setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(100px)";
        toast.style.opacity = "0";
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4500);
}

// 8. دوال مساعدة (Helper Functions)
function translateBrandToArabic(brand) {
    const brands = {
        "Ferrari": "فيراري",
        "Porsche": "بورشه",
        "Mercedes": "مرسيدس",
        "Tesla": "تيسلا",
        "BMW": "بي إم دبليو",
        "Lamborghini": "لامبورغيني",
        "Aston Martin": "أستون مارتن"
    };
    return brands[brand] || brand;
}
