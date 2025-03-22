// Get the canvas context
const ctx = document.getElementById('clinicsChart').getContext('2d');

// Updated chart configuration with enhanced styling
const chartConfig = {
    colors: {
        inStock: '#4CAF50',      // A softer green
        lowStock: '#FFA726',     // Warm orange
        outOfStock: '#EF5350'    // Soft red
    },
    centerX: ctx.canvas.width / 2,
    centerY: ctx.canvas.height / 2,
    radius: Math.min(ctx.canvas.width, ctx.canvas.height) / 3.2,
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
};

// Rest of the functions remain exactly the same
function calculateStockDistribution(entries) {
    const distribution = {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0
    };

    entries.forEach(entry => {
        const quantity = parseInt(entry.quantity);
        if (quantity <= 0) {
            distribution.outOfStock++;
        } else if (quantity < 30) {
            distribution.lowStock++;
        } else {
            distribution.inStock++;
        }
    });

    return distribution;
}

function drawPieChart(data) {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    let startAngle = -0.5 * Math.PI;

    // Enhanced shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    // Draw pie segments with enhanced styling
    Object.entries(data).forEach(([status, value]) => {
        const sliceAngle = (2 * Math.PI * value) / total;

        // Draw slice with slight padding for separated segments
        ctx.beginPath();
        ctx.moveTo(chartConfig.centerX, chartConfig.centerY);
        ctx.arc(chartConfig.centerX, chartConfig.centerY, chartConfig.radius * 0.98, 
                startAngle, startAngle + sliceAngle);
        ctx.closePath();

        // Fill slice with gradient
        const gradient = ctx.createRadialGradient(
            chartConfig.centerX, chartConfig.centerY, 0,
            chartConfig.centerX, chartConfig.centerY, chartConfig.radius
        );
        gradient.addColorStop(0, lightenColor(chartConfig.colors[status], 20));
        gradient.addColorStop(1, chartConfig.colors[status]);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw refined white border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Enhanced percentage label
        const labelAngle = startAngle + sliceAngle / 2;
        const percentage = ((value / total) * 100).toFixed(0);
        const labelRadius = chartConfig.radius * 0.65;
        const labelX = chartConfig.centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = chartConfig.centerY + Math.sin(labelAngle) * labelRadius;

        if (percentage > 5) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 3;
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold 13px ${chartConfig.font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage}%`, labelX, labelY);
        }

        startAngle += sliceAngle;
    });

    // Reset shadow for legend
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Enhanced legend
    const legendY = ctx.canvas.height - 25;
    let legendX = chartConfig.centerX - 120;
    
    Object.entries(data).forEach(([status, value]) => {
        // Refined legend dots
        ctx.beginPath();
        ctx.arc(legendX, legendY, 5, 0, Math.PI * 2);
        ctx.fillStyle = chartConfig.colors[status];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Enhanced legend text
        ctx.fillStyle = '#505050';
        ctx.font = `500 12px ${chartConfig.font}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const label = status
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        ctx.fillText(label, legendX + 10, legendY);
        
        legendX += ctx.measureText(label).width + 35;
    });
}

// Helper function to lighten colors
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
}

// Keep all other functions exactly the same
function resizeCanvas() {
    const container = ctx.canvas.parentNode;
    ctx.canvas.width = container.offsetWidth;
    ctx.canvas.height = 140;
    chartConfig.centerX = ctx.canvas.width / 2;
    chartConfig.centerY = (ctx.canvas.height - 15) / 2;
    chartConfig.radius = Math.min(ctx.canvas.width / 3, (ctx.canvas.height - 30) / 2);
}

// function updateChartWithRealData() {
//     fetch('http://localhost:3000/entries')
//         .then(response => response.json())
//         .then(entries => {
//             const distribution = calculateStockDistribution(entries);
//             drawPieChart(distribution);

//             const outOfStockCount = distribution.outOfStock;
//             const outOfStockElement = document.querySelector('.stat-card h2');
//             if (outOfStockElement) {
//                 outOfStockElement.textContent = outOfStockCount;
//             }
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }

// Initial setup
resizeCanvas();
updateChartWithRealData();

// Update chart when window resizes
window.addEventListener('resize', () => {
    resizeCanvas();
    updateChartWithRealData();
});

// Update chart periodically
setInterval(updateChartWithRealData, 10000);


function handleDropdownSearch() {
    const selectedOption = document.getElementById('searchDropdown').value;
    if (selectedOption) {
        alert(`You selected: ${selectedOption}`);
        // Example redirection based on selection
        window.location.href = `/${selectedOption}/index.html`;
    } else {
        alert('Please select an option.');
    }
}

function searchData() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    // Assuming your data is in an array called 'entries'
    const filteredResults = entries.filter(entry => {
        return entry.medicine.toLowerCase().includes(searchInput) ||
               entry.category.toLowerCase().includes(searchInput) ||
               entry.vendor.toLowerCase().includes(searchInput);
    });

    // Function to display the filtered results
    displayResults(filteredResults);
}