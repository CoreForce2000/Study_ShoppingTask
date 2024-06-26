import React, { ChangeEvent, ChangeEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/button.tsx";
import useTaskStore from "../store/store.ts";
import { ASSETS_PATH } from "../util/constants.ts";

interface RadioGroupProps {
  name: string;
  values: number[] | string[];
  value: number | string;
  onChange: ChangeEventHandler | undefined;
  required?: boolean;
  labels?: string[];
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  values,
  value,
  onChange,
  required,
  labels,
}) => {
  if (!labels) {
    labels = values.map((value) => value.toString());
  }
  const radioButtons = values.map((option, index) => {
    return (
      <div key={`radio-${index}`} className="flex items-center gap-2">
        <input
          key={option}
          type="radio"
          id={labels![index]}
          name={name}
          value={option}
          checked={value === option}
          onChange={onChange}
          className="form-radio"
          required={required}
        />
        <label htmlFor={labels![index]} className="mr-5">
          {labels![index]}
        </label>
      </div>
    );
  });

  return (
    <div key="Radio1" className="flex flex-wrap gap-4">
      {radioButtons}
    </div>
  );
};

interface DropdownProps {
  options: string[];
  value: string;
  onChange: ChangeEventHandler | undefined;
  required?: boolean;
  name?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  required,
  name,
}) => {
  return (
    <select
      name={name}
      className="border"
      value={value}
      required={required}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const DataEntry: React.FC = () => {
  const navigate = useNavigate();

  const store = useTaskStore();

  const [participantIdError, setParticipantIdError] = useState<string>("");
  const [ageError, setAgeError] = useState<string>("");
  const [configVisible, setConfigVisible] = useState<boolean>(false);

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "d") {
      event.preventDefault();
      fillAndSubmitForm();
    }
  });

  const fillAndSubmitForm = () => {
    store.setTaskOption("participantId", "1234");
    store.setSurveyResponse("gender", "male");
    store.setSurveyResponse("group", "Control");
    store.setSurveyResponse("age", "18");
    store.setSurveyResponse("handedness", "right");
    store.setTaskOption("time", "1 min");

    setParticipantIdError("");
    setAgeError("");

    navigate("/slide/1");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    if (name in store.taskOptions) {
      store.setTaskOption(name, value);
    } else {
      store.setSurveyResponse(name, value);
    }

    if (name === "participantId") {
      if (!value.match(/^\d{4}$/)) {
        setParticipantIdError("Participant ID must be exactly 4 digits");
      } else {
        setParticipantIdError("");
      }
    }
    if (name === "age") {
      if (value && parseInt(value) < 18) {
        setAgeError("Age must be 18 or above.");
      } else {
        setAgeError("");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (ageError) {
      alert("Age needs to be 18 or above.");
      return;
    }
    if (store.taskOptions.group === "Select group") {
      alert("Please select a group.");
      return;
    }

    store.setTime(parseInt(store.taskOptions.time.split(" ")[0]) * 60);

    navigate("/slide/1");
  };

  return (
    <div className="w-screen h-screen box-border flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[300px] shadow-md border border-gray-400 p-4"
      >
        <img
          src={ASSETS_PATH + "logo.jpg"}
          className="w-full max-w-xs mb-5"
          alt="Cambridge Logo"
        />

        <div className="flex justify-between w-full font-sans">
          <label htmlFor="participantId">Participant ID</label>
          <input
            name="participantId"
            type="text"
            className="w-20 h-8 border border-gray-300 rounded px-2"
            maxLength={4}
            minLength={4}
            onChange={handleChange}
            pattern="\d{4}"
            required
          />
        </div>
        {participantIdError && (
          <div className="text-red-500 text-lg mt-1">{participantIdError}</div>
        )}

        <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-xl">Gender</legend>
          <RadioGroup
            required
            name="gender"
            values={["male", "female"]}
            value={store.data.survey.gender}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-xl">Group</legend>
          <Dropdown
            required
            name="group"
            options={[
              "Select group",
              "Alcohol",
              "Cocaine",
              "Heroin",
              "Control",
            ]}
            value={store.data.survey.group}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-xl">Age</legend>
          <div className="flex flex-col">
            <input
              name="age"
              type="text"
              className="w-10 h-8 border border-gray-300 rounded px-2"
              maxLength={2}
              minLength={2}
              onChange={handleChange}
              required
            />
          </div>
          {ageError && (
            <div className="text-red-500 text-lg mt-1">{ageError}</div>
          )}
        </fieldset>

        <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-xl">Handedness</legend>
          <RadioGroup
            required
            name="handedness"
            values={["left", "right"]}
            value={store.data.survey.handedness}
            onChange={handleChange}
          />
        </fieldset>

        <div>
          <fieldset className="border border-gray-300 p-2 mb-4">
            <legend className="text-xl">Shopping time</legend>
            <RadioGroup
              required
              name="time"
              values={["10 min", "15 min", "1 min"]}
              value={store.taskOptions.time}
              onChange={handleChange}
            />
          </fieldset>
        </div>
        <hr className="h-px border-none bg-gray-600 mb-4" />

        <div className="mx-auto w-fit">
          {configVisible && <></>}
          <Button
            type="button"
            onClick={() => setConfigVisible(!configVisible)}
          >
            {configVisible ? "Hide Config" : "Show Config"}
          </Button>
          <Button type="submit" variant="primary">
            Run Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DataEntry;
