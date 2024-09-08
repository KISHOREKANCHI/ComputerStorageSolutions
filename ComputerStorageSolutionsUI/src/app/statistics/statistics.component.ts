import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { Chart, registerables } from 'chart.js';

// Define interfaces for type safety
interface HighestSellingProductOrder {
  orderId: string;
  customerName: string;
}

interface CustomerProduct {
  orderId: string;
  orderDate: Date;
  products: string[];
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  totalSalesData: any[] = [];
  totalOrdersByCustomer: any[] = [];
  inactiveCustomers: any[] = [];
  unitsSoldInPriceRange: any[] = [];
  mostPopularProduct: any;
  leastPopularProduct: any;
  customerProductsInQuarter: CustomerProduct[] = [];
  highestSellingProduct: HighestSellingProductOrder[] = [];
  customerId: string = '6F6A7BF5-B2D8-47B1-F21D-08DCCB2AFD66'; 
  year: number = new Date().getFullYear(); // Default to current year
  month: number = new Date().getMonth() + 1; // Default to current month
  minPrice: number = 0; // Default price range
  maxPrice: number = 500;
  popupText: string='';
  popupVisible: boolean=false;

  constructor(private apiService: ApiServiceService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadTotalSalesMonthWise();
    this.loadInactiveCustomers();
    this.loadHighestSellingProductOrderDetails();
    this.loadOrdersByCustomer();
    this.loadCustomerProductsInQuarter();

    const leastPopularmonthPicker = document.getElementById('leastPopularmonthPicker') as HTMLInputElement;
    const loadLeastPopularProductBtn = document.getElementById('loadLeastPopularProductBtn') as HTMLButtonElement;
  
    // Event listener to handle chart loading on button click
    loadLeastPopularProductBtn.addEventListener('click', () => {
      const selectedDate = leastPopularmonthPicker.value; // Format: 'YYYY-MM'
      if (selectedDate) {
        const [year, month] = selectedDate.split('-').map(Number); // Extract year and month
        this.loadLeastPopularProduct(year, month); // Call function with selected year and month
      } else {
        console.error('No date selected');
      }
    });

    const mostPopularMonthPicker = document.getElementById('mostPopularMonthPicker') as HTMLInputElement;
    const loadMostPopularProductBtn = document.getElementById('loadMostPopularChartBtn') as HTMLButtonElement;
    loadMostPopularProductBtn.addEventListener('click', () => {
      const selectedDate = mostPopularMonthPicker.value; // Format: 'YYYY-MM'
      if (selectedDate) {
        const [year, month] = selectedDate.split('-').map(Number); // Extract year and month
        this.loadMostPopularProduct(year, month); // Call function with selected year and month
      } else {
        console.error('No date selected');
      }
    });
    this.loadUnitsSoldInPriceRange(this.minPrice, this.maxPrice);
  }

  // Fetching total sales data and rendering a chart
  loadTotalSalesMonthWise() {
    this.apiService.getTotalSalesMonthWise().subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          // Handle no data scenario (e.g., show a message to the user)
          this.showPopup('Data does not exist');
          return; // Exit the method early
        }
        console.log('Total Sales Month Wise:', data);
        this.totalSalesData = data;
  
