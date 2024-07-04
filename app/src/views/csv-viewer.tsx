import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import useTaskStore from "../store/store";

interface CsvRow {
  [key: string]: string;
}

const CsvTable: React.FC = () => {
  const [tableData, setTableData] = useState<CsvRow[]>([]);

  const store = useTaskStore();

  // Properly formatted CSV string
  const csvString = store.getCsvString();

  const parseCsv = (csv: string) => {
    const parsedData = Papa.parse<CsvRow>(csv, { header: true });
    setTableData(parsedData.data);
  };

  useEffect(() => {
    if (csvString) {
      parseCsv(csvString);
    }
  }, [csvString]);

  if (!csvString) {
    return <div>Please provide a CSV string.</div>;
  }

  if (tableData.length === 0) {
    return <div>Loading...</div>;
  }

  const headers = Object.keys(tableData[0]);

  // Add border
  return (
    <>
      <div> {JSON.stringify(store.data)} </div>
      <table className="border-collapse border border-black">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border border-black p-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} className="border border-black p-2">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CsvTable;
