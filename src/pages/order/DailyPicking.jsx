import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { useLocation, useNavigate } from "react-router-dom";

import "./DailyPicking.css";

const API = "https://zyntaweb.com/demoalafiya/api/daily_save_picking.php";
const UPDATE_API = "https://zyntaweb.com/demoalafiya/api/order_details.php";
const COMPANY_API = "https://zyntaweb.com/demoalafiya/api/company.php";

 const LIST_API =
  "https://zyntaweb.com/demoalafiya/api/daily_save_picking.php";
const DailyPicking = () => {
const navigate = useNavigate();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [printDate, setPrintDate] = useState("");
  
  const selectedOrders = location.state?.orders || [];
  // 🔥 COMPANY STATE
  const [data, setData] = useState([]);
  const [company, setCompany] = useState({
    company_name: "",
    address: "",
    phone: ""
  });

  // 🔥 LOAD COMPANY
 useEffect(() => {
  fetch(COMPANY_API)
    .then(res => res.json())
    .then(data => {
      console.log("Company Response:", data);

      setCompany({
        company_name: data.company_name || "",
        address: data.address || "",
        phone: data.phone || ""
      });
    })
    .catch(err => console.log(err));
}, []);

useEffect(() => {

  console.log("selectedOrders =", selectedOrders);

  if (selectedOrders.length === 0) return;

  fetch(`${LIST_API}?type=details`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    orders: selectedOrders,
  }),
})
.then((res) => res.json())
.then((res) => {
  console.log(res);

  const rows = Array.isArray(res) ? res : [];

  if (rows.length > 0) {
    setPrintDate(rows[0].date);
  }

  const updated = rows.map((d) => ({
    ...d,
    status:
      Number(d.picking_qty || 0) >= Number(d.qty)
        ? "Completed"
        : "Pending",
  }));

  setData(updated);
});
}, [selectedOrders]);
  // ✅ PICK CHANGE
  const handlePickChange = (index, value) => {
    let newData = [...data];

    let qty = Number(newData[index].qty);
    let picked = Number(value);

    if (picked > qty) {
      alert("Picking qty should be <= required qty");
      return;
    }

    newData[index].picking_qty = picked;

    let back = qty - picked;

    if (!newData[index].manual) {
      newData[index].status = back === 0 ? "Completed" : "Pending";
    }

    setData(newData);
  };

  // ✅ STATUS CHANGE
  const handleStatusChange = (index, value) => {
    let newData = [...data];
    newData[index].status = value;
    newData[index].manual = true;
    setData(newData);
  };

  // ✅ SAVE
 const handleSave = async () => {
  if (saving) return;

  setSaving(true);

  try {
    const payload = {
      order_ids: [...new Set(data.map((d) => d.order_id))],
      picking_date: printDate,
      items: data.map((d) => ({
        id: d.id,
        order_id: d.order_id,
        picking_qty: Number(d.picking_qty || 0),
      })),
    };

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.status === "saved") {

  const isPrint = window.confirm(
    "Daily Picking Saved Successfully.\n\nDo you want to Print?"
  );

  if (isPrint) {
    setTimeout(() => {
      window.print();

      setTimeout(() => {
        navigate("/daily-picking-list");
      }, 500);
    }, 200);
  } else {
    navigate("/daily-picking-list");
  }

} else {
      alert(result.message || "Save Failed");
      setSaving(false);
    }
  } catch (err) {
    console.log(err);
    setSaving(false);
  }
};
  const handlePrint = () => window.print();

  return (
    
        <div className="daily-picking-page">

      <div className="no-print">

        <TopNavbar />
      </div>

      <div className="dp-pro-card">

    <div className="dp-header no-print">
  <h3 className="dp-pro-title">Daily Picking</h3>

  <button
    className="dp-back-btn"
    onClick={() => navigate(-1)}
  >
    ← Back
  </button>
</div>

        {/* 🔥 PRINT HEADER */}
        <div className="dp-print-header dp-print-only">
          <h2>{company.company_name}</h2>
          <p>{company.address}</p>
          <p>Phone: {company.phone}</p>

          <h3>DAILY PICKING REPORT</h3>
          <p>Date: {printDate}</p>
          
        </div>

        {/* TABLE */}
        <div className="dp-pro-table-container">
            <table className="dp-pro-table">
      <thead>
        <tr>
          <th>Sl No</th>
          <th>Customer Name</th>
          <th>Item Name</th>
          <th>Item Location</th>
          <th>Brand</th>
          <th>Qty Req</th>
          <th>Pick Qty</th>
          <th>Back Order</th>
          <th>Status</th>
          <th>Delivery Remarks</th>
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="10" style={{ textAlign: "center" }}>
              No Data
            </td>
          </tr>
        ) : (
          data.map((d, i) => {
            let picked = d.picking_qty || 0;
            let back = d.qty - picked;

            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{d.customer_name}</td>
                <td>{d.item_name}</td>
                <td>{d.location_name}</td>
                <td>{d.brand_name}</td>
                <td>{d.qty}</td>

               <td>
  <span className="print-only">{d.picking_qty || ""}</span>
  <input
    className="no-print"
    type="number"
    value={d.picking_qty > 0 ? d.picking_qty : ""}
    onChange={(e) => handlePickChange(i, e.target.value)}
  />
</td>

                <td style={{ textAlign: "center", fontWeight: "600" }}>
                  {back}
                </td>
<td>
  <span className="print-only">{d.status}</span>
  <select
    className="no-print"
    value={d.status}
    onChange={(e) => handleStatusChange(i, e.target.value)}
  >
    <option>Order Placed</option>
    <option>Completed</option>
    <option>Pending</option>
  </select>
</td><td>
  {d.remark || "-"}
</td>
              </tr>
            );
          })
        )}
      </tbody>

    </table>
          </div>
        </div>

       <div className="dp-btn-group no-print">
  
  {data.length > 0 && (
<button
  className="dp-pro-btn"
  onClick={handleSave}
  disabled={saving}
>
  {saving ? "Saving..." : "Save Picking"}
</button>
  )}



</div>
      </div>
  );
};

export default DailyPicking;