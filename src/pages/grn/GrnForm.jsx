import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./GrnForm.css";

const GRN_API = "https://zyntaweb.com/demoalafiya/api/grn_header.php";
const DETAILS_API = "https://zyntaweb.com/demoalafiya/api/grn_details.php";
const SUPPLIER_API = "https://zyntaweb.com/demoalafiya/api/suppliers.php";
const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const LOCATION_API = "https://zyntaweb.com/demoalafiya/api/locations.php";

const GrnForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grnNumber, setGrnNumber] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
const [supplierSearch, setSupplierSearch] = useState("");
const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
const [itemSearch, setItemSearch] = useState("");
const [openItemIndex, setOpenItemIndex] = useState(null);
const [openLocationIndex, setOpenLocationIndex] = useState(null);
const [locationSearch, setLocationSearch] = useState("");
const [showSupplierModal, setShowSupplierModal] = useState(false);
const [supplierForm, setSupplierForm] = useState({
  name: "",
  address: "",
  phone: "",
  status: "ACTIVE",
});
  const [header, setHeader] = useState({
    date: "",
    supplier_id: "",
    remarks: ""
  });

  const [details, setDetails] = useState([
    {
      item_id: "",
      qty: "",
      batch: "",
      expiry: "",
      location_id: "",
      remark: ""
    }
  ]);
const [loading, setLoading] = useState(false);
  // ================= LOAD MASTER DATA =================
  useEffect(() => {
    fetch(SUPPLIER_API)
      .then(r => r.json())
      .then(d => setSuppliers(Array.isArray(d) ? d : d.data || []));

    fetch(ITEM_API)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : d.data || []));

    fetch(LOCATION_API)
      .then(r => r.json())
      .then(d => setLocations(Array.isArray(d) ? d : d.data || []));
  }, []);

  // ================= LOAD EDIT / NEW =================
  useEffect(() => {
    if (id) {
      fetch(`${GRN_API}?id=${id}`)
        .then(r => r.json())
        .then(d => {
          setGrnNumber(d.invoice_no || "");
          setHeader({
            date: d.date || "",
            supplier_id: d.supplier_id || "",
            remarks: d.remarks || ""
          });
        });

      fetch(`${DETAILS_API}?grn_id=${id}`)
        .then(r => r.json())
        .then(d => setDetails(Array.isArray(d) ? d : []));
    } else {
      fetch(GRN_API + "?type=next_number")
        .then(r => r.json())
        .then(d => setGrnNumber(d.number || ""));
    }
  }, [id]);
const handleSupplierChange = (e) => {
  setSupplierForm({
    ...supplierForm,
    [e.target.name]: e.target.value,
  });
};

const handleSupplierPhone = (value) => {
  setSupplierForm({
    ...supplierForm,
    phone: "+" + value,
  });
};

const saveSupplier = async (e) => {
  e.preventDefault();

  if (saving) return; // ✅ Multiple click prevent

  try {
    setSaving(true);

    const res = await fetch(SUPPLIER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplierForm),
    });

    const data = await res.json();

    if (data.status === "success") {
      alert("Supplier Added ✅");

      const supplierRes = await fetch(SUPPLIER_API);
      const supplierData = await supplierRes.json();

      setSuppliers(
        Array.isArray(supplierData)
          ? supplierData
          : supplierData.data || []
      );

      setShowSupplierModal(false);

      setSupplierForm({
        name: "",
        address: "",
        phone: "",
        status: "ACTIVE",
      });
    } else {
      alert(data.message || "Failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error saving supplier ❌");
  } finally {
    setSaving(false);
  }
};
  // ================= ADD ROW =================
  const addRow = () => {
    setDetails([
      ...details,
      {
        item_id: "",
        qty: "",
        batch: "",
        expiry: "",
        location_id: "",
        remark: ""
      }
    ]);
  };

  // ================= CHANGE =================
  const handleChange = (i, field, value) => {
    const updated = [...details];
    updated[i][field] = value;
    setDetails(updated);
  };

  // ================= AUTO LOCATION =================
 const handleItemChange = (i, value) => {
  const item = items.find(x => x.id == value);

  const updated = [...details];
  updated[i].item_id = Number(value);   // 🔥 IMPORTANT FIX
  updated[i].location_id = item?.location_id || "";

  setDetails(updated);
};
  // ================= DELETE ROW =================
  const deleteRow = (index) => {
  const updated = details.filter((_, i) => i !== index);

  // If all rows deleted → keep empty row (no alert)
  if (updated.length === 0) {
    setDetails([
      {
        item_id: "",
        qty: "",
        batch: "",
        expiry: "",
        location_id: "",
        remark: ""
      }
    ]);
  } else {
    setDetails(updated);
  }
};
  // ================= SAVE =================
