import React from "react";
import { useSelector } from "react-redux";
import styles from "./ToCsvButton.module.css";
import {
  selectAge,
  selectGender,
  selectGroup,
  selectHandedness,
  selectOnlineShoppingFrequency,
  selectParticipantId,
} from "../../../../store/surveySlice";
import { RootState } from "../../../../store/store";

const CsvExportButton: React.FC = () => {
  const rows = useSelector((state: RootState) => state.data.rows);

  // Define the demographics data
  const participantId = useSelector(selectParticipantId);
  const age = useSelector(selectAge);
  const group = useSelector(selectGroup);
  const gender = useSelector(selectGender);
  const handedness = useSelector(selectHandedness);

  const onlineShoppingFrequency = useSelector(selectOnlineShoppingFrequency);

  const handleExportCsv = () => {
    // Define column names for the shop actions
    const columns: string[] = [
      "Phase",
      "Phase_name",
      "Block_num",
      "Block_name",
      "Shopping_event",
      "Shopping_category",
      "Shopping_item",
      "Shopping_time_stamp",
      "Shopping_time_action",
      "Shopping_price",
      "Shopping_budget",
      "CoDe_cue",
      "CoDe_stimuli_type",
      "CoDe_response",
      "CoDe_outcome",
      "CoDe_item",
      "CoDe_RT",
      "CoDe_VAS",
      "Control_qs_person",
      "Control_qs_item",
      "Control_qs_correct",
      "Control_qs_attempts",
      "Control_qs_RT",
    ];

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
    const shopHeaderRow = columns.join(",");

    // Create the CSV content by combining the demographics row, shop actions header, and data rows
    const csvContent =
      "data:text/csv;charset=utf-8," +
      demographicsRow.join(",") +
      "\n" +
      "\n" +
      shopHeaderRow +
      "\n" +
      rows.map((row) => Object.values(row).join(",")).join("\n");

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
