// Global variables
const API_URL = 'http://localhost:3000/api';
const HOSPITAL_ID = 1; // Set this to the current hospital's ID

// Utility functions
async function fetchVendors() {
    try {
        const response = await fetch(`${API_URL}/vendors`);
        const vendors = await response.json();
        const select = document.getElementById('vendorSelect');
        
        vendors.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor.vendor_id;
            option.textContent = vendor.vendor_name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching vendors:', error);
    }
}

async function loadHospitalOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/hospital/${HOSPITAL_ID}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const orders = await response.json();
        const tbody = document.querySelector('#hospitalOrders tbody');
        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const tr = document.createElement('tr');
            const deliveryDate = order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Pending';
            tr.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.medicine_name}</td>
                <td>${order.quantity}</td>
                <td>${order.vendor_name}</td>
                <td class="status-${order.status.toLowerCase()}">${order.status}</td>
                <td>${new Date(order.order_date).toLocaleDateString()}</td>
                <td>${deliveryDate}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading hospital orders:', error);
        // alert('Error loading orders. Please try again.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchVendors();
    loadHospitalOrders();
});

document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        hospital_id: HOSPITAL_ID,
        vendor_id: document.getElementById('vendorSelect').value,
        medicine_name: document.getElementById('medicineName').value,
        quantity: parseInt(document.getElementById('quantity').value)
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to place order');

        alert('Order placed successfully!');
        document.getElementById('orderForm').reset();
        await loadHospitalOrders();
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
    }
});



