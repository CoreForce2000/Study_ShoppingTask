import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DataEntry.module.css';
import logo from '/src/assets/logo.jpg'; // Adjust the path to your actual logo
import RadioGroup from './components/RadioGroup/RadioGroup';
import AgeFreetext from './components/AgeFreetext/AgeFreetext';
import Dropdown from './components/Dropdown/Dropdown';
import Config from './components/ValueSelector/Config';
import ParticipantId from './components/ParticipantId/ParticipantId';
import ValueSelector from './components/ValueSelector/Config';
import saveParticipantData from '/src/api/saveParticipantData';


const DataEntry: React.FC = () => {
  const [participantId, setParticipantId] = useState('');
  const [age, setAge] = useState('');
  const [groups, setGroups] = useState<string[]>(['Group A', 'Group B']); // Example groups
  const [selectedGroup, setSelectedGroup] = useState('');
  const [configVisible, setConfigVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [handedness, setHandedness] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform validation or state updates here
    // Assuming you have validation logic here

    // Call the save function with the state variables
    await saveParticipantData(participantId, age, selectedGroup, gender, handedness);

    // After saving data navigate to the Slide view
    navigate('/slide');
  };

  return (
      <form onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          <img src={logo} className={styles.logoImage} alt="Cambridge Logo" />
          
          <ParticipantId setParticipantId={setParticipantId}/>
          
          <fieldset className={styles.fieldsetStyle}>
            <legend className={styles.legend}>Gender</legend>
              <RadioGroup name="gender" options={["male", "female"]} value={gender} setValue={setGender} />
          </fieldset>
          
          <fieldset className={styles.fieldsetStyle}>
            <legend>Group</legend>
            <Dropdown options={groups} value={selectedGroup} setValue={setSelectedGroup} />
          </fieldset>
          
          <fieldset className={styles.fieldsetStyle}>
            <legend>Age</legend>
              <AgeFreetext setAge={setAge} />
          </fieldset>
          
          <fieldset className={styles.fieldsetStyle}>
            <legend className={styles.legend}>Handedness</legend>
            <RadioGroup name="handedness" options={["left", "right"]} value={handedness} setValue={setHandedness} />
          </fieldset>
          
          <hr className={styles.divider} />
          
          <div className={styles.centeredContainer}>
          {configVisible && (
            <div>
              <Link to="shop">Jump to shop</Link> <br />
              <Link to="slide">Jump to Slides</Link>

              <ValueSelector options={groups} setOptions={setGroups}/>
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
