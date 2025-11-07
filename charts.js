// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Screen Time Trend Chart
    const trendCtx = document.getElementById('screenTimeTrendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Oct 29', 'Oct 30', 'Oct 31', 'Nov 1', 'Nov 2', 'Nov 3', 'Nov 4'],
                datasets: [{
                    label: 'Screen Time (hours)',
                    data: [8.5, 7.2, 7.8, 9.7, 5.5, 8.3, 6.8],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + ' hours';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + 'h';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Category Pie Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Work-related', 'Social Media', 'Movies', 'Gaming', 'Study'],
                datasets: [{
                    data: [45, 20, 15, 12, 8],
                    backgroundColor: [
                        '#48bb78',
                        '#b794f6',
                        '#ed8936',
                        '#667eea',
                        '#4299e1'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': ' + value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Mood Correlation Chart
    const moodCtx = document.getElementById('moodCorrelationChart');
    if (moodCtx) {
        new Chart(moodCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Mood vs Screen Time',
                    data: [
                        { x: 5.5, y: 5 },
                        { x: 6.8, y: 4 },
                        { x: 7.2, y: 4 },
                        { x: 7.8, y: 3 },
                        { x: 8.3, y: 3 },
                        { x: 8.5, y: 2 },
                        { x: 9.7, y: 2 }
                    ],
                    backgroundColor: '#b794f6',
                    borderColor: '#9f7aea',
                    borderWidth: 2,
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const moods = ['', '', 'Struggling', 'Down', 'Okay', 'Good', 'Excellent'];
                                return 'Screen Time: ' + context.parsed.x + 'h, Mood: ' + moods[context.parsed.y];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 1,
                        max: 5,
                        grid: {
                            color: '#e2e8f0'
                        },
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                const moods = ['', 'Very Sad', 'Sad', 'Okay', 'Good', 'Excellent'];
                                return moods[value] || '';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Mood Rating',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: '#e2e8f0'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + 'h';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Screen Time (hours)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }
});
