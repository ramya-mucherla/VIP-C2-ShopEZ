import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import API from "../utils/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthlySalesChartRef = useRef(null);
  const ordersOverviewChartRef = useRef(null);
  const revenueAnalyticsChartRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!stats) return;

    let monthlySalesChartInstance = null;
    let ordersOverviewChartInstance = null;
    let revenueAnalyticsChartInstance = null;

    // 1. Monthly Sales Bar Chart
    if (monthlySalesChartRef.current) {
      const ctx = monthlySalesChartRef.current.getContext("2d");
      monthlySalesChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: stats.monthlySales.map((item) => item.month),
          datasets: [
            {
              label: "Sales (₹)",
              data: stats.monthlySales.map((item) => item.sales),
              backgroundColor: "rgba(79, 70, 229, 0.7)",
              borderColor: "rgb(79, 70, 229)",
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => "₹" + value.toLocaleString("en-IN"),
              },
            },
          },
        },
      });
    }

    // 2. Orders Overview Doughnut Chart
    if (ordersOverviewChartRef.current) {
      const ctx = ordersOverviewChartRef.current.getContext("2d");
      ordersOverviewChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: stats.ordersOverview.map((item) => item.status),
          datasets: [
            {
              data: stats.ordersOverview.map((item) => item.count),
              backgroundColor: [
                "rgba(245, 158, 11, 0.8)",  // Pending (Amber)
                "rgba(59, 130, 246, 0.8)",   // Shipped (Blue)
                "rgba(16, 185, 129, 0.8)",   // Delivered (Green)
                "rgba(239, 68, 68, 0.8)",    // Cancelled (Red)
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                padding: 15,
              },
            },
          },
        },
      });
    }

    // 3. Revenue Analytics Line Chart
    if (revenueAnalyticsChartRef.current) {
      const ctx = revenueAnalyticsChartRef.current.getContext("2d");
      revenueAnalyticsChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: stats.revenueAnalytics.map((item) => item.date),
          datasets: [
            {
              label: "Daily Revenue (₹)",
              data: stats.revenueAnalytics.map((item) => item.revenue),
              fill: true,
              backgroundColor: "rgba(236, 72, 153, 0.1)",
              borderColor: "rgb(236, 72, 153)",
              tension: 0.35,
              borderWidth: 3,
              pointBackgroundColor: "rgb(236, 72, 153)",
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => "₹" + value.toLocaleString("en-IN"),
              },
            },
          },
        },
      });
    }

    return () => {
      if (monthlySalesChartInstance) monthlySalesChartInstance.destroy();
      if (ordersOverviewChartInstance) ordersOverviewChartInstance.destroy();
      if (revenueAnalyticsChartInstance) revenueAnalyticsChartInstance.destroy();
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="admin-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <h1 style={{ color: "#475569", fontFamily: "system-ui" }}>Loading Dashboard Stats...</h1>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Dynamic embedded styles for premium dashboard design */}
      <style>{`
        .admin-dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          font-family: system-ui, -apple-system, sans-serif;
          color: #1e293b;
        }
        .admin-title {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          border-radius: 1rem;
          padding: 1.5rem;
          color: white;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .stat-card.products {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        }
        .stat-card.orders {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .stat-card.users {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        .stat-card.revenue {
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
        }
        .stat-label {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
        }
        .stat-value {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 0.5rem;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .chart-container {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
          border: 1px solid #e2e8f0;
        }
        .chart-container h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.75rem;
        }
        .chart-wrapper {
          position: relative;
          height: 280px;
          width: 100%;
        }
      `}</style>

      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Grid of Key Performance Indicators */}
      <div className="stats-grid">
        <div className="stat-card products">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{stats?.products || 0}</div>
        </div>

        <div className="stat-card orders">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats?.orders || 0}</div>
        </div>

        <div className="stat-card users">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats?.users || 0}</div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹{(stats?.revenue || 0).toLocaleString("en-IN")}</div>
        </div>
      </div>

      {/* Grid of Analytics Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Monthly Sales</h3>
          <div className="chart-wrapper">
            <canvas ref={monthlySalesChartRef} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Orders Overview</h3>
          <div className="chart-wrapper">
            <canvas ref={ordersOverviewChartRef} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Revenue Analytics</h3>
          <div className="chart-wrapper">
            <canvas ref={revenueAnalyticsChartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;