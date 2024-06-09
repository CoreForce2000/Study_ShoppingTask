const checkIfCorrect = (selected: string, correct: string) => {
  if (selected === correct) {
    setMemoryCorrect((memoryCorrect) => {
      const newMemoryCorrect = [...new Set([...memoryCorrect, selected])];

      if (newMemoryCorrect.length === 4) {
        memoryAllCorrectSound.play();
        setTimeout(() => {
          renderSlide(true);
          dispatch(setIsPhase3(true));
          dispatch(setBlockName("Shopping"));
          navigate("/shop");
        }, 3000);
      } else {
        memoryCorrectSound.play();
      }

      return newMemoryCorrect;
    });
    return true;
  } else {
    memoryWrongSound.play();
    return false;
  }
};
