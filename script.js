function generateQR() {
    let url = document.getElementById("url").value.trim();
    let name = document.getElementById("qrname").value.trim();

    if (!url || !name) {
        alert("Please enter both URL and QR name");
        return;
    }

    new QRious({
        element: document.getElementById("qrCanvas"),
        value: url,
        size: 300
    });

    document.getElementById("qrNameDisplay").textContent = name;
}

function downloadQR() {
    let canvas = document.getElementById("qrCanvas");
    let qrName = document.getElementById("qrNameDisplay").textContent || "qrcode";

    let link = document.createElement("a");
    link.download = qrName + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// Popup
function openAddPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closeAddPopup() {
    document.getElementById("popup").style.display = "none";
}


// ADD PRODUCT
function addProduct() {

    let name = document.getElementById("newProductName").value;
    let imageFile = document.getElementById("newProductImage").files[0];

    if (!name || !imageFile) {
        alert("Please enter product name and image");
        return;
    }

    let reader = new FileReader();

    reader.onload = function(event) {
        fetch("http://localhost:3000/add-product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                imageBase64: event.target.result
            })
        })
        .then(res => res.json())
        .then(result => {

            let grid = document.getElementById("productGrid");
            let addBtnCard = document.querySelector(".add-new");

            let card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-id", result.product.id);

            card.innerHTML = `
                <button class="delete-btn" onclick="removeProduct(this)">×</button>
                <img src="${result.product.imageBase64}">
                <h3>${result.product.name}</h3>
            `;

            grid.insertBefore(card, addBtnCard);
            closeAddPopup();  // popup closes properly
        });
    };

    reader.readAsDataURL(imageFile);
}

// LOAD PRODUCTS
window.onload = loadProducts;

function loadProducts() {
    fetch("http://localhost:3000/products")
    .then(res => res.json())
    .then(products => {

        let grid = document.getElementById("productGrid");
        let addBtnCard = document.querySelector(".add-new");

        products.forEach(p => {
            let card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-id", p.id);

            card.innerHTML = `
                <button class="delete-btn" onclick="removeProduct(this)">×</button>
                <img src="${p.imageBase64}">
                <h3>${p.name}</h3>
            `;

            grid.insertBefore(card, addBtnCard);
        });
    });
}


// DELETE PRODUCT
function removeProduct(btn) {

    let card = btn.parentElement;
    let id = card.getAttribute("data-id");

    fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            card.remove(); // remove from UI
        }
    });
}
