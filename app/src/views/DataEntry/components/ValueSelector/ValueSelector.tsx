import React, { useState } from 'react';
import styles from './ValueSelector.module.css';
import { Link } from 'react-router-dom';

interface ValueSelectorProps {
    options: string[];
    setOptions: (value: string[]) => void,
}

const ValueSelector: React.FC<ValueSelectorProps> = ({ options, setOptions}) => {
    const [newGroup, setNewGroup] = useState('');

    const handleAddGroup = () => {
        if (newGroup) {
            setOptions([...options, newGroup]);
            setNewGroup('');
        }
        };

    return (
        <div>
          <div>
          {options.map((group) => (
              <div key={group}>
              <label>
                  <input
                  type="checkbox"
                  checked
                  onChange={() => setOptions(options.filter((g) => g !== group))}
                  />
                  {group}
              </label>
              </div>
          ))}
          </div>
          <div>
          <input
              type="text"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="Add new group"
          />
          <button onClick={handleAddGroup}>Add Group</button>
          </div>
        </div>
    );
};

export default ValueSelector;



