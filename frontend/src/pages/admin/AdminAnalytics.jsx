import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import API from "../../utils/api";

function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const revenueChartRef = useRef(null);
  const ordersChartRef = useRef(null);
  const salesChartRef = useRef(null);
  const usersChartRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get("/admin/analytics");
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!analyticsData) return;

    let revenueChartInstance = null;
    let ordersChartInstance = null;
    let salesChartInstance = null;
    let usersChartInstance = null;

    // 1. Revenue Chart (Line Chart)
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext("2d");
      revenueChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: analyticsData.revenueChart.map((d) => d.month),
          datasets: [
            {
              label: "Monthly Revenue (₹)",
              data: analyticsData.revenueChart.map((d) => d.revenue),
              borderColor: "rgb(99, 102, 241)",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              fill: true,
              tension: 0.35,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (val) => "₹" + val.toLocaleString("en-IN") },
            },
          },
        },
      });
    }

    // 2. Orders Chart (Bar Chart)
    if (ordersChartRef.current) {
      const ctx = ordersChartRef.current.getContext("2d");
      ordersChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: analyticsData.ordersChart.map((d) => d.month),
          datasets: [
            {
              label: "Monthly Orders",
              data: analyticsData.ordersChart.map((d) => d.orders),
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }

    // 3. Product Sales Chart (Doughnut Chart)
    if (salesChartRef.current) {
      const ctx = salesChartRef.current.getContext("2d");
      salesChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: analyticsData.productSalesChart.map((d) => d.name),
          datasets: [
            {
              data: analyticsData.productSalesChart.map((d) => d.sold),
              backgroundColor: [
                "rgba(99, 102, 241, 0.8)",
                "rgba(236, 72, 153, 0.8)",
                "rgba(59, 130, 246, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(245, 158, 11, 0.8)",
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
              labels: { boxWidth: 12, padding: 15 },
            },
          },
        },
      });
    }

    // 4. Users Growth Chart (Line Chart)
    if (usersChartRef.current) {
      const ctx = usersChartRef.current.getContext("2d");
      usersChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: analyticsData.usersGrowthChart.map((d) => d.month),
          datasets: [
            {
              label: "New Registered Users",
              data: analyticsData.usersGrowthChart.map((d) => d.newUsers),
              borderColor: "rgb(16, 185, 129)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: true,
              tension: 0.35,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }

    return () => {
      if (revenueChartInstance) revenueChartInstance.destroy();
      if (ordersChartInstance) ordersChartInstance.destroy();
      if (salesChartInstance) salesChartInstance.destroy();
      if (usersChartInstance) usersChartInstance.destroy();
    };
  }, [analyticsData]);

  if (loading) {
    return <div style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}><h2>Assembling analytics graphs...</h2></div>;
  }

  return (
    <div className="admin-analytics-wrapper">
      <style>{`
        .admin-analytics-wrapper {
          color: #334155;
        }
        .analytics-header {
          margin-bottom: 2rem;
        }
        .analytics-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }
        .analytics-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0.5rem 0 0 0;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 2rem;
        }
        @media (max-width: 576px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .chart-card h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: white;
          border-bottom: 1px solid #334155;
          padding-bottom: 0.75rem;
        }
        .chart-canvas-wrapper {
          position: relative;
          height: 300px;
          width: 100%;
        }
      `}</style>

      <div className="analytics-header">
        <h1>Analytics Intelligence</h1>
        <p>Analyze revenue growth, conversion, demographic metrics, and top-selling items</p>
      </div>

      <div className="charts-grid">
        {/* Revenue Line Graph */}
        <div className="chart-card">
          <h3>Monthly Revenue Analytics</h3>
          <div className="chart-canvas-wrapper">
            <canvas ref={revenueChartRef} />
          </div>
        </div>

        {/* Orders Bar Graph */}
        <div className="chart-card">
          <h3>Monthly Orders Analytics</h3>
          <div className="chart-canvas-wrapper">
            <canvas ref={ordersChartRef} />
          </div>
        </div>

        {/* Product Sales Doughnut */}
        <div className="chart-card">
          <h3>Top Selling Products</h3>
          <div className="chart-canvas-wrapper">
            <canvas ref={salesChartRef} />
          </div>
        </div>

        {/* User Growth Line */}
        <div className="chart-card">
          <h3>Users Growth Trend</h3>
          <div className="chart-canvas-wrapper">
            <canvas ref={usersChartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
