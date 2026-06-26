import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../dashboard/TopNavbar";
import DailyPickingPrint from "./DailyPickingPrint";
import "./DailyPickingList.css";

const API = "https://zyntaweb.com/demoalafiya/api/daily_save_picking.php";
const COMPANY_API =
  "https://zyntaweb.com/demoalafiya/api/company.php";


const DailyPickingList = () => {
const [company, setCompany] = useState({
  company_name: "",
  address: "",
  phone: "",
});

const [printData, setPrintData] = useState([]);
const [printDate, setPrintDate] = useState("");
const [printMode, setPrintMode] = useState(false);
  const navigate = useNavigate();
const [showModal, setShowModal] = useState(false);
const [viewData, setViewData] = useState([]);
  const [data, setData] = useState([]);

  const loadData = () => {
    fetch(API + "?type=list")
      .then(res => res.json())
      .then(res => {
        setData(Array.isArray(res) ? res : []);
      });
  };
const handleView = (pickingNo) => {
  fetch(API + "?type=view&picking_no=" + pickingNo)
    .then(res => res.json())
    .then(res => {
      setViewData(Array.isArray(res) ? res : []);
      setShowModal(true);
    })
    .catch(err => console.error(err));
};
  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {

    if (!window.confirm("Delete this Picking?")) return;

    fetch(API + "?id=" + id, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        loadData();
      });

  };
useEffect(() => {
  loadData();

  fetch(COMPANY_API)
    .then(res => res.json())
    .then(res => {
      setCompany({
        company_name: res.company_name || "",
        address: res.address || "",
        phone: res.phone || "",
      });
    });
}, []);
const handlePrint = (pickingNo) => {
  fetch(API + "?type=view&picking_no=" + pickingNo)
    .then(res => res.json())
    .then(rows => {

      const data = Array.isArray(rows) ? rows : [];

      setPrintData(data);

      if (data.length > 0) {
        setPrintDate(data[0].picking_date || data[0].date);
      }

      setPrintMode(true);

      setTimeout(() => {
        window.print();
        setPrintMode(false);
      }, 300);
    });
};
  return (

    <div className="dsp-page">
<div className="no-print">
  <TopNavbar />
</div>
      {printMode && (
  <div className="print-area">
    <DailyPickingPrint
      company={company}
      printDate={printDate}
      data={printData}
    />
  </div>
)}
{showModal && (
  <div className="dpl-view-modal">
  <div className="dpl-view-modal-content">


       <button
      className="dpl-view-close"
      onClick={() => setShowModal(false)}
    >
      ✕
    </button>
    <h3 className="dpl-view-title">Daily Picking</h3>

     <div className="dpl-view-table-wrap">
      <table className="dsp-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Customer Name</th>
              <th>Item Name</th>
              <th>Location</th>
              <th>Brand</th>
              <th>Qty Req</th>
              <th>Pick Qty</th>
              <th>Back Order</th>
              <th>Remark</th>
            </tr>
          </thead>

          <tbody>
            {viewData.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No Data
                </td>
              </tr>
            ) : (
              viewData.map((d, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{d.customer_name}</td>
                  <td>{d.item_name}</td>
                  <td>{d.location_name}</td>
                  <td>{d.brand_name}</td>
                  <td>{d.qty}</td>
                  <td>{d.picking_qty}</td>
                  <td>{d.back_order}</td>
                  <td>{d.remark || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  </div>
)}
      {/* Add Button */}
<div className="dpl-add-wrap">
  <button
    className="dpl-add-btn"
    onClick={() => navigate("/daily-save-picking")}
  >
    + Add Daily Picking
  </button>
</div>

      <div className="dsp-card">

        <h2 className="dsp-title">
          Daily Picking
        </h2>

        <div className="dsp-table-wrap">

          <table className="dsp-table">

            <thead>

              <tr>

                <th>Date</th>

                <th>Picking No</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {data.length === 0 ? (

                <tr>
                  <td colSpan="3" className="dsp-no-data">
                    No Daily Picking
                  </td>
                </tr>

              ) : (

                data.map((row) => (

                  <tr key={row.id}>

                    <td>{row.picking_date}</td>

                    <td>{row.picking_no}</td>

                    <td>

                   <button
  className="dpl-view-btn"
  onClick={() => handleView(row.picking_no)}
>
  View
</button>
<button
  className="dpl-print-btn"
  onClick={() => handlePrint(row.picking_no)}
>
  Print
</button>           <button
                        className="dsp-process-btn"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};

export default DailyPickingList;