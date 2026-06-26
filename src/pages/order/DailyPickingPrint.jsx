import "./DailyPicking.css";

const DailyPickingPrint = ({ company, printDate, data }) => {
  return (
    <>
      {/* PRINT HEADER */}
      <div className="dp-print-header">
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
                const picked = Number(d.picking_qty || 0);
                const back =
                  d.back_order !== undefined
                    ? d.back_order
                    : Number(d.qty) - picked;

                const status =
                  d.status ||
                  (picked >= Number(d.qty) ? "Completed" : "Pending");

                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{d.customer_name}</td>
                    <td>{d.item_name}</td>
                    <td>{d.location_name}</td>
                    <td>{d.brand_name}</td>
                    <td>{d.qty}</td>
                    <td>{picked}</td>
                    <td>{back}</td>
                    <td>{status}</td>
                    <td>{d.remark || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DailyPickingPrint;