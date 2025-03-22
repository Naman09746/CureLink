document.addEventListener('DOMContentLoaded', function () {
    fetchBills();

    // Set the current date and time in the orderDate field
    const orderDateField = document.getElementById('orderDate');
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000; // Convert offset to milliseconds
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    orderDateField.value = localISOTime;

    // Add event listeners for calculating the total amount
    document.getElementById('quantity').addEventListener('input', calculateTotal);
    document.getElementById('discount').addEventListener('input', calculateTotal);
    document.getElementById('tax').addEventListener('input', calculateTotal);
});

function calculateTotal() {
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const tax = parseFloat(document.getElementById('tax').value) || 0;

    // Assuming a fixed price for the item, you can modify this as needed
    const itemPrice = 100; // Example price
    const subtotal = quantity * itemPrice;
    const total = subtotal - discount + (subtotal * (tax / 100));

    document.getElementById('totalAmount').value = total.toFixed(2);
}

function submitOrder() {
    const order = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerEmail: document.getElementById('customerEmail').value,
        itemName: document.getElementById('itemName').value,
        orderId: document.getElementById('orderId').value,
        orderDate: document.getElementById('orderDate').value,
        quantity: document.getElementById('quantity').value,
        discount: document.getElementById('discount').value,
        tax: document.getElementById('tax').value,
        totalAmount: document.getElementById('totalAmount').value,
        paymentMethod: document.getElementById('paymentMethod').value
    };

    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        alert('Order submitted successfully!');
        fetchBills();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchBills() {
    fetch('/api/orders')
    .then(response => response.json())
    .then(data => {
        const billsList = document.getElementById('bills-list');
        billsList.innerHTML = '';
        data.forEach(bill => {
            const billElement = document.createElement('div');
            billElement.className = 'bill';
            billElement.innerHTML = `
                <h3>Order ID: ${bill.orderId}</h3>
                <p>Customer: ${bill.customerName}</p>
                <p>Item: ${bill.itemName}</p>
                <p>Total Amount: $${bill.totalAmount}</p>
                <p>Payment Method: ${bill.paymentMethod}</p>
            `;
            billsList.appendChild(billElement);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function printBill() {
    // Get the bill template
    const billTemplate = document.getElementById('bill-template').innerHTML;

    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Bill</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body { font-family: Arial, sans-serif; }
        .bill-print { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        hr { border: 0; border-top: 1px solid #000; margin: 20px 0; }
    `);
    printWindow.document.write('</style></head><body>');

    // Populate the template with data
    const billContent = billTemplate
        .replace('{{orderId}}', document.getElementById('orderId').value)
        .replace('{{itemName}}', document.getElementById('itemName').value)
        .replace('{{totalAmount}}', document.getElementById('totalAmount').value)
        .replace('{{tax}}', document.getElementById('tax').value)
        .replace('{{discount}}', document.getElementById('discount').value)
        .replace('{{totalInWords}}', convertToWords(document.getElementById('totalAmount').value))
        .replace('{{totalAmountFinal}}', document.getElementById('totalAmount').value);

    printWindow.document.write(billContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Helper function to convert numbers to words
function convertToWords(num) {
    // Implement a number-to-words conversion function here
    // This is a placeholder, you can use a library or write your own logic
    return "TWO THOUSAND FOUR HUNDRED AND SIXTY-NINE RUPEES AND SIXTY PAISA ONLY";
}