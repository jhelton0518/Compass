import { getIncomeStatement } from "../lib/services/income-statement";

export default function HomePage() {
  const statement = getIncomeStatement("2025-07");

  if (!statement) {
    return <main>No data found.</main>;
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Compass</h1>

      <h2>Volunteer Custom Homes</h2>

      <p>
        <strong>Period:</strong> {statement.period}
      </p>

      <hr />

      <p>
        <strong>Revenue:</strong>{" "}
        {statement.revenue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })}
      </p>

      <p>
        <strong>Labor:</strong>{" "}
        {statement.labor.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })}
      </p>

      <p>
        <strong>Material:</strong>{" "}
        {statement.material.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })}
      </p>

      <p>
        <strong>Office Payroll:</strong>{" "}
        {statement.officePayroll.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })}
      </p>
    </main>
  );
}