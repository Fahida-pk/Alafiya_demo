import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./TopNavbar";
import "./dashboard.css";
import {
  FaTruck,
  FaUserTie,
  FaRoute,
  FaReceipt,
  FaBoxes,
  FaMoneyBillWave,
  FaClipboardList,
  FaMapMarkedAlt,
  FaCalendarDay,
  FaCreditCard,
  FaBalanceScale,
  FaShoppingCart,
  FaFileInvoice,
  FaWallet,
  FaHandHoldingUsd,
  FaCoins,
  FaFileInvoiceDollar,
  FaUniversity,
  FaPiggyBank,
  FaChartLine
} from "react-icons/fa";import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);
const SUMMARY_API = "https://zyntaweb.com/demoalafiya/api/dashboard_summary.php";
const CHARTS_API = "https://zyntaweb.com/demoalafiya/api/dashboard_charts.php";
const RECENT_API = "https://zyntaweb.com/demoalafiya/api/dashboard_recent.php";
const Dashboard = () => {
  const navigate = useNavigate();
const PaymentRow = ({ date, driver, amount, balance }) => (
  <div className="payment-row">
    <div>{date}</div>
    <div>{driver}</div>
    <div>₹{amount}</div>
    <div>₹{Number(balance || 0).toFixed(2)}</div>
  </div>
);

 const [summary, setSummary] = useState({
  vehicles: 0,
  drivers: 0,
  routes: 0,
  floatingTrips: 0,
  fixedTrips: 0,

  fixedTripTotalAmount: 0,
  lastMonthFixedTripAmount: 0,

  floatingTripTotalAmount: 0,
  lastMonthFloatingTripAmount: 0,

  totalPaymentAmount: 0,
  lastMonthPaymentAmount: 0,
  totalBalanceToSettlement: 0,
 totalGRN: 0,
  totalOrders: 0,
  totalOHA: 0,
totalCashSettlement: 0,
  lastMonthCashSettlement: 0,
  todayCashSettlement: 0,
  totalExpense: 0,
  lastMonthExpense: 0,
  todayExpense: 0,
   totalBankDeposit: 0,
  lastMonthBankDeposit: 0,
  todayBankDeposit: 0,
  netCashBalance: 0,
  todayFixedTrips: 0,
  todayFloatingTrips: 0
});
  const [charts, setCharts] = useState({ monthlyTrips: [], monthlyFloating: [], monthlyPayments: [], monthlyExpenses: [], paymentModes: [], expenseClasses: [], topDrivers: [], topRoutes: [] });
  const [recent, setRecent] = useState({ fixedTrips: [], floatingTrips: [], payments: [], expenses: [], settlements: [] });
  useEffect(() => {
    if (!sessionStorage.getItem("role")) return navigate("/");
    (async () => {
      try { const r = await fetch(SUMMARY_API); setSummary(await r.json()); } catch {}
      try { const r = await fetch(CHARTS_API); setCharts(await r.json()); } catch {}
      try { const r = await fetch(RECENT_API); setRecent(await r.json()); } catch {}
    })();
  }, [navigate]);
const cards = [
  { label: "Vehicles", value: summary.vehicles, icon: <FaTruck />, cls: "card-a" },
  { label: "Drivers", value: summary.drivers, icon: <FaUserTie />, cls: "card-b" },
  { label: "Routes", value: summary.routes, icon: <FaRoute />, cls: "card-c" },
  { label: "Fixed Trips", value: summary.fixedTrips, icon: <FaClipboardList />, cls: "card-d" },

  { label: "Floating Trips", value: summary.floatingTrips, icon: <FaMapMarkedAlt />, cls: "card-e" },
{ label: "Total Fixed Trip Amount", value: summary.fixedTripTotalAmount, icon: <FaRoute />, cls: "card-f" },

{ label: "Last Month Fixed", value: summary.lastMonthFixedTripAmount, icon: <FaCalendarDay />, cls: "card-g" },

{ label: "Floating Trip Amount", value: summary.floatingTripTotalAmount, icon: <FaMapMarkedAlt />, cls: "card-h" },

{ label: "Last Month Floating", value: summary.lastMonthFloatingTripAmount, icon: <FaCalendarDay />, cls: "card-i" },

{ label: "Total Payment Amount", value: summary.totalPaymentAmount, icon: <FaMoneyBillWave />, cls: "card-j" },

{ label: "Last Month Payment", value: summary.lastMonthPaymentAmount, icon: <FaCreditCard />, cls: "card-k" },

{ label: "Balance To Settlement", value: summary.totalBalanceToSettlement, icon: <FaBalanceScale />, cls: "card-l" },

{ label: "Total GRN", value: summary.totalGRN, icon: <FaBoxes />, cls: "card-m" },

{ label: "Total Orders", value: summary.totalOrders, icon: <FaShoppingCart />, cls: "card-n" },

{ label: "Total OHA", value: summary.totalOHA, icon: <FaFileInvoice />, cls: "card-o" },

{ label: "Total Cash Settlement", value: summary.totalCashSettlement, icon: <FaWallet />, cls: "card-p" },

{ label: "Last Month Cash Settlement", value: summary.lastMonthCashSettlement, icon: <FaHandHoldingUsd />, cls: "card-q" },

{ label: "Today Cash Settlement", value: summary.todayCashSettlement, icon: <FaCoins />, cls: "card-r" },

{ label: "Total Expense", value: summary.totalExpense, icon: <FaReceipt />, cls: "card-s" },

{ label: "Last Month Expense", value: summary.lastMonthExpense, icon: <FaFileInvoiceDollar />, cls: "card-t" },

{ label: "Today Expense", value: summary.todayExpense, icon: <FaReceipt />, cls: "card-u" },

{ label: "Total Bank Deposit", value: summary.totalBankDeposit, icon: <FaUniversity />, cls: "card-v" },

{ label: "Last Month Deposit", value: summary.lastMonthBankDeposit, icon: <FaPiggyBank />, cls: "card-w" },

{ label: "Today Deposit", value: summary.todayBankDeposit, icon: <FaMoneyBillWave />, cls: "card-x" },

{ label: "Net Cash Balance", value: summary.netCashBalance, icon: <FaChartLine />, cls: "card-y" },
];
  const lineData = { labels: (charts.monthlyPayments || []).map(x => x.month).reverse(), datasets: [ { label: "Payments", data: (charts.monthlyPayments || []).map(x => Number(x.total)).reverse(), borderColor: "#5b6cff", backgroundColor: "rgba(91,108,255,.15)", fill: true, tension: .35 }, { label: "Expenses", data: (charts.monthlyExpenses || []).map(x => Number(x.total)).reverse(), borderColor: "#fb7185", backgroundColor: "rgba(251,113,133,.12)", fill: true, tension: .35 } ] };
  const tripBar = { labels: ["Fixed", "Floating"], datasets: [{ label: "Trips", data: [summary.fixedTrips, summary.floatingTrips], backgroundColor: ["#5b6cff", "#34c3ff"] }] };
  const donutData = { labels: (charts.paymentModes || []).map(x => x.label), datasets: [{ data: (charts.paymentModes || []).map(x => Number(x.total)), backgroundColor: ["#42d392", "#5b6cff", "#f97316", "#a855f7"] }] };
  const options = { responsive: true, plugins: { legend: { labels: { color: "#1f2d3d" } } }, scales: { x: { ticks: { color: "#516173" }, grid: { color: "rgba(0,0,0,.06)" } }, y: { ticks: { color: "#516173" }, grid: { color: "rgba(0,0,0,.06)" } } } };
  const Panel = ({ title, children }) => <div className="panel"><h3>{title}</h3>{children}</div>;
const Row = ({ date, driver, company, route }) => (
  <div className="recent-row">
    <div>{date}</div>
    <div>{driver}</div>
    <div>{company}</div>
    <div>{route}</div>
  </div>
);  return (<><Topbar /><div className="dashboard-content">
    <div className="dashboard-inner"><div className="page-title">Dashboard Overview</div>
    <div className="cards-grid">{cards.map(c => <div key={c.label} className={`dash-card ${c.cls}`}>
      <div className="dash-card-top"><span className="dash-icon">{c.icon}</span>
      <span className="dash-label">{c.label}</span></div><div className="dash-value">{c.value}</div>
      </div>)}</div>
      <div className="mini-kpi"><div><FaCalendarDay /> Today Fixed: {summary.todayFixedTrips}</div>
      <div><FaCalendarDay /> Today Floating: {summary.todayFloatingTrips}</div></div>
      <div className="panel-grid"><Panel title="Payments vs Expenses"><Line data={lineData} options={options} /></Panel>
      <Panel title="Trips Summary"><Bar data={tripBar} options={options} /></Panel>
      <Panel title="Payment Mix"><Doughnut data={donutData} /></Panel></div><div className="panel-grid">
<div className="dashboard-tables">

  {/* Recent Fixed Trips */}

  <div className="table-card">
    <div className="table-title">
      <FaClipboardList /> Recent Fixed Trips
    </div>

    <div className="table-responsive">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Driver</th>
            <th>Vehicle</th>
            <th>Route</th>
          </tr>
        </thead>

        <tbody>
          {(recent.fixedTrips || []).map((r, i) => (
            <tr key={i}>
              <td>{r.trip_date}</td>
              <td>{r.driver_name}</td>
              <td>{r.name}</td>
              <td>{r.route_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Recent Floating Trips */}
  <div className="table-card">

    <div className="table-title">
      <FaMapMarkedAlt /> Recent Floating Trips
    </div>
        <div className="table-responsive">

      <table className="modern-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Driver</th>
            <th>Vehicle</th>
            <th>Area</th>
          </tr>
        </thead>

        <tbody>
          {(recent.floatingTrips || []).map((r, i) => (
            <tr key={i}>
              <td>{r.trip_date}</td>
              <td>{r.driver_name}</td>
              <td>{r.name}</td>
              <td>{r.area_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>


  {/* Recent Payments */}
  <div className="table-card full-width">

    <div className="table-title">
      <FaMoneyBillWave /> Recent Payments
    </div>

    <div className="table-responsive">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Driver</th>
            <th>Amount</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {(recent.payments || []).map((r, i) => (
            <tr key={i}>
              <td>{r.payment_date}</td>
              <td>{r.driver_name}</td>
              <td>₹{r.amount}</td>
              <td>₹{Number(r.current_balance || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
</div>
</div>
</div>
</>
);
};   // <-- ഇത് missing ആണ്

export default Dashboard;
