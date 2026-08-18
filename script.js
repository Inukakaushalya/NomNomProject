/* =====================================================
   NOM NOM MENU
   JavaScript
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let cart = [];

let currentCategory = "all";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const welcomeScreen =
    document.getElementById("welcomeScreen");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const foodCards =
    document.querySelectorAll(".food-card");

const noResults =
    document.getElementById("noResults");

const cartBar =
    document.getElementById("cartBar");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const cartModal =
    document.getElementById("cartModal");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const modalTotal =
    document.getElementById("modalTotal");

const successModal =
    document.getElementById("successModal");

const orderNumber =
    document.getElementById("orderNumber");


/* =====================================================
   WELCOME SCREEN
===================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        welcomeScreen.classList.add("hide");

    }, 1800);

});


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    filterFood
);


function filterFood() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    let visibleCount = 0;


    foodCards.forEach(card => {

        const name =
            card.dataset.name
                .toLowerCase();

        const category =
            card.dataset.category;


        const matchesSearch =
            name.includes(searchTerm);

        const matchesCategory =
            currentCategory === "all" ||
            category === currentCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    if (visibleCount === 0) {

        noResults.style.display =
            "block";

    } else {

        noResults.style.display =
            "none";

    }


    if (searchTerm.length > 0) {

        clearSearch.style.display =
            "block";

    } else {

        clearSearch.style.display =
            "none";

    }

}


/* =====================================================
   CLEAR SEARCH
===================================================== */

clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        filterFood();

        searchInput.focus();

    }
);


/* =====================================================
   CATEGORY FILTER
===================================================== */

const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );


categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            currentCategory =
                button.dataset.category;


            filterFood();

        }
    );

});


/* =====================================================
   ADD FOOD TO CART
===================================================== */

function addToCart(
    name,
    price,
    image
) {

    const existingItem =
        cart.find(
            item =>
                item.name === name
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            image: image,

            quantity: 1

        });

    }


    updateCart();

    showCartBar();

    showToast(
        `${name} added ❤️`
    );

}


/* =====================================================
   ADD COMBO
===================================================== */

function addCombo(
    name,
    price
) {

    const existingItem =
        cart.find(
            item =>
                item.name === name
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            image: "",

            quantity: 1

        });

    }


    updateCart();

    showCartBar();

    showToast(
        "Combo added 🔥"
    );

}


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    let totalItems = 0;

    let totalPrice = 0;


    cart.forEach(item => {

        totalItems +=
            item.quantity;

        totalPrice +=
            item.price *
            item.quantity;

    });


    cartCount.textContent =
        totalItems;

    cartTotal.textContent =
        totalPrice;

    modalTotal.textContent =
        totalPrice;


    renderCart();


    if (totalItems > 0) {

        cartBar.classList.add(
            "show"
        );

    } else {

        cartBar.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartEmpty.style.display =
            "block";

        return;

    }


    cartEmpty.style.display =
        "none";


    cart.forEach(
        (item, index) => {

            const itemElement =
                document.createElement(
                    "div"
                );

            itemElement.className =
                "cart-item";


            const imageHTML =
                item.image

                    ?

                `<img
                    src="${item.image}"
                    alt="${item.name}"
                    class="cart-item-image"
                >`

                    :

                `<div
                    class="cart-item-image"
                    style="
                        display:grid;
                        place-items:center;
                        font-size:25px;
                    "
                >
                    🔥
                </div>`;


            itemElement.innerHTML = `

                ${imageHTML}

                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        Rs. ${item.price}
                    </p>

                </div>

                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity(
                            ${index},
                            -1
                        )"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(
                            ${index},
                            1
                        )"
                    >
                        +
                    </button>

                </div>

            `;


            cartItems.appendChild(
                itemElement
            );

        }
    );

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(
    index,
    amount
) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity +=
        amount;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }


    updateCart();

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    cartModal.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    cartModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder() {

    if (cart.length === 0) {

        showToast(
            "Please add some food first 🍜"
        );

        return;

    }


    /*
       Generate a random order number.

       Example:
       027
       148
       502
    */

    const number =
        Math.floor(
            100 +
            Math.random() * 900
        );


    orderNumber.textContent =
        number;


    closeCart();


    setTimeout(() => {

        successModal.classList.add(
            "show"
        );

    }, 300);


    /*
       IMPORTANT:

       This is currently only a
       front-end demonstration.

       If you want real orders to
       go to a database / WhatsApp /
       Google Sheets / Firebase,
       this function can be connected
       later.
    */

}


/* =====================================================
   CLOSE SUCCESS
===================================================== */

function closeSuccess() {

    successModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


/* =====================================================
   TOAST MESSAGE
===================================================== */

function showToast(message) {

    const existingToast =
        document.querySelector(
            ".toast"
        );


    if (existingToast) {

        existingToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(() => {

        toast.classList.add(
            "show"
        );

    }, 10);


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 1800);

}


/* =====================================================
   TOAST CSS
===================================================== */

const toastStyle =
    document.createElement(
        "style"
    );


toastStyle.textContent = `

    .toast {

        position: fixed;

        z-index: 9999;

        left: 50%;

        bottom: 85px;

        transform:
            translate(-50%, 20px);

        opacity: 0;

        padding:
            11px 18px;

        background:
            #19171c;

        color:
            white;

        border-radius:
            25px;

        font-size:
            13px;

        font-weight:
            700;

        box-shadow:
            0 8px 25px
            rgba(0,0,0,0.2);

        transition:
            0.3s ease;

        white-space:
            nowrap;
    }


    .toast.show {

        transform:
            translate(-50%, 0);

        opacity:
            1;
    }

`;

document.head.appendChild(
    toastStyle
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeCart();

            closeSuccess();

        }

    }
);


/* =====================================================
   IMAGE ERROR HANDLING
===================================================== */

document
    .querySelectorAll(".food-image")
    .forEach(image => {

        image.addEventListener("error", () => {

            image.style.display = "none";

            image.parentElement.style.background =
                "linear-gradient(135deg, #ffe4ea, #fff1b7)";

            image.parentElement.innerHTML +=
                '<span style="font-size:55px; display:grid; place-items:center; height:100%;">🍜</span>';

        });

    });