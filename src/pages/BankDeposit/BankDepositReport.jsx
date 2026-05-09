import { useEffect, useState } from "react";

import TopNavbar from "../dashboard/TopNavbar";

import "./BankDepositReport.css";

import { FaUniversity } from "react-icons/fa";

import { MdReceiptLong } from "react-icons/md";

const API =
  "https://zyntaweb.com/demoalafiya/api/bankdepositreport.php";
const Bank_CLASS_API =
  "https://zyntaweb.com/demoalafiya/api/Bankdeposit.php?dropdown=1";

const COMPANY_API =
  "https://zyntaweb.com/demoalafiya/api/company.php";

const BankDepositReport = () => {

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [company, setCompany] =
    useState({});

  const [data, setData] =
    useState([]);

  const [totalAmount, setTotalAmount] =
    useState(0);

  const [hasSearched, setHasSearched] =
    useState(false);

  /* ================= LOAD COMPANY ================= */

  useEffect(() => {

    fetch(COMPANY_API)

      .then((res) => res.json())

      .then((res) =>
        setCompany(res || {})
      )

      .catch((err) =>
        console.log(err)
      );

  }, []);

  /* ================= FETCH REPORT ================= */

  const fetchReport = async () => {

    if (!fromDate || !toDate) {

      alert("Select From and To Date");

      return;
    }

    try {

      const res = await fetch(

        `${API}?from_date=${fromDate}&to_date=${toDate}`

      );

      const result = await res.json();

      setData(result.data || []);

      setTotalAmount(
        result.total_amount || 0
      );

      setHasSearched(true);

    } catch (error) {

      console.log(error);

      setData([]);

      setTotalAmount(0);

      setHasSearched(true);
    }
  };

  /* ================= PRINT ================= */

  const handlePrint = () => {

    window.print();
  };

  return (

    <div className="bank-report-page">

      <div className="no-print">

        <TopNavbar />

      </div>

      <div className="bank-report-card">

        {/* ================= TITLE ================= */}

        <h3 className="bank-report-title">

          <FaUniversity
            style={{ color: "#4e73df" }}
          />

          Bank Deposit Report

        </h3>

        {/* ================= FILTER ================= */}

        <div className="bank-report-filter-section">

          {/* FROM DATE */}

          <div className="bank-report-filter-group">

            <label>From</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(
                  e.target.value
                )
              }
            />

          </div>

          {/* TO DATE */}

          <div className="bank-report-filter-group">

            <label>To</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(
                  e.target.value
                )
              }
            />

          </div>

          {/* BUTTON */}

          <button
            className="bank-report-btn generate"
            onClick={fetchReport}
          >

            Generate

          </button>

          {/* PRINT */}

          <button
            className="bank-report-btn print"
            onClick={handlePrint}
          >

            Print

          </button>

        </div>

        {/* ================= TABLE ================= */}

        {hasSearched && data.length > 0 ? (

          <div className="print-section">

            {/* ================= PRINT HEADER ================= */}

            <div className="bank-report-print-header print-only">

              <h2>
                {company.company_name}
              </h2>

              <p>
                {company.address}
              </p>

              <p>
                {company.phone}
              </p>

              <h3>
                Bank Deposit Report
              </h3>

              <p>
                {fromDate} to {toDate}
              </p>

            </div>

            {/* ================= TABLE ================= */}

            <table className="bank-report-table">

              <thead>

                <tr>

                  <th>Date</th>

                  <th>
                    Bank Account
                  </th>

                  <th>Amount</th>

                </tr>

              </thead>

              <tbody>

                {data.map((row, i) => (

                  <tr key={i}>

                    <td data-label="Date">
                      {row.date}
                    </td>

                    <td data-label="Bank Account">
                      {row.bank_account}
                    </td>

                    <td data-label="Amount">
                      ₹ {row.amount}
                    </td>

                  </tr>

                ))}

              </tbody>

              {/* ================= TOTAL ================= */}

              <tfoot>

                <tr>

                  <th
                    colSpan="2"
                    style={{
                      textAlign: "right",
                    }}
                  >

                    Total

                  </th>

                  <th>

                    ₹{" "}

                    {Number(
                      totalAmount
                    ).toFixed(2)}

                  </th>

                </tr>

              </tfoot>

            </table>

          </div>

        ) : hasSearched ? (

          <div className="bank-report-no-data">

            <MdReceiptLong
              className="bank-report-no-data-icon"
            />

            No data found

          </div>

        ) : null}

      </div>

    </div>

  );
};

export default BankDepositReport;