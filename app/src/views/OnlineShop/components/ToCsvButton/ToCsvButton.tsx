import React from "react";
import { useSelector } from "react-redux";
import { selectShopActions } from "../../../../store/shopSlice";
import styles from "./ToCsvButton.module.css";
import {
  selectAge,
  selectGender,
  selectGroup,
  selectHandedness,
  selectOnlineShoppingFrequency,
  selectParticipantId,
} from "../../../../store/surveySlice";

const CsvExportButton: React.FC = () => {
  const shopActions = useSelector(selectShopActions);

  // Define the demographics data
  const participantId = useSelector(selectParticipantId);
  const age = useSelector(selectAge);
  const group = useSelector(selectGroup);
  const gender = useSelector(selectGender);
  const handedness = useSelector(selectHandedness);

  const onlineShoppingFrequency = useSelector(selectOnlineShoppingFrequency);

  const handleExportCsv = () => {
    // Define column names for the shop actions
    const shopColumns = ["Type", "Timestamp (s)", "Category", "Item", "Budget"];

    // Create a row for demographics
    const demographicsRow = [
      "participantId",
      participantId,
      "age",
      age,
      "group",
      group,
      "gender",
      gender,
      "handedness",
      handedness,
      "onlineShoppingFrequency",
      onlineShoppingFrequency,
    ];

    // Create the header row for shop actions
    const shopHeaderRow = shopColumns.join(",");

    // Create the CSV content by combining the demographics row, shop actions header, and data rows
    const csvContent =
      "data:text/csv;charset=utf-8," +
      demographicsRow.join(",") +
      "\n" +
      "\n" +
      shopHeaderRow +
      "\n" +
      shopActions.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shop_actions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleExportCsv} className={styles.exportButton}>
      Export to CSV
    </button>
  );
};

export default CsvExportButton;
