import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../dashboard/TopNavbar";
import "./DailySavePicking.css";

const API = "https://zyntaweb.com/demoalafiya/api/daily_save_picking.php";
const UPDATE_API = "https://zyntaweb.com/demoalafiya/api/order_details.php";
const COMPANY_API = "https://zyntaweb.com/demoalafiya/api/company.php";

 const LIST_API =
  "https://zyntaweb.com/demoalafiya/api/daily_save_picking.php";
const DailySavePicking = () => {

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
const [date, setDate] = useState("");
  //==========================
  // LOAD SAVED PICKING LIST
  //==========================

const loadData = () => {

  if (!date) {
    setData([]);
    return;
  }
fetch(`${API}?date=${date}`)
  .then(res => res.json())
  .then(res => {
    console.log("API Response:", res);
    setData(Array.isArray(res) ? res : []);
  });

};
useEffect(() => {
  loadData();
}, [date]);
  //==========================
  // CHECKBOX
  //==========================

  const handleSelect = (orderId) => {

    if (selected.includes(orderId)) {

      setSelected(selected.filter(id => id !== orderId));

    } else {

      setSelected([...selected, orderId]);

    }

  };

  //==========================
  // DELETE
  //==========================

    //==========================
  // PROCESS
  //==========================

const handleProcess = () => {
  console.log("Selected:", selected);
  console.log("Data:", data);

  navigate("/daily-picking", {
    state: {
      orders: selected
    }
  });
};

  //==========================
  // RETURN
  //==========================

  return (

    <div className="dsp-page">

      <TopNavbar />

      <div className="dsp-card">

       <div className="dsp-header">
  <h2 className="dsp-title">Daily Save Picking</h2>

  <button
    className="dsp-back-btn"
    onClick={() => navigate(-1)}
  >
    ← Back
  </button>
</div>
<div className="dsp-filter">

  <input
    type="date"
    className="dsp-date"
    value={date}
    onChange={(e)=>setDate(e.target.value)}
  />

</div>
        <div className="dsp-table-wrap">

     <table className="dsp-table">

  <thead>
    <tr>
      <th>Date</th>
      <th>Order No</th>
      <th>Customer</th>
      <th>Select</th>
    </tr>
  </thead>

  <tbody>

    {data.length === 0 ? (

      <tr>
        <td colSpan="4" className="dsp-no-data">
          No Saved Picking
        </td>
      </tr>

    ) : (

      data.map((row) => (

        <tr key={row.id}>

          <td>{row.date}</td>

          <td>{row.order_number}</td>

          <td>{row.customer_name}</td>

          

          <td>
           <input
  type="checkbox"
  checked={selected.includes(row.order_id)}
  onChange={() => {
    console.log("Clicked Order ID:", row.order_id);
    handleSelect(row.order_id);
  }}
/>
          </td>

        </tr>

      ))

    )}

  </tbody>

</table>
           

        </div>

        <div className="dsp-btn-group">

          <button
            className="dsp-process1-btn"
            onClick={handleProcess}
          >
            Daily Save Picking
          </button>

        </div>

      </div>

    </div>

  );

};

export default DailySavePicking;