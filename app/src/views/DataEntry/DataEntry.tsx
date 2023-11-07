import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DataEntry.module.css';
import logo from '/src/assets/logo.jpg';

import RadioGroup from './components/RadioGroup/RadioGroup';
import AgeFreetext from './components/AgeFreetext/AgeFreetext';
import Dropdown from './components/Dropdown/Dropdown';
import ParticipantId from './components/ParticipantId/ParticipantId';

import ValueSelector from './components/ValueSelector/Config';


import { setParticipantId, setAge, setGroup, setGender, setHandedness } from '../../store/surveySlice'

import saveParticipantData from '../../api/saveParticipantData';
import { RootState } from '../../store/store';


const DataEntry: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the useSelector hook to get the data from the Redux store
  const participantData = useSelector((state: RootState) => state.survey);
  const [configVisible, setConfigVisible] = useState(false);
  const [groups, setGroups] = useState<string[]>(['Group A', 'Group B']);

  const createDispatchHandler = (actionCreator: (value: string) => { payload: string; type: string }) => {
    return (value: string) => {
      dispatch(actionCreator(value));
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Call the save function with the participantData from the store
    await saveParticipantData(
      participantData.participantId,
      participantData.age,
      participantData.group,
      participantData.gender,
      participantData.handedness
    );

    // After saving data navigate to the Slide view
    navigate('/slide');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.inputBox}>
        <img src={logo} className={styles.logoImage} alt="Cambridge Logo" />

        <ParticipantId setParticipantId={createDispatchHandler(setParticipantId)} />

        <fieldset className={styles.fieldsetStyle}>
          <legend className={styles.legend}>Gender</legend>
          <RadioGroup
            name="gender"
            options={["male", "female"]}
            value={participantData.gender}
            setValue={createDispatchHandler(setGender)}
          />
        </fieldset>

        <fieldset className={styles.fieldsetStyle}>
          <legend>Group</legend>
          <Dropdown
            options={groups}
            value={participantData.group}
            setValue={createDispatchHandler(setGroup)}
          />
        </fieldset>

        <fieldset className={styles.fieldsetStyle}>
          <legend>Age</legend>
          <AgeFreetext setAge={createDispatchHandler(setAge)} />
        </fieldset>

        <fieldset className={styles.fieldsetStyle}>
          <legend className={styles.legend}>Handedness</legend>
          <RadioGroup
            name="handedness"
            options={["left", "right"]}
            value={participantData.handedness}
            setValue={createDispatchHandler(setHandedness)}
          />
        </fieldset>

        <hr className={styles.divider} />

        <div className={styles.centeredContainer}>
          {configVisible && (
            <div>
              <Link to="shop">Jump to shop</Link> <br />
              <Link to="slide">Jump to Slides</Link>
              <ValueSelector options={groups} setOptions={setGroups} />
            </div>
          )}
          <button onClick={() => setConfigVisible(!configVisible)}>
            {configVisible ? 'Hide Config' : 'Show Config'}
          </button>
          <button type="submit" className={styles.runTaskButton}>Run Task</button>
        </div>
      </div>
    </form>
  );
};

export default DataEntry;