        // Prepare the labels and sales values
        const labels = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));
        const salesValues = new Array(12).fill(0); // Initialize sales values for each month
  
        // Populate sales values for each year
        data.forEach((yearData: { months: any[]; }) => {
          yearData.months.forEach((monthData: { month: number; totalSales: any; }) => {
            const monthIndex = monthData.month - 1; // Adjust month to 0-based index
            salesValues[monthIndex] += monthData.totalSales; // Accumulate total sales for each month
          });
        });
  
        this.renderTotalSalesChart(labels, salesValues);
      },
      error: (error) => {
        this.showPopup(error);
      }
    });
  }

  // Render total sales chart
  renderTotalSalesChart(labels: string[], salesValues: number[]) {
    const ctx = <HTMLCanvasElement>document.getElementById('totalSalesChart');
    const context = ctx.getContext('2d');
    if (context) {
      new Chart(context, {
        type: 'bar', // Change to 'bar' for a bar chart
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Sales',
            data: salesValues,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Sales'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Months'
              }
            }
          },
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });
    }
  }

  loadInactiveCustomers() {
    this.apiService.getInactiveCustomers().subscribe(data => {
        console.log('Inactive Customers:', data);
        this.inactiveCustomers = data;
        this.renderInactiveCustomersChart(); // Call to render the chart
    });
  }

  // Render chart for inactive customers
  renderInactiveCustomersChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('inactiveCustomersChart');
    const context = ctx.getContext('2d');
    
    if (context) {
        const customerNames = this.inactiveCustomers.map(customer => customer.customerName);
        const customerCounts = Array(this.inactiveCustomers.length).fill(1); // Each customer gets a count of 1

        new Chart(context, {
            type: 'pie',
            data: {
                labels: customerNames,
                datasets: [{
                    label: 'Inactive Customers',
                    data: customerCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const dataset = tooltipItem.dataset;
                                const total = dataset.data.reduce((sum, value) => sum + value, 0);
                                const currentValue = dataset.data[tooltipItem.dataIndex];
                                const percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                                return `${tooltipItem.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    }
  }


  // Load details for the highest-selling product's order and customer details
  loadHighestSellingProductOrderDetails() {
    this.apiService.getOrderIdAndCustomerDetailsForHighestSellingProduct().subscribe(data => {
      console.log('Highest Selling Product Details:', data);
      this.highestSellingProduct = data;
      this.renderHighestSellingProductChart(data.productName, data.customerName); // Call to render the chart
    });
  }

  

  // Render doughnut chart for highest selling product and customer
  renderHighestSellingProductChart(productName: string, customerName: string) {
    const ctx = <HTMLCanvasElement>document.getElementById('highestSellingProductChart');
    const context = ctx.getContext('2d');

    if (context) {
        new Chart(context, {
            type: 'doughnut',
            data: {
                labels: ['Product', 'Customer'],
                datasets: [{
                    label: 'Highest Selling Product Info',
                    data: [1, 1], // Equal weight for both product and customer for visualization
                    backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 159, 64, 0.5)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.label === 'Product') {
                                    return `Product: ${productName}`;
                                } else {
                                    return `Customer: ${customerName}`;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
  }

  loadLeastPopularProduct(year: number, month: number) {
    this.apiService.getLeastPopularProductDetailsForMonth(year, month).subscribe(data => {
      if (!data || data.length === 0) {
        this.showPopup("No data available for the specified month and year.");
        return; // Exit the method early
      }  
      console.log('Least Popular Product:', data);
      this.leastPopularProduct = data;
  
      // Create chart for least popular product
      this.renderLeastPopularProductChart();
    });
  }
  
  // Render the chart using the least popular product data
  renderLeastPopularProductChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('leastPopularProductChart');
    if (ctx) {
      const context = ctx.getContext('2d');
      if (context) {
        const label = this.leastPopularProduct.product; // Use 'product' from the data
        const unitsSold = this.leastPopularProduct.unitsSold;
  
        new Chart(context, {
          type: 'bar',
          data: {
            labels: [label],
            datasets: [{
              label: 'Units Sold',
              data: [unitsSold],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: true,
              },
              tooltip: {
                enabled: true,
              }
            }
          }
        });
      } else {
        console.error('Failed to get 2D context for least popular product chart.');
      }
    } else {
      console.error('Canvas element for least popular product chart not found.');
    }
  }  

  loadMostPopularProduct(year: number, month: number) {
    this.apiService.getPopularProductDetailsForMonth(year, month).subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          this.showPopup("No data available for the specified month and year.");
          return; // Exit the method early
        }
        this.mostPopularProduct = data;
        console.log("most poular product",this.mostPopularProduct)
        this.renderMostPopularProductChart();
      },
      error: (err) => {
        this.mostPopularProduct = null; 
        this.showPopup(err);
      }
    });
  }

   // Render chart for most popular product
  renderMostPopularProductChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('mostPopularProductChart');
    if (ctx) {
      const context = ctx.getContext('2d');
      if (context) {
        const label = this.mostPopularProduct.product; // Use 'product' from the data
        const unitsSold = this.mostPopularProduct.unitsSold;
  
        new Chart(context, {
          type: 'bar',
          data: {
            labels: [label],
            datasets: [{
              label: 'Units Sold',
              data: [unitsSold],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: true,
              },
              tooltip: {
                enabled: true,
              }
            }
          }
        });
      } else {
        console.error('Failed to get 2D context for mostt popular product chart.');
      }
    } else {
      console.error('Canvas element for most popular product chart not found.');
    }
  }

  // Load orders placed by a specific customer in a specific month
  loadOrdersByCustomer() {
    if (this.customerId) {
      this.apiService.getOrdersByCustomerInSpecificMonth(this.customerId, this.year, this.month).subscribe(data => {
        console.log('Orders by Customer:', data);
        this.totalOrdersByCustomer = data;
      });
    } else {
      alert('Please provide a valid Customer ID');
    }
  }

  // Load customer and products ordered in a specific quarter
  loadCustomerProductsInQuarter() {
    const quarter = Math.floor((this.month - 1) / 3) + 1; // Calculate quarter based on current month
    this.apiService.getCustomerProductsOrderedInQuarter(this.customerId, this.year, quarter).subscribe(data => {
      console.log('Customer Products in Quarter:', data);
      this.customerProductsInQuarter = data;
      this.renderCustomerProductsInQuarterChart(); // Call to render the chart
    });
  }


  // Load units sold in a specified price range
  loadUnitsSoldInPriceRange(minPrice: number, maxPrice: number) {
    this.apiService.getUnitsSoldInPriceRange(minPrice, maxPrice).subscribe(data => {
      console.log('Units Sold in Price Range:', data);
      this.unitsSoldInPriceRange = data;
    });
  }
  
  // Render chart for customer products in the quarter
  renderCustomerProductsInQuarterChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('customerProductsInQuarterChart');
    const context = ctx.getContext('2d');
    if (context) {
      const productNames = this.customerProductsInQuarter.flatMap((order: CustomerProduct) => order.products);
      const productCounts: { [key: string]: number } = {};

      productNames.forEach(name => {
        productCounts[name] = (productCounts[name] || 0) + 1;
      });

      const labels = Object.keys(productCounts);
      const data = Object.values(productCounts);

      new Chart(context, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Customer Products in Quarter',
            data: data,
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }


  renderUnitsSoldInPriceRangeChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('unitsSoldInPriceRangeChart');
    const context = ctx.getContext('2d');
    if (context) {
      const unitsSold = this.unitsSoldInPriceRange.map(item => item.unitsSold);
      const labels = this.unitsSoldInPriceRange.map(item => item.productName);

      new Chart(context, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Units Sold in Price Range',
            data: unitsSold,
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }
  
}