// ================= SAVE =================
const handleSave = async () => {
  if (loading) return;

  try {
    setLoading(true);

    // Date validation
    if (!header.date) {
      alert("Please select date ❗");
      return;
    }

    // Supplier validation
    if (!header.supplier_id) {
      alert("Please select supplier ❗");
      return;
    }

    // Quantity validation
    const invalidQty = details.some(
      d => d.item_id && (!d.qty || parseFloat(d.qty) <= 0)
    );

    if (invalidQty) {
      alert("Please enter quantity for all selected items ❗");
      return;
    }

    const validItems = details
      .map(d => ({
        item_id: Number(d.item_id),
        qty: parseFloat(d.qty) || 0,
        unit: (d.qty || "").replace(/[0-9.]/g, "").trim(),
        batch: d.batch || "",
        expiry: d.expiry || null,
        location_id: d.location_id ? Number(d.location_id) : null,
        remark: d.remark || ""
      }))
      .filter(d => d.item_id);

    // At least one item
    if (validItems.length === 0) {
      alert("Please add at least one item ❗");
      return;
    }

    const method = id ? "PUT" : "POST";

    // ================= HEADER =================
    const headerRes = await fetch(GRN_API, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...header,
        id
      })
    });

    const headerData = await headerRes.json();
    const grnId = id ? id : headerData.id;

    if (!grnId) {
      alert("Header failed ❌");
      return;
    }

    // ================= DETAILS =================
    const detailRes = await fetch(DETAILS_API, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        grn_id: grnId,
        items: validItems
      })
    });

    const detailData = await detailRes.json();

    if (detailData.status === "error") {
      alert(detailData.message || "Save failed ❌");
      return;
    }

    alert(id ? "GRN Updated ✅" : "GRN Saved ✅");

    navigate("/grn-list");

  } catch (err) {
    console.error(err);
    alert("Error saving GRN ❌");
  } finally {
    setLoading(false);
  }
};
const filteredSuppliers = suppliers.filter(s =>
  s.name.toLowerCase().includes(supplierSearch.toLowerCase())
);
const filteredItems = items.filter(i =>
  i.name.toLowerCase().includes(itemSearch.toLowerCase())
);

