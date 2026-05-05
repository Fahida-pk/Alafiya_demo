import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./OHAReport.css";
import { MdKeyboardReturn } from "react-icons/md";

const API = "https://zyntaweb.com/demoalafiya/api/oha_report.php";
const CUSTOMER_API = "https://zyntaweb.com/demoalafiya/api/customer.php";
const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const REASON_API = "https://zyntaweb.com/demoalafiya/api/return_reason_codes.php";
const COMPANY_API = "https://zyntaweb.com/demoalafiya/api/company.php";

const OHAReport = () => {

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [reasons, setReasons] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [itemId, setItemId] = useState("");
  const [reasonId, setReasonId] = useState("");

  const [customerSearch, setCustomerSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [reasonSearch, setReasonSearch] = useState("");

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);

  const [data, setData] = useState([]);
  const [company, setCompany] = useState({});

  // 🔥 NEW STATE
  const [hasSearched, setHasSearched] = useState(false);

  /* LOAD */
  useEffect(() => {

    fetch(CUSTOMER_API)
      .then(res => res.json())
      .then(res => setCustomers(res.data || res || []));

    fetch(ITEM_API)
      .then(res => res.json())
      .then(res => setItems(res.data || res || []));

    fetch(REASON_API)
      .then(res => res.json())
      .then(res => setReasons(res.data || res || []));

    fetch(COMPANY_API)
      .then(res => res.json())
      .then(setCompany);

  }, []);

  /* FILTER */
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const filteredReasons = reasons.filter(r =>
    r.description.toLowerCase().includes(reasonSearch.toLowerCase())
  );

  /* FETCH REPORT */
const fetchReport = async () => {

  if (!fromDate || !toDate) {
    alert("Select dates");
    return;
  }

  let url = `${API}?from_date=${fromDate}&to_date=${toDate}`;

  if (customerId) url += `&customer_id=${customerId}`;
  if (itemId) url += `&item_id=${itemId}`;
  if (reasonId) url += `&reason_id=${reasonId}`;

  try {
    const res = await fetch(url);
    const result = await res.json();

    setData(result.data || []);
    setHasSearched(true); // ✅ AFTER data comes

  } catch {
    setData([]);
    setHasSearched(true); // ✅ ALSO HERE
  }
};

  return (
    <div className="oha-page-wrapper">

      <div className="no-print">
        <TopNavbar />
      </div>

      <div className="oha-card-container">

        <h3 className="oha-title">
          <MdKeyboardReturn style={{ color: "#4e73df" }} />
          OHA RETURN REPORT
        </h3>

        {/* FILTER */}
        <div className="oha-filter-section">

          <div className="oha-filter-group">
            <label>From</label>
            <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} />
          </div>

          <div className="oha-filter-group">
            <label>To</label>
            <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} />
          </div>

          {/* CUSTOMER */}
          <div className="oha-select-wrapper">
            <label>Customer</label>

            <div className="oha-select-display"
              onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}>
              {customerId
                ? customers.find(c => c.id == customerId)?.name
                : "Select customer"}
              <span>▼</span>
            </div>

            {showCustomerDropdown && (
              <div className="oha-dropdown-box">

                <div className="oha-search-box">
                  <input
                    type="text"
                    placeholder="Search customer..."
                    value={customerSearch}
                    onChange={(e)=>setCustomerSearch(e.target.value)}
                    className="oha-search-input"
                  />
                </div>

                <div className="oha-options">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map(c => (
                      <div key={c.id}
                        className="oha-option"
                        onClick={()=>{
                          setCustomerId(c.id);
                          setShowCustomerDropdown(false);
                          setCustomerSearch("");
                        }}>
                        {c.name}
                      </div>
                    ))
                  ) : (
                    <div className="oha-no-results">No results</div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* ITEM */}
          <div className="oha-select-wrapper">
            <label>Item</label>

            <div className="oha-select-display"
              onClick={() => setShowItemDropdown(!showItemDropdown)}>
              {itemId
                ? items.find(i => i.id == itemId)?.name
                : "Select item"}
              <span>▼</span>
            </div>

            {showItemDropdown && (
              <div className="oha-dropdown-box">
                <div className="oha-search-box">
                  <input
                    type="text"
                    placeholder="Search item..."
                    value={itemSearch}
                    onChange={(e)=>setItemSearch(e.target.value)}
                    className="oha-search-input"
                  />
                </div>

                <div className="oha-options">
                  {filteredItems.map(i => (
                    <div key={i.id}
                      className="oha-option"
                      onClick={()=>{
                        setItemId(i.id);
                        setShowItemDropdown(false);
                        setItemSearch("");
                      }}>
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* REASON */}
          <div className="oha-select-wrapper">
            <label>Reason</label>

            <div className="oha-select-display"
              onClick={() => setShowReasonDropdown(!showReasonDropdown)}>
              {reasonId
                ? reasons.find(r => r.id == reasonId)?.description
                : "Select reason"}
              <span>▼</span>
            </div>

            {showReasonDropdown && (
              <div className="oha-dropdown-box">
                <div className="oha-search-box">
                  <input
                    type="text"
                    placeholder="Search reason..."
                    value={reasonSearch}
                    onChange={(e)=>setReasonSearch(e.target.value)}
                    className="oha-search-input"
                  />
                </div>

                <div className="oha-options">
                  {filteredReasons.map(r => (
                    <div key={r.id}
                      className="oha-option"
                      onClick={()=>{
                        setReasonId(r.id);
                        setShowReasonDropdown(false);
                        setReasonSearch("");
                      }}>
                      {r.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="oha-btn generate" onClick={fetchReport}>
            Generate
          </button>

          <button className="oha-btn print" onClick={()=>window.print()}>
            Print
          </button>

        </div>

      {hasSearched && data.length > 0 ? (

  <div className="print-section">

    {/* 🔥 PRINT HEADER SAME AS GRN */}
    <div className="oha-print-header print-only">
      <h2>{company.company_name}</h2>
      <p>{company.address}</p>
      <p>{company.phone}</p>
      <h3>OHA RETURN REPORT</h3>
      <p>{fromDate} to {toDate}</p>
    </div>

    {/* 🔥 TABLE WITH HEADER */}
    <table className="oha-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Customer</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Reason</th>
          <th>Remarks</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td data-label="Date">{row.date}</td>
            <td data-label="Customer">{row.customer}</td>
            <td data-label="Item">{row.item}</td>
            <td data-label="Quantity">{row.quantity}</td>
            <td data-label="Reason">{row.return_reason}</td>
            <td data-label="Remarks">{row.remarks || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>

) : hasSearched ? (

  <div className="oha-no-data">
    <MdKeyboardReturn className="oha-no-data-icon" /> No data found
  </div>

) : null}
         

      </div>
    </div>
  );
};

export default OHAReport;