
document.addEventListener("DOMContentLoaded", function () {
    // Get HTML elements
    const navbar = document.querySelector(".navbar");
    const searchInput = document.querySelector(".search input");
    const searchButton = document.querySelector(".search button");
    const sortSelect = document.getElementById("sort-products");
    const productGrid = document.querySelector(".product-grid");
    const productSection = document.querySelector(".products-section");
    const cartElement = document.querySelector(".cart");
    const heroContent = document.querySelector(".hero-content");
    const categoryCards = document.querySelectorAll(".category");

    if (!productGrid || !productSection) {
        console.error("Product grid not found. Check index.html.");
        return;
    }

    // Fix the product grid structure in the existing HTML
    // This moves the product cards into the grid automatically.
    const productCards = Array.from(
        productSection.querySelectorAll(".product-card")
    );

    productCards.forEach(function (card, index) {
        productGrid.appendChild(card);
        card.dataset.originalIndex = index;

        const name = card.querySelector("h3")
            ?.textContent.trim().toLowerCase() || "";

        // Assign product categories
        if (
            name.includes("earphones") ||
            name.includes("headphones") ||
            name.includes("smart watch")
        ) {
            card.dataset.category = "Electronics";
        } else if (
            name.includes("running shoes") ||
            name.includes("backpack")
        ) {
            card.dataset.category = "Fashion";
        } else if (
            name.includes("kettle") ||
            name.includes("cushion")
        ) {
            card.dataset.category = "Home";
        } else if (name.includes("face care")) {
            card.dataset.category = "Beauty";
        } else if (name.includes("smartphone")) {
            card.dataset.category = "Mobiles";
        } else if (
            name.includes("planner") ||
            name.includes("data science guide")
        ) {
            card.dataset.category = "Books";
        } else if (
            name.includes("yoga mat") ||
            name.includes("badminton")
        ) {
            card.dataset.category = "Sports";
        } else {
            card.dataset.category = "Other";
        }

        // Store product price for sorting
        const priceElement = card.querySelector(".price");
        const price = priceElement
            ? Number(priceElement.textContent.replace(/[^\d.]/g, ""))
            : 0;

        card.dataset.price = price;
    });

    // CART COUNT
    let cartCount = 0;

    if (cartElement) {
        cartElement.innerHTML =
            '🛒 Cart <span id="cart-count">0</span>';
    }

    // Display notification messages
    function showMessage(message) {
        let notice = document.getElementById("store-notice");

        if (!notice) {
            notice = document.createElement("div");
            notice.id = "store-notice";
            notice.style.cssText =
                "position:fixed;right:20px;bottom:20px;" +
                "background:#232f3e;color:white;padding:12px 18px;" +
                "border-radius:6px;z-index:1000;";
            document.body.appendChild(notice);
        }

        notice.textContent = message;
        notice.hidden = false;

        clearTimeout(showMessage.timer);

        showMessage.timer = setTimeout(function () {
            notice.hidden = true;
        }, 2000);
    }

    // ADD TO CART
    productGrid.addEventListener("click", function (event) {
        const button = event.target.closest(".add-cart");

        if (!button) return;

        const card = button.closest(".product-card");
        const productName =
            card.querySelector("h3").textContent.trim();

        cartCount++;

        const countElement = document.getElementById("cart-count");

        if (countElement) {
            countElement.textContent = cartCount;
        }

        showMessage(productName + " added to cart!");
    });

    // SEARCH AND CATEGORY FILTERING
    let activeCategory = "All";

    function filterProducts() {
        const query = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        productCards.forEach(function (card) {
            const name =
                card.querySelector("h3").textContent.toLowerCase();

            const category = card.dataset.category.toLowerCase();

            const matchesSearch = name.includes(query);

            const matchesCategory =
                activeCategory === "All" ||
                category === activeCategory.toLowerCase();

            card.hidden = !(matchesSearch && matchesCategory);

            if (!card.hidden) {
                visibleCount++;
            }
        });

        let message =
            document.getElementById("search-results-message");

        if (!message) {
            message = document.createElement("p");
            message.id = "search-results-message";
            message.style.padding = "0 25px";
            productSection.insertBefore(message, productGrid);
        }

        message.textContent = visibleCount === 0
            ? "No products found. Try another search."
            : "Showing " + visibleCount + " product(s)";
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);

        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                filterProducts();
                productSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener("click", function () {
            filterProducts();

            productSection.scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    // Filter products by category
    function setCategory(category) {
        activeCategory = category;
        filterProducts();

        productSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // CATEGORY CARDS
    categoryCards.forEach(function (card) {
        card.style.cursor = "pointer";

        const heading = card.querySelector("h3");
        const category = heading
            ? heading.textContent.trim()
            : "All";

        card.addEventListener("click", function () {
            setCategory(category);
        });

        card.setAttribute("tabindex", "0");

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setCategory(category);
            }
        });
    });

    // NAVIGATION LINKS
    if (navbar) {
        navbar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function (event) {
                const label = link.textContent.trim().toLowerCase();

                const categories = [
                    "electronics",
                    "fashion",
                    "home",
                    "books",
                    "sports",
                    "beauty",
                    "mobiles"
                ];

                if (categories.includes(label)) {
                    event.preventDefault();
                    setCategory(
                        label.charAt(0).toUpperCase() + label.slice(1)
                    );
                } else if (
                    label.includes("today") ||
                    label.includes("best seller")
                ) {
                    event.preventDefault();
                    setCategory("All");
                }
            });
        });
    }

    // PRODUCT SORTING
    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            const cards = Array.from(
                productGrid.querySelectorAll(".product-card")
            );

            if (sortSelect.value === "low-high") {
                cards.sort(function (a, b) {
                    return Number(a.dataset.price) -
                        Number(b.dataset.price);
                });
            } else if (sortSelect.value === "high-low") {
                cards.sort(function (a, b) {
                    return Number(b.dataset.price) -
                        Number(a.dataset.price);
                });
            } else {
                cards.sort(function (a, b) {
                    return Number(a.dataset.originalIndex) -
                        Number(b.dataset.originalIndex);
                });
            }

            cards.forEach(function (card) {
                productGrid.appendChild(card);
            });

            filterProducts();
        });
    }

    // ALL BUTTON: CATEGORY MENU
    const allButton = navbar
        ? Array.from(navbar.querySelectorAll("button")).find(
            button => button.textContent.trim().toLowerCase().includes("all")
        )
        : null;

    if (allButton) {
        const menu = document.createElement("div");

        menu.id = "category-menu";
        menu.style.cssText =
            "display:none;background:white;padding:12px;" +
            "border:1px solid #ddd;gap:10px;flex-wrap:wrap;";

        [
            "All",
            "Electronics",
            "Fashion",
            "Home",
            "Beauty",
            "Mobiles",
            "Books",
            "Sports"
        ].forEach(function (category) {
            const button = document.createElement("button");

            button.textContent = category;
            button.type = "button";

            button.addEventListener("click", function () {
                setCategory(category);
                menu.style.display = "none";
                allButton.setAttribute("aria-expanded", "false");
            });

            menu.appendChild(button);
        });

        navbar.insertAdjacentElement("afterend", menu);

        allButton.setAttribute("aria-expanded", "false");

        allButton.addEventListener("click", function () {
            const isOpen = menu.style.display === "flex";

            menu.style.display = isOpen ? "none" : "flex";

            allButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
        });
    }

    // HERO BANNER SLIDER
    if (heroContent) {
        const slides = [
            {
                eyebrow: "BIG SAVINGS",
                title: "Discover Amazing Deals",
                description:
                    "Shop electronics, fashion, home essentials and more."
            },
            {
                eyebrow: "SMART SHOPPING",
                title: "Everyday Essentials at Great Prices",
                description:
                    "Explore products for study, home, fitness and travel."
            },
            {
                eyebrow: "FIND YOUR FAVOURITES",
                title: "Something for Everyone",
                description:
                    "Browse categories and discover your next favourite product."
            }
        ];

        const eyebrow =
            heroContent.querySelector("p:first-child");
        const title = heroContent.querySelector("h1");
        const paragraphs = heroContent.querySelectorAll("p");
        const description =
            paragraphs.length > 1 ? paragraphs[1] : null;
        const shopButton = heroContent.querySelector("button");

        let slideIndex = 0;

        function showSlide(index) {
            const slide = slides[index];

            if (eyebrow) eyebrow.textContent = slide.eyebrow;
            if (title) title.textContent = slide.title;

            if (description) {
                description.textContent = slide.description;
            }
        }

        setInterval(function () {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        }, 5000);

        if (shopButton) {
            shopButton.addEventListener("click", function () {
                productSection.scrollIntoView({
                    behavior: "smooth"
                });
            });
        }
    }

    // FOOTER
    // Adds a footer automatically if there is no footer in HTML.
    if (!document.querySelector("footer")) {
        const footer = document.createElement("footer");

        footer.innerHTML = `
            <div class="footer-content">
                <div>
                    <h3>LARA STORE</h3>
                    <p>Your destination for everyday shopping.</p>
                </div>

                <div>
                    <h4>Shop</h4>
                    <a href="#products">All Products</a>
                    <a href="#products">Electronics</a>
                    <a href="#products">Fashion</a>
                </div>

                <div>
                    <h4>Customer Support</h4>
                    <p>Help and Support</p>
                    <p>Returns and Orders</p>
                </div>
            </div>

            <p class="footer-bottom">
                © ${new Date().getFullYear()} LARA STORE.
                Student project for educational purposes.
            </p>
        `;

        footer.style.cssText =
            "background:#232f3e;color:white;padding:25px 20px;" +
            "margin-top:30px;";

        footer.querySelector(".footer-content").style.cssText =
            "display:flex;justify-content:space-around;" +
            "gap:25px;flex-wrap:wrap;";

        footer.querySelectorAll("a").forEach(function (link) {
            link.style.cssText =
                "display:block;color:white;margin:8px 0;";

            link.addEventListener("click", function (event) {
                event.preventDefault();

                const label = link.textContent.trim().toLowerCase();

                if (label === "electronics" || label === "fashion") {
                    setCategory(
                        label.charAt(0).toUpperCase() + label.slice(1)
                    );
                } else {
                    setCategory("All");
                }
            });
        });

        footer.querySelector(".footer-bottom").style.cssText =
            "text-align:center;border-top:1px solid #52606d;" +
            "padding-top:15px;margin-top:20px;";

        document.body.appendChild(footer);
    }

    // Show all products when the page first loads
    filterProducts();
});
