import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./TopNavbar";
import "./dashboard.css";
import { FaTruck, FaUserTie, FaRoute, FaReceipt, FaBoxes, FaMoneyBillWave, FaClipboardList, FaMapMarkedAlt, FaCalendarDay } from "react-icons/fa";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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

  { label: "Total Fixed Trip Amount", value: summary.fixedTripTotalAmount, icon: <FaMoneyBillWave />, cls: "card-f" },

  { label: "Last Month Fixed", value: summary.lastMonthFixedTripAmount, icon: <FaMoneyBillWave />, cls: "card-g" },

  { label: "Floating Trip Amount", value: summary.floatingTripTotalAmount, icon: <FaMoneyBillWave />, cls: "card-h" },

  { label: "Last Month Floating", value: summary.lastMonthFloatingTripAmount, icon: <FaMoneyBillWave />, cls: "card-i" },

{ label: "Total Payment Amount", value: summary.totalPaymentAmount, icon: <FaMoneyBillWave />, cls: "card-j" },

{ label: "Last Month Payment", value: summary.lastMonthPaymentAmount, icon: <FaMoneyBillWave />, cls: "card-k" },

{ label: "Balance To Settlement", value: summary.totalBalanceToSettlement, icon: <FaMoneyBillWave />, cls: "card-l" },
{
  label: "Total GRN",
  value: summary.totalGRN,
  icon: <FaBoxes />,
  cls: "card-m"
},

{
  label: "Total Orders",
  value: summary.totalOrders,
  icon: <FaClipboardList />,
  cls: "card-n"
},

{
  label: "Total OHA",
  value: summary.totalOHA,
  icon: <FaReceipt />,
  cls: "card-o"
},
{
  label: "Total Cash Settlement",
  value: summary.totalCashSettlement,
  icon: <FaMoneyBillWave />,
  cls: "card-p"
},

{
  label: "Last Month Cash Settlement",
  value: summary.lastMonthCashSettlement,
  icon: <FaMoneyBillWave />,
  cls: "card-q"
},

{
  label: "Today Cash Settlement",
  value: summary.todayCashSettlement,
  icon: <FaMoneyBillWave />,
  cls: "card-r"
},
{
  label: "Total Expense",
  value: summary.totalExpense,
  icon: <FaMoneyBillWave />,
  cls: "card-s"
},

{
  label: "Last Month Expense",
  value: summary.lastMonthExpense,
  icon: <FaMoneyBillWave />,
  cls: "card-t"
},

{
  label: "Today Expense",
  value: summary.todayExpense,
  icon: <FaMoneyBillWave />,
  cls: "card-u"
},
{
  label: "Total Bank Deposit",
  value: summary.totalBankDeposit,
  icon: <FaMoneyBillWave />,
  cls: "card-v"
},

{
  label: "Last Month Deposit",
  value: summary.lastMonthBankDeposit,
  icon: <FaMoneyBillWave />,
  cls: "card-w"
},

{
  label: "Today Deposit",
  value: summary.todayBankDeposit,
  icon: <FaMoneyBillWave />,
  cls: "card-x"
},
{
  label: "Net Cash Balance",
  value: summary.netCashBalance,
  icon: <FaMoneyBillWave />,
  cls: "card-y"
},
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
<div className="bottom-section">

<div className="trip-panels">

  <Panel title="Recent Fixed Trips">
    <div className="table-scroll">

    <div className="recent-table-header">
      <div>Date</div>
      <div>Driver</div>
      <div>Vehicle</div>
      <div>Route</div>
    </div>

    {(recent.fixedTrips || []).map((r, i) => (
      <Row
        key={i}
        date={r.trip_date}
        driver={r.driver_name}
        company={r.name}
        route={r.route_name}
      />
    ))}
    </div>
  </Panel>

 <Panel title="Recent Floating Trips">
  <div className="table-scroll">
    <div className="table-scroll-content">

      <div className="recent-table-header">
        <div>Date</div>
        <div>Driver</div>
        <div>Vehicle</div>
        <div>Area</div>
      </div>

      {(recent.floatingTrips || []).map((r, i) => (
        <Row
          key={i}
          date={r.trip_date}
          driver={r.driver_name}
          company={r.name}
          route={r.area_name}
        />
      ))}

    </div>
  </div>
</Panel>
</div>

<div className="payment-panel">
  <Panel title="Recent Payments">

    <div className="payment-header">
      <div>Date</div>
      <div>Driver</div>
      <div>Amount</div>
      <div>Balance</div>
    </div>

    {(recent.payments || []).map((r, i) => (
      <PaymentRow
        key={i}
        date={r.payment_date}
        driver={r.driver_name}
        amount={r.amount}
        balance={r.current_balance}
      />
    ))}

  </Panel>
</div>

</div> {/* bottom-section */}

</div> {/* dashboard-inner */}
</div> {/* dashboard-content */}
</div>
</>
);
};   // <-- ഇത് missing ആണ്

export default Dashboard;
