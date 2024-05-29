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
} from "../../store/surveySlice";
import { RootState } from "../../store/store";
import { selectShopTime } from "../../store/configSlice";
import { Row } from "../../store/dataSlice";

type AnyObject = { [key: string]: any };


const CsvExportButton: React.FC = () => {
  const rows = useSelector((state: RootState) => state.data.rows);

  // Define the demographics data
  const participantId = useSelector(selectParticipantId);
  const age = useSelector(selectAge);
  const group = useSelector(selectGroup);
  const gender = useSelector(selectGender);
  const handedness = useSelector(selectHandedness);
  const shopTime = useSelector(selectShopTime);

  const onlineShoppingFrequency = useSelector(selectOnlineShoppingFrequency);


  const sortObjectByKeys = <T extends AnyObject>(obj: T, keys: (keyof T)[]): Partial<T> => {
    const sortedObj: Partial<T> = {};
  
    keys.forEach(key => {
      if (obj.hasOwnProperty(key)) {
        sortedObj[key] = obj[key];
      }
    });
  
    return sortedObj;
  };


  const handleExportCsv = () => {
    // Define column names for the shop actions
    const columns: (keyof Row)[] = [
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
      "Control_event",
      "Control_category",
      "Control_item",
      "Control_time_stamp",
      "Control_time_action",
      "Control_price",
      "Control_budget",
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
      "test_shopTime",
      shopTime
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
      rows.map((row) => Object.values(sortObjectByKeys(row, columns)).join(",")).join("\n");

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
