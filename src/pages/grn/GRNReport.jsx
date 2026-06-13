import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./GRNReport.css";
import { MdReceiptLong } from "react-icons/md";

const API = "https://zyntaweb.com/demoalafiya/api/grn_report.php";
const SUPPLIER_API = "https://zyntaweb.com/demoalafiya/api/suppliers.php";
const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const COMPANY_API = "https://zyntaweb.com/demoalafiya/api/company.php";

const GRNReport = () => {

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [itemId, setItemId] = useState("");

  const [supplierSearch, setSupplierSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");

  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  const [company, setCompany] = useState({});

  // 🔥 IMPORTANT
const [data, setData] = useState([]);
const [hasSearched, setHasSearched] = useState(false);
  /* LOAD */
  useEffect(() => {

    fetch(SUPPLIER_API)
      .then(res => res.json())
      .then(res => setSuppliers(res.data || res || []));

    fetch(ITEM_API)
      .then(res => res.json())
      .then(res => setItems(res.data || res || []));

    fetch(COMPANY_API)
      .then(res => res.json())
      .then(setCompany);

  }, []);

  /* FILTER */
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  /* FETCH */
 const fetchReport = async () => {

  if (!fromDate || !toDate) {
    alert("Select dates");
    return;
  }

  let url = `${API}?from_date=${fromDate}&to_date=${toDate}`;

  if (supplierId) url += `&supplier_id=${supplierId}`;
  if (itemId) url += `&item_id=${itemId}`;

  try {
    const res = await fetch(url);
    const result = await res.json();

    setData(result.data || []);
    setHasSearched(true); // 🔥 FIX
  } catch {
    setData([]);
    setHasSearched(true); // 🔥 FIX
  }
};
  const handlePrint = () => window.print();

  return (
    <div className="grn-page-wrapper">

      <div className="no-print">
        <TopNavbar />
      </div>

      <div className="grn-card-container">

        <h3 className="grn-title">
          <MdReceiptLong style={{ color: "#4e73df" }} />
          GRN REPORT
        </h3>

        {/* FILTER */}
        <div className="grn-filter-section">

          <div className="grn-filter-group">
            <label>From</label>
            <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} />
          </div>

          <div className="grn-filter-group">
            <label>To</label>
            <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} />
          </div>

          {/* SUPPLIER */}
          <div className="grn-select-wrapper">
            <label>Supplier</label>
<div
  className="grn-select-display"
  onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
>
  <span className="grn-short-name">
    {supplierId
      ? suppliers
          .find(s => s.id == supplierId)
          ?.name?.split(" ")
          .slice(0, 3)
          .join(" ")
      : "Select supplier"}
  </span>

  <span>▼</span>
</div>
            {showSupplierDropdown && (
              <div className="grn-dropdown-box">

                <div className="grn-search-box">
                  <input
                    type="text"
                    placeholder="Search supplier..."
                    value={supplierSearch}
                    onChange={(e)=>setSupplierSearch(e.target.value)}
                    className="grn-search-input"
                  />
                </div>

                <div className="grn-options">
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map(s => (
                      <div key={s.id}
                        className="grn-option"
                        onClick={()=>{
                          setSupplierId(s.id);
                          setShowSupplierDropdown(false);
                        }}>
                        {s.name}
                      </div>
                    ))
                  ) : (
                    <div className="grn-no-results">No results</div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* ITEM */}
          <div className="grn-select-wrapper">
            <label>Item</label>

           <div
  className="grn-select-display"
  onClick={() => setShowItemDropdown(!showItemDropdown)}
>
  <span className="grn-short-name">
    {itemId
      ? items
          .find(i => i.id == itemId)
          ?.name?.split(" ")
          .slice(0, 3)
          .join(" ")
      : "Select item"}
  </span>

  <span>▼</span>
</div>

            {showItemDropdown && (
              <div className="grn-dropdown-box">

                <div className="grn-search-box">
                  <input
                    type="text"
                    placeholder="Search item..."
                    value={itemSearch}
                    onChange={(e)=>setItemSearch(e.target.value)}
                    className="grn-search-input"
                  />
                </div>

                <div className="grn-options">
                  {filteredItems.map(i => (
                    <div key={i.id}
                      className="grn-option"
                      onClick={()=>{
                        setItemId(i.id);
                        setShowItemDropdown(false);
                      }}>
                      {i.name}
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          <button className="grn-btn generate" onClick={fetchReport}>
            Generate
          </button>

          <button className="grn-btn print" onClick={handlePrint}>
            Print
          </button>

        </div>

        {/* RESULT */}
        {hasSearched && data.length > 0 ? (

          <div className="print-section">

            <div className="grn-print-header print-only">
              <h2>{company.company_name}</h2>
              <p>{company.address}</p>
              <p>{company.phone}</p>
              <h3>GRN REPORT</h3>
              <p>{fromDate} to {toDate}</p>
            </div>

            <table className="grn-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Expiry</th>
                </tr>
              </thead>

              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    <td data-label="Date">{row.date}</td>
                    <td data-label="Supplier">{row.supplier}</td>
                    <td data-label="Item">{row.item}</td>
                    <td data-label="Quantity">{row.qty}</td>
                    <td data-label="Location">{row.location}</td>
                    <td data-label="Expiry">{row.expiry || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

        ) : hasSearched ? (

          <div className="grn-no-data">
            <MdReceiptLong className="grn-no-data-icon" /> No data found
          </div>

        ) : null}

      </div>
    </div>
  );
};

export default GRNReport;