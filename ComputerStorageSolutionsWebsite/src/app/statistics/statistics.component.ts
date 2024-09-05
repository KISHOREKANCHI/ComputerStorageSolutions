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

  constructor(private apiService: ApiServiceService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadTotalSalesMonthWise();
    this.loadInactiveCustomers();
    this.loadUnitsSoldInPriceRange(this.minPrice, this.maxPrice);
    this.loadMostPopularProduct(this.year, this.month);
    this.loadLeastPopularProduct(this.year, this.month);
    this.loadHighestSellingProductOrderDetails();
    this.loadOrdersByCustomer(); // To load total orders by customer
    this.loadCustomerProductsInQuarter(); // To load customer products in quarter
  }

  // Fetching total sales data and rendering a chart
  loadTotalSalesMonthWise() {
    this.apiService.getTotalSalesMonthWise().subscribe(data => {
      console.log('Total Sales Month Wise:', data);
      this.totalSalesData = data;
      const labels = data.map(sale => sale.month);
      const salesValues = data.map(sale => sale.totalSales);
      this.renderTotalSalesChart(labels, salesValues);
    });
  }

  // Render total sales chart
  renderTotalSalesChart(labels: string[], salesValues: number[]) {
    const ctx = <HTMLCanvasElement>document.getElementById('totalSalesChart');
    const context = ctx.getContext('2d');
    if (context) {
      new Chart(context, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Sales',
            data: salesValues,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
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

  // Load inactive customers
  loadInactiveCustomers() {
    this.apiService.getInactiveCustomers().subscribe(data => {
      console.log('Inactive Customers:', data);
      this.inactiveCustomers = data;
      this.renderInactiveCustomersChart(); // Call to render the chart
    });
  }

  // Load units sold in a specified price range
  loadUnitsSoldInPriceRange(minPrice: number, maxPrice: number) {
    this.apiService.getUnitsSoldInPriceRange(minPrice, maxPrice).subscribe(data => {
      console.log('Units Sold in Price Range:', data);
      this.unitsSoldInPriceRange = data;
    });
  }

  loadMostPopularProduct(year: number, month: number) {
    this.apiService.getPopularProductDetailsForMonth(year, month).subscribe(data => {
      console.log('Most Popular Product:', data);
      this.mostPopularProduct = data;
    });
  }
  
  loadLeastPopularProduct(year: number, month: number) {
    this.apiService.getLeastPopularProductDetailsForMonth(year, month).subscribe(data => {
      console.log('Least Popular Product:', data);
      this.leastPopularProduct = data;
  
      // Create chart for least popular product
      this.renderLeastPopularProductChart();
    });
  }

  // Load details for the highest-selling product's order and customer details
  loadHighestSellingProductOrderDetails() {
    this.apiService.getOrderIdAndCustomerDetailsForHighestSellingProduct().subscribe(data => {
      console.log('Highest Selling Product Details:', data);
      this.highestSellingProduct = data;
      this.renderHighestSellingProductChart(); // Call to render the chart
    });
  }

  // Render chart for inactive customers
  renderInactiveCustomersChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('inactiveCustomersChart');
    const context = ctx.getContext('2d');
    if (context) {
      const usernames = this.inactiveCustomers.map(customer => customer.username);
      const customerCount = this.inactiveCustomers.length;

      new Chart(context, {
        type: 'bar',
        data: {
          labels: usernames,
          datasets: [{
            label: 'Inactive Customers',
            data: Array(customerCount).fill(1), // Each customer gets a count of 1
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
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

  // Render chart for highest selling product orders
  renderHighestSellingProductChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('highestSellingProductChart');
    const context = ctx.getContext('2d');
    if (context) {
      const orderIds = this.highestSellingProduct.map((order: HighestSellingProductOrder) => order.orderId);
      const customerNames = this.highestSellingProduct.map((order: HighestSellingProductOrder) => order.customerName);

      new Chart(context, {
        type: 'pie',
        data: {
          labels: customerNames,
          datasets: [{
            label: 'Highest Selling Product Orders',
            data: Array(orderIds.length).fill(1), // Each order gets a count of 1
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          }
        }
      });
    }
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

  renderLeastPopularProductChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('leastPopularProductChart');
    if (ctx) {
      const context = ctx.getContext('2d');
      if (context) {
        const label = this.leastPopularProduct.productName;
        const unitsSold = this.leastPopularProduct.unitsSold;
  
        new Chart(context, {
          type: 'doughnut',
          data: {
            labels: [label],
            datasets: [{
              label: 'Least Popular Product',
              data: [unitsSold],
              backgroundColor: ['rgba(255, 99, 132, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
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

  // Render chart for most popular product
  renderMostPopularProductChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('mostPopularProductChart');
    const context = ctx.getContext('2d');
    if (context) {
      const labels = [this.mostPopularProduct.productName];
      const data = [this.mostPopularProduct.unitsSold];

      new Chart(context, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Most Popular Product',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          }
        }
      });
    }
  }

  
}
