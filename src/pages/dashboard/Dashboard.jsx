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
  const [summary, setSummary] = useState({ vehicles: 0, drivers: 0, routes: 0, floatingTrips: 0, fixedTrips: 0, paymentsTotal: 0, expensesTotal: 0, settlementTotal: 0, todayFixedTrips: 0, todayFloatingTrips: 0 });
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
    { label: "Payments", value: summary.paymentsTotal, icon: <FaMoneyBillWave />, cls: "card-f" },
    { label: "Expenses", value: summary.expensesTotal, icon: <FaBoxes />, cls: "card-g" },
    { label: "Settlements", value: summary.settlementTotal, icon: <FaReceipt />, cls: "card-h" },
  ];
  const lineData = { labels: (charts.monthlyPayments || []).map(x => x.month).reverse(), datasets: [ { label: "Payments", data: (charts.monthlyPayments || []).map(x => Number(x.total)).reverse(), borderColor: "#5b6cff", backgroundColor: "rgba(91,108,255,.15)", fill: true, tension: .35 }, { label: "Expenses", data: (charts.monthlyExpenses || []).map(x => Number(x.total)).reverse(), borderColor: "#fb7185", backgroundColor: "rgba(251,113,133,.12)", fill: true, tension: .35 } ] };
  const tripBar = { labels: ["Fixed", "Floating"], datasets: [{ label: "Trips", data: [summary.fixedTrips, summary.floatingTrips], backgroundColor: ["#5b6cff", "#34c3ff"] }] };
  const donutData = { labels: (charts.paymentModes || []).map(x => x.label), datasets: [{ data: (charts.paymentModes || []).map(x => Number(x.total)), backgroundColor: ["#42d392", "#5b6cff", "#f97316", "#a855f7"] }] };
  const options = { responsive: true, plugins: { legend: { labels: { color: "#1f2d3d" } } }, scales: { x: { ticks: { color: "#516173" }, grid: { color: "rgba(0,0,0,.06)" } }, y: { ticks: { color: "#516173" }, grid: { color: "rgba(0,0,0,.06)" } } } };
  const Panel = ({ title, children }) => <div className="panel"><h3>{title}</h3>{children}</div>;
  const Row = ({ a, b }) => <div className="recent-row"><b>{a}</b><span>{b}</span></div>;
  return (<><Topbar /><div className="dashboard-content">
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
        <Panel title="Recent Fixed Trips">
  {(recent.fixedTrips || []).map((r, i) => (
    <Row
      key={i}
      a={r.document_no || "-"}
      b={r.trip_date || ""}
    />
  ))}
</Panel>

<Panel title="Recent Floating Trips">
  {(recent.floatingTrips || []).map((r, i) => (
    <Row
      key={i}
      a={r.document_no || "-"}
      b={r.trip_date || ""}
    />
  ))}
</Panel>
        <Panel title="Recent Payments">
  {(recent.payments || []).map((r, i) => (
    <Row
      key={i}
      a={r.document_no || "-"}
      b={r.amount || 0}
    />
  ))}
</Panel></div></div></div></>);
};
export default Dashboard;
