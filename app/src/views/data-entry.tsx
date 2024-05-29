import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import { atom, useAtom } from 'jotai';
import { entryDataAtom } from '../sharedAtoms.ts';
import Button from '../components/button.tsx';
import { ASSETS_PATH } from '../util/paths.ts';

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
  labels
}) => {
  if (!labels) {
    labels = values.map(value=>value.toString());
  }
  const radioButtons = values.map((option, index) => {
    return (
      <div key={`radio-${index}`} className="flex items-center gap-2">
        <input
          key={option}
          type="radio"
          id={labels[index]}
          name={name}
          value={option}
          checked={value === option}
          onChange={onChange}
          className="form-radio"
          required={required}
        />
        <label htmlFor={labels[index]} className="mr-5">
          {labels[index]}
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
  required?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, required }) => {

  return (
      <select
          className='border'
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

const participantIdErrorAtom = atom("")
const ageErrorAtom = atom("")
const configVisibleAtom = atom(false)

const DataEntry: React.FC = () => {
  const navigate = useNavigate();

  const [entryData, setEntryData] = useAtom(entryDataAtom)
  const [participantIdError, setParticipantIdError] = useAtom(participantIdErrorAtom)
  const [ageError, setAgeError] = useAtom(ageErrorAtom)
  const [configVisible, setConfigVisible] = useAtom(configVisibleAtom)
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    
    setEntryData((prevEntryData) => ({
      ...prevEntryData,
      [name]: value,
    }));

    if(name==="participantId") {
      if (value.match(/^\d{0,4}$/)) {
        setParticipantIdError('Participant ID must be exactly 4 digits');
      } else {
        setParticipantIdError("");
      }
    }
    if(name==="age") {
      if (value && parseInt(value) < 18) {
          setAgeError('Age must be 18 or above.');
      } else {
          setAgeError("");
      }
    }   
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const age = useSelector((state: RootState) => state.survey.age);

    if (ageError) {
      alert("Age needs to be 18 or above.");
      return; // Prevent form submission
    }
    if (entryData.group === 'Select group') {
      alert("Please select a group.");
      return; // Prevent form submission
    }

      // After saving data navigate to the Slide view
      navigate('/slide');
    }


  return (
    <div className="w-screen h-screen box-border flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-[300px] shadow-md border border-gray-400 p-4">
      <img src={ASSETS_PATH+"logo.jpg"} className="w-full max-w-xs mb-5" alt="Cambridge Logo" />

        <div className="flex justify-between w-full font-sans">
          <label htmlFor="participantId">Participant ID</label>
          <input
            id="participantId"
            type="text"
            className="w-20 h-8 border border-gray-300 rounded px-2"
            maxLength={4}
            minLength={4}
            onChange={handleChange}
            pattern="\d{4}"
            required
          />
            {participantIdError && <div className="text-red-500 text-sm mt-1">{participantIdError}</div>}
        </div>

        <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-sm">Gender</legend>
          <RadioGroup
            required
            name="gender"
            values={["male", "female"]}
            value={entryData.gender}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-sm">Group</legend>
          <Dropdown
            required
            options={['Select group', 'Alcohol', 'Cocaine', 'Heroin', 'Control']}
            value={entryData.group}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-sm">Age</legend>
          <div className="flex flex-col">
            <input
              id="age"
              type="text"
              className="w-10 h-8 border border-gray-300 rounded px-2"
              maxLength={2}
              minLength={2}
              onChange={handleChange}
              required
            />
            {ageError && <div className="text-red-500 text-sm mt-1">{ageError}</div>}
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-sm">Handedness</legend>
          <RadioGroup
            required
            name="handedness"
            values={["left", "right"]}
            value={entryData.handedness}
            onChange={handleChange}
          />
        </fieldset>

        <hr className="h-px border-none bg-gray-600 mb-4" />

        <div className="mx-auto w-fit">
          {configVisible && (
            
            <div>
                      <fieldset className="border border-gray-300 p-2 mb-4">
          <legend className="text-sm">Shopping time</legend>
          <RadioGroup
            required
            name="shopTime"
            values={["10", "15"]}
            labels={["10 min", "15 min"]}
            value={entryData.shopTime}
            onChange={handleChange}
          />
        </fieldset>
              <label>
                <input
                  type="checkbox"
                  name="quickMode"
                  checked={entryData.quickMode}
                  onChange={handleChange}
                />
                Quick mode
              </label>
            </div>
          )}
          <Button type="button" onClick={() => setConfigVisible(!configVisible)}>
            {configVisible ? 'Hide Config' : 'Show Config'}
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
