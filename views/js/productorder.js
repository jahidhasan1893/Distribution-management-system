// script.js

// JavaScript code for managing the order
const order = {};

function addToCart(productName, price, quantityInputId) {
    const quantity = parseInt(document.getElementById(quantityInputId).value);
    if (quantity > 0) {
        order[productName] = {
            quantity,
            price
        };
        updateOrderTable();
    }
}

function updateOrderTable() {
    const orderTable = document.getElementById("order-table");
    orderTable.innerHTML = "<tr><th>Product</th><th>Quantity</th><th>Price</th></tr>";
    let totalPrice = 0;
    for (const product in order) {
        const { quantity, price } = order[product];
        const row = orderTable.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = product;
        cell2.innerHTML = quantity;
        cell3.innerHTML = `$${quantity * price}`;
        totalPrice += quantity * price;
    }
    document.getElementById("total-price").textContent = totalPrice;
}

function calculateTotalPrice() {
    // Generate a dynamic order ID and date (you can implement this part)
    const orderDate = "Your Order Date";
    const orderID = "Your Order ID";

    // Update the cash memo with dynamic data
    document.getElementById("order-date").textContent = orderDate;
    document.getElementById("order-id").textContent = orderID;

    // You can now proceed to checkout or do other actions with the order data.
}
function downloadCashMemo() {

    console.log("button  clicked");
    // Generate a dynamic order ID, date, and customer information (you can implement this part)
    const orderDate = "Your Order Date";
    const orderID = "Your Order ID";
    const customerName = "Customer Name";
    const customerID = "Customer ID";

    // Extract order details from the table
    const orderTable = document.getElementById("order-table").outerHTML;

    // Create the content for the Cash Memo using HTML
    const cashMemoContent = `
        <h1>Cash Memo</h1>
        <p>Order Date: ${orderDate}</p>
        <p>Order ID: ${orderID}</p>
        <p>Customer Name: ${customerName}</p>
        <p>Customer ID: ${customerID}</p>

        <h2>Order Details</h2>
        ${orderTable}

        <p>Total: $${calculateTotalPrice()}</p>
    `;

    // Convert HTML to Word document using mammoth.js
    mammoth.convert({ 'value': cashMemoContent }, { 'convertImage': mammoth.images.dataUri })
        .then(function (result) {
            // Create a Blob with the Word document content
            const blob = new Blob([result.value], { type: "application/msword" });

            // Create a download link
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "CashMemo.docx";
            a.click();
        })
        .catch(function (error) {
            console.log(error);
        });
}