const filteredLocations = locations.filter(l =>
  l.name.toLowerCase().includes(locationSearch.toLowerCase())
);
  return (
   <div className="order-ui-container">

  {/* HEADER */}
  <div className="order-ui-card">
    <div className="order-ui-header">
<h2><BsBoxSeam /> GRN </h2>
      <button
        className="oha-ui-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
    </div>

    <div className="order-ui-grid">

      {/* GRN NUMBER */}
      <div className="order-ui-group">
        <label>GRN No</label>
        <input
          value={
            grnNumber
              ? "GRN" + String(grnNumber).replace(/\D/g, "").padStart(3, "0")
              : ""
          }
          readOnly
        />
      </div>

      {/* DATE */}
      <div className="order-ui-group">
        <label>Date *</label>
        <input
          type="date"
          value={header.date}
          onChange={e => setHeader({ ...header, date: e.target.value })}
        />
      </div>

      {/* SUPPLIER */}
      <div className="order-ui-group">
  <label>Supplier *</label>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <div className="custom-dropdown" style={{ flex: 1 }}>
      <div
        className="grn-dropdown-display"
        onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
      >
        {header.supplier_id
          ? suppliers.find(s => s.id == header.supplier_id)?.name
          : ""}

        <span className="grn-arrow">▼</span>
      </div>

      {showSupplierDropdown && (
        <div className="dropdown-box">
          <input
            type="text"
            placeholder="Search supplier..."
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
            className="dropdown-search"
          />

          <div className="dropdown-options">
            {filteredSuppliers.map(s => (
              <div
                key={s.id}
                className="dropdown-option"
                onClick={() => {
                  setHeader({ ...header, supplier_id: s.id });
                  setShowSupplierDropdown(false);
                  setSupplierSearch("");
                }}
              >
                {s.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Add Supplier Button */}
    <button
      type="button"
      className="supplier-add-btn"
      onClick={() => setShowSupplierModal(true)}
    >
      <FaPlus />
    </button>
  </div>
</div>
  {showSupplierModal && (
  <div className="supplier-modal-overlay">
    <div className="supplier-modal-box">
      <div className="supplier-modal-header">
        <h3>Add Supplier</h3>

        <button
          type="button"
          onClick={() => setShowSupplierModal(false)}
        >
          ✕
        </button>
      </div>

      <form
        onSubmit={saveSupplier}
        className="supplier-modal-body"
      >
        <label>Name</label>
        <input
          name="name"
          value={supplierForm.name}
          onChange={handleSupplierChange}
          required
        />

        <label>Address</label>
        <input
          name="address"
          value={supplierForm.address}
          onChange={handleSupplierChange}
        />

        <label>Phone</label>
        <PhoneInput
          country="in"
          value={supplierForm.phone}
          onChange={handleSupplierPhone}
        />

        <label>Status</label>
        <select
          name="status"
          value={supplierForm.status}
          onChange={handleSupplierChange}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
<button type="submit" disabled={saving}>
  {saving ? "Saving..." : "Save"}
</button>
      </form>
    </div>
  </div>
)}
  
      {/* REMARKS */}
      <div className="order-ui-group">
        <label>Remarks</label>
        <input
          value={header.remarks}
          onChange={e => setHeader({ ...header, remarks: e.target.value })}
        />
      </div>

    </div>
  </div>

      {/* ================= DETAILS ================= */}
      <div className="grn-ui-card">

        <div className="grn-ui-header">
          <h2><MdInventory /> GRN Details</h2>
          <button className="grn-ui-add-btn" onClick={addRow}>
            + Add Item
          </button>
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="grn-ui-table-wrapper">
          <table className="grn-ui-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Location</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {details.map((d, i) => (
                <tr key={i}>
                  <td>
                  <div className="custom-dropdown">
  <div
    className="grn-dropdown-display"
    onClick={() =>
      setOpenItemIndex(openItemIndex === i ? null : i)
    }
  >
    {d.item_id
      ? items.find(it => it.id == d.item_id)?.name
      : ""}

    <span className="grn-arrow">▼</span>
  </div>

{openItemIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search item..."
        value={itemSearch}
        onChange={(e) => setItemSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredItems.map(it => (
          <div
            key={it.id}
            className="dropdown-option"
            onClick={() => {
              handleItemChange(i, it.id);
              setOpenItemIndex(null);
              setItemSearch("");
            }}
          >
            {it.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
                  </td>

        <td>
  <input
  
    type="number"
    min="1"
    value={d.qty}
    onChange={e => handleChange(i, "qty", e.target.value)}
  />
</td>

                  <td>
                    <input
                      value={d.batch}
                      onChange={e => handleChange(i, "batch", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      type="date"
                      value={d.expiry}
                      onChange={e => handleChange(i, "expiry", e.target.value)}
                    />
                  </td>

                  <td>
                    <div className="custom-dropdown">
  <div
    className="grn-dropdown-display"
    onClick={() =>
      setOpenLocationIndex(openLocationIndex === i ? null : i)
    }
  >
    {d.location_id
      ? locations.find(l => l.id == d.location_id)?.name
      : ""}

    <span className="grn-arrow">▼</span>
  </div>

 {openLocationIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search location..."
        value={locationSearch}
        onChange={(e) => setLocationSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredLocations.map(l => (
          <div
            key={l.id}
            className="dropdown-option"
            onClick={() => {
              handleChange(i, "location_id", l.id);
              setOpenLocationIndex(null);
              setLocationSearch("");
            }}
          >
            {l.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
                  </td>

                  <td>
                    <input
                      value={d.remark}
                      onChange={e => handleChange(i, "remark", e.target.value)}
                    />
                  </td>

                  <td>
                    <button className="grn-ui-delete-btn" onClick={() => deleteRow(i)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE VIEW ===== */}
     <div className="grn-ui-mobile">
  {details.map((d, i) => (
    <div key={i} className="grn-ui-item-card">

      <div className="grn-field">
        <label>Item</label>
       <div className="custom-dropdown">
  <div
    className="grn-dropdown-display"
    onClick={() =>
  setOpenItemIndex(openItemIndex === i ? null : i)
}
  >
    {d.item_id
      ? items.find(it => it.id == d.item_id)?.name
      : ""}

    <span className="grn-arrow">▼</span>
  </div>

{openItemIndex === i && (    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search item..."
        value={itemSearch}
        onChange={(e) => setItemSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredItems.map(it => (
          <div
            key={it.id}
            className="dropdown-option"
            onClick={() => {
              handleItemChange(i, it.id);
              setOpenItemIndex(null);
              setItemSearch("");
            }}
          >
            {it.name}
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  )}
</div>
      </div>

    <div className="grn-field">
  <label>Qty</label>
  <input
    type="number"
    min="1"
    value={d.qty}
    onChange={e => handleChange(i, "qty", e.target.value)}
  />
</div>

      <div className="grn-field">
        <label>Batch</label>
        <input
          value={d.batch}
          onChange={e => handleChange(i, "batch", e.target.value)}
        />
      </div>

      <div className="grn-field">
        <label>Expiry</label>
        <input
          type="date"
          value={d.expiry}
          onChange={e => handleChange(i, "expiry", e.target.value)}
        />
      </div>

      <div className="grn-field">
        <label>Location</label>
      <div className="custom-dropdown">
  <div
    className="grn-dropdown-display"
    onClick={() =>
  setOpenLocationIndex(openLocationIndex === i ? null : i)
}
  >
    {d.location_id
      ? locations.find(l => l.id == d.location_id)?.name
      : ""}

    <span className="grn-arrow">▼</span>
  </div>

  {openLocationIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search location..."
        value={locationSearch}
        onChange={(e) => setLocationSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredLocations.length > 0 ? (
          filteredLocations.map(l => (
            <div
              key={l.id}
              className="dropdown-option"
              onClick={() => {
                handleChange(i, "location_id", l.id);
              setOpenLocationIndex(null);
                setLocationSearch("");
              }}
            >
              {l.name}
            </div>
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  )}
</div>
      </div>

      <div className="grn-field">
        <label>Remark</label>
        <input
          value={d.remark}
          onChange={e => handleChange(i, "remark", e.target.value)}
        />
      </div>

      <button
        className="grn-ui-delete-btn"
        onClick={() => deleteRow(i)}
      >
        Delete
      </button>

    </div>
  ))}
</div> {/* grn-ui-card close */}

<div className="save-order-fixed">
<button
  className="order-ui-save-btn"
  onClick={handleSave}
  disabled={loading}
>
  {loading ? "Saving..." : (id ? "Update" : "Save")}
</button>
</div>

</div> {/* grn-ui-container close */}
    </div>
  );
};

export default GrnForm;