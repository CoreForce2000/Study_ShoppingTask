import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DataEntry.module.css';
import logo from '/src/assets/logo.jpg';

import RadioGroup from './components/RadioGroup/RadioGroup';
import AgeFreetext from './components/AgeFreetext/AgeFreetext';
import Dropdown from './components/Dropdown/Dropdown';
import ParticipantId from './components/ParticipantId/ParticipantId';

import ValueSelector from './components/ValueSelector/ValueSelector';


import { setParticipantId, setAge, setGroup, setGender, setHandedness } from '../../store/surveySlice'
import { setDeveloperOptions } from '../../store/configSlice'

import saveParticipantData from '../../api/saveParticipantData';
import { RootState } from '../../store/store';
import { createDispatchHandler } from '../../util/reduxUtils';
import FullscreenView from '../../components/FullscreenView/FullscreenView';


const DataEntry: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the useSelector hook to get the data from the Redux store
  const participantData = useSelector((state: RootState) => state.survey);
  const configData = useSelector((state: RootState) => state.config);

  const [configVisible, setConfigVisible] = useState(false);
  const [groups, setGroups] = useState<string[]>(['Alcohol', 'Cocaine', 'Heroin', 'Control']);
  

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
    <FullscreenView style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <form onSubmit={handleSubmit} className={styles.inputBox}>
        <img src={logo} className={styles.logoImage} alt="Cambridge Logo" />

        <ParticipantId required={!configData.developerOptions} setParticipantId={createDispatchHandler(setParticipantId, dispatch)} />

        <fieldset className={styles.fieldsetStyle}>
          <legend className={styles.legend}>Gender</legend>
          <RadioGroup required={!configData.developerOptions}
            name="gender"
            options={["male", "female"]}
            value={participantData.gender}
            setValue={createDispatchHandler(setGender, dispatch)}
          />
        </fieldset>

        <fieldset className={styles.fieldsetStyle}>
          <legend>Group</legend>
          <Dropdown required={!configData.developerOptions}
            options={groups}
            value={participantData.group}
            setValue={createDispatchHandler(setGroup, dispatch)}
          />
        </fieldset>

        <fieldset className={styles.fieldsetStyle}>
          <legend>Age</legend>
          <AgeFreetext required={!configData.developerOptions} 
            setAge={createDispatchHandler(setAge, dispatch)} />
        </fieldset>

        <fieldset className={styles.fieldsetStyle}>
          <legend className={styles.legend}>Handedness</legend>
          <RadioGroup required={!configData.developerOptions}
            name="handedness"
            options={["left", "right"]}
            value={participantData.handedness}
            setValue={createDispatchHandler(setHandedness, dispatch)}
          />
        </fieldset>

        <hr className={styles.divider} />

        <div className={styles.centeredContainer}>
          {configVisible && (
            <div>              
              <fieldset className={styles.fieldsetStyle}>
                <legend className={styles.legend}>Modify groups</legend>
              <ValueSelector options={groups} setOptions={setGroups} />
              </fieldset>

              <Link to="shop">Jump to shop</Link> <br />
              <Link to="slide">Jump to Slides</Link> <br />
              <label>
                <input
                type="checkbox"
                checked={configData.developerOptions}
                onChange={(e) => createDispatchHandler(setDeveloperOptions, dispatch)(e.target.checked)}
                />
                Developer Options    
              </label>
            </div>
          )}
          <button type="button" onClick={() => setConfigVisible(!configVisible)}>
            {configVisible ? 'Hide Config' : 'Show Config'}
          </button>
          <button type="submit" className={styles.runTaskButton}>Run Task</button>
        </div>
      </form>
    </FullscreenView>
    
  );
};

export default DataEntry;
