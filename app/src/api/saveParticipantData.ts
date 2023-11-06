interface ParticipantData {
    participantId: string;
    age: string;
    selectedGroup: string;
    gender: string;
    handedness: string;
}

interface ApiResponse {
    id: number;
}

const saveParticipantData = async (
    participantId: string,
    age: string,
    selectedGroup: string,
    gender: string,
    handedness: string
    ): Promise<void> => {
    try {
        const response = await fetch('http://localhost:3001/add-participant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            participantId,
            age,
            selectedGroup,
            gender,
            handedness,
        }),
        });

        if (!response.ok) {
        throw new Error('Network response was not ok');
        }

        const data: ApiResponse = await response.json();
        console.log('Participant added with ID:', data.id);
    } catch (error) {
        if (error instanceof Error) {
        console.error('There was a problem saving participant data:', error.message);
        } else {
        console.error('There was a problem saving participant data:', error);
        }
    }
};

export default saveParticipantData;